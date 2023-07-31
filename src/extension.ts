import * as vscode from 'vscode';
import { fetchDoc } from './fetchDocs';
import { parseDoc } from './parse/parseDocs';
import DocsHoverProvider from './docHoverProvider';
import { ParsedDocsState } from './types';
import { validateVersion } from './utils';

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

  // Fetch docs when github token exists and version is valid
  const shouldFetch = () => {
    const githubToken = config.get('githubToken') as string;
    if (!githubToken) { return false; }
    const documentData = workspaceState.get('documentData') as ParsedDocsState;
    if (!documentData?.parsedDocs || !Object.keys(documentData.parsedDocs).length) { return false; }
    const { version } = documentData;
    return validateVersion(versionInWorkspace) && version !== versionInWorkspace;
  };

  const fetchAndParseDocs = async (version: string, token: string) => {
    console.log('Fetching Docs!');
    console.log('docs version: ' + version);

    const docsMap = await fetchDoc(version, token);
    if (docsMap) {
      console.log('fetch Doc successfully!');
      const parsedDocs = parseDoc(docsMap, version);
      workspaceState.update('documentData', { parsedDocs, version });
    }
  };
  console.log('versionInWorkspace: ', versionInWorkspace);

  if (versionInWorkspace) {
    workspaceState.update('documentData', undefined); // For debugging docs fetching and parsing, please do not remove it.
    const documentData = workspaceState.get('documentData') as ParsedDocsState;
    if (documentData && versionInWorkspace === documentData.version) {
      console.log('docsMap existed!', documentData);
    } else if (validateVersion(versionInWorkspace)) {
      fetchAndParseDocs(versionInWorkspace, githubToken);
    }
  }

  let setVersion = vscode.commands.registerCommand('AntdDoc.setVersion', async () => {
    const inputVersion = await vscode.window.showInputBox({
      title: `Antd Doc Version(${versionInWorkspace} currently)`,
      placeHolder: '4.0.0, 5.6.1...', // TODO: a better placeholder
    });
    if (validateVersion(inputVersion)) {
      config.update('docVersion', inputVersion);
      vscode.window.showInformationMessage(`Version changed! Start to update docs v${inputVersion}`);
      // TODO: 闭包可能导致githubToken为空
      fetchAndParseDocs(inputVersion!, githubToken);
    } else {
      vscode.window.showInformationMessage(`Failed! Version ${inputVersion} is invalid.`);
    }
  });

  let listener = vscode.workspace.onDidChangeConfiguration(event => {
    // if (event.affectsConfiguration('AntdDoc.docVersion')) {
    //   const config = vscode.workspace.getConfiguration('AntdDoc');
    //   const newVersion = config.get('docVersion') as string;
    //   if (validateVersion(newVersion)) {
    //     config.update('docVersion', newVersion);
    //     vscode.window.showInformationMessage(`Version changed! Antd Docs version is "${newVersion}"`);
    //     fetchAndParseDocs(newVersion);
    //   }
    // }
    if (event.affectsConfiguration('AntdDocs.githubToken')) {
      const config = vscode.workspace.getConfiguration('AntdDocs');
      const newToken = config.get('githubToken') as string;
      if (shouldFetch()) {
        fetchAndParseDocs(versionInWorkspace!, newToken);
      }
    }
  });

  const provider = vscode.languages.registerHoverProvider(['typescript', 'typescriptreact', 'javascript'], new DocsHoverProvider(context, languageInWorkspace));

  context.subscriptions.push(setVersion, provider, listener);
}



