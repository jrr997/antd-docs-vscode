import * as vscode from 'vscode';
import { fetchDocs } from './fetchDocs';
import { parseDoc } from './parse/parseDocs';
import DocsHoverProvider from './docHoverProvider';
import { versionToRef } from './utils';

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

  const fetchAndParseDocs = async (version: string) => {
    const ref = versionToRef(version);
    console.log('fetchAndParseDocs', ref);
    
    if (!ref) {
      vscode.window.showInformationMessage(`Failed! Version ${version} is invalid, version should be set to "4" or "5".`);
    }

    const docsMap = await fetchDocs(ref!);
    if (docsMap) {
      const parsedDocs = parseDoc(docsMap, version);
      workspaceState.update('documentData', { parsedDocs, version });
      return true;
    }
  };

  // TODO:
  const shouldFetch = () => { 
    return true;
  };

  let setVersion = vscode.commands.registerCommand('AntdDoc.setVersion', async () => {
    const currentVersion = config.get('docVersion') as string;

    const options = [
      { label: '4', description: currentVersion === '4' ? '(current)' : undefined},
      { label: '5', description: currentVersion === '5' ? '(current)' : undefined},
    ];

    const inputVersion = await vscode.window.showQuickPick( options,{
      placeHolder: 'Select a version',
    });
    const label = inputVersion?.label;
    if (label) {
      config.update('docVersion', label);
      vscode.window.showInformationMessage(`Version changed! Start to update docs v${label}`);
      const fetchSuccessfully = await fetchAndParseDocs(label);
      if (fetchSuccessfully) {
        vscode.window.showInformationMessage(`Fetch docs v${label} successfully!`);
      }
    } else {
      vscode.window.showErrorMessage(`Failed! Version ${label} is invalid.`);
    }
  });

  const  docHoverProvider = new DocsHoverProvider(context, languageInWorkspace!);
  const provider = vscode.languages.registerHoverProvider(['typescript', 'typescriptreact', 'javascript', 'javascriptreact'], docHoverProvider);

  let listener = vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('AntdDocs.docVersion')) {
      const version = vscode.workspace.getConfiguration('AntdDocs').get('docVersion') as string;
      console.log('version listener', version);
      fetchAndParseDocs(version);
    }
    if (event.affectsConfiguration('AntdDocs.language')) {
      const language = vscode.workspace.getConfiguration('AntdDocs').get('language') as string;
      docHoverProvider.updateLanguage(language);
      workspaceState.update('language', language);
    }
  });

  context.subscriptions.push(setVersion, provider, listener);

  if (versionInWorkspace) {
    if (shouldFetch()) {
      fetchAndParseDocs(versionInWorkspace).catch(err => {
        console.log(err);
      });
    }
  }
}



