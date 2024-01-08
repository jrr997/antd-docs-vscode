import * as vscode from 'vscode';
import { fetchDoc } from './fetchDocs';
import { parseDoc } from './parse/parseDocs';
import DocsHoverProvider from './docHoverProvider';
import { ParsedDocsState } from './types';
import { validateVersion, versionToRef } from './utils';

export async function activate(context: vscode.ExtensionContext) {
  const workspaceState = context.workspaceState;
  const config = vscode.workspace.getConfiguration('AntdDocs');
  const versionInWorkspace = config.get('docVersion') as string | undefined;
  const languageInWorkspace = config.get('language') as string | undefined;

  const githubToken = config.get('githubToken') as string;
  if (!githubToken) {
    vscode.window.showInformationMessage('Please set your github token in AntdDocs.githubToken');
    return;
  }

  const fetchAndParseDocs = async (version: string, token: string) => {
    const ref = versionToRef(version);
    console.log('Fetching Docs!');
    console.log('docs version: ' + version, ' ref: ' + ref);
    const docsMap = await fetchDoc(ref, token);
    if (docsMap) {
      console.log('fetch Doc successfully!');
      const parsedDocs = parseDoc(docsMap, version);
      workspaceState.update('documentData', { parsedDocs, version });
      return true;
    }
  };

  // Fetch docs when github token exists and version is valid
  const shouldFetch = () => {
    const githubToken = config.get('githubToken') as string;
    if (!githubToken) { return false; }
    // TODO: check the latest version in repo First, then compare to local version to decide whether to fetch 
    if (versionInWorkspace === '4.x' || versionInWorkspace === '5.x') { return true; }
    const documentData = workspaceState.get('documentData') as ParsedDocsState;
    if (!documentData?.parsedDocs || !Object.keys(documentData.parsedDocs).length) { return true; }
    const { version } = documentData;
    return validateVersion(versionInWorkspace) && version !== versionInWorkspace;
  };

  let setVersion = vscode.commands.registerCommand('AntdDoc.setVersion', async () => {
    const inputVersion = await vscode.window.showInputBox({
      title: `Antd Doc Version(${versionInWorkspace} currently)`,
      placeHolder: '4.0.0, 5.6.1...', // TODO: a better placeholder
    });
    if (validateVersion(inputVersion)) {
      config.update('docVersion', inputVersion);
      vscode.window.showInformationMessage(`Version changed! Start to update docs v${inputVersion}`);
      // TODO: 闭包可能导致githubToken为空
      const fetchSuccessfully = await fetchAndParseDocs(inputVersion!, githubToken);
      if (fetchSuccessfully) {
        vscode.window.showInformationMessage(`Fetch docs v${inputVersion} fetchSuccessfully!`);

      }
    } else {
      vscode.window.showInformationMessage(`Failed! Version ${inputVersion} is invalid.`);
    }
  });

  let listener = vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('AntdDocs.githubToken')) {
      const config = vscode.workspace.getConfiguration('AntdDocs');
      const newToken = config.get('githubToken') as string;
      if (shouldFetch()) {
        fetchAndParseDocs(versionInWorkspace!, newToken);
      }
    }
  });

  const provider = vscode.languages.registerHoverProvider(['typescript', 'typescriptreact', 'javascript', 'javascriptreact'], new DocsHoverProvider(context, languageInWorkspace));

  context.subscriptions.push(setVersion, provider, listener);

  // Fetch after subscriptions since it may take a long time and block pushing subscriptions
  console.log('versionInWorkspace: ', versionInWorkspace);
  if (versionInWorkspace) {
    // workspaceState.update('documentData', undefined); // For debugging docs fetching and parsing, please do not remove it.
    if (shouldFetch()) {
      fetchAndParseDocs(versionInWorkspace, githubToken).catch(err => {
        console.log(err);
      });
    }
  }
}



