import * as vscode from 'vscode';
import { fetchDoc } from './getSourceDoc';
import { parseDoc } from  './parseDoc';
import DocsHoverProvider from './docHoverProvider';
import { DocsLang } from './types';

export async function activate(context: vscode.ExtensionContext) {
  // 获取插件的设置对象
  // const parsedDoc = parseDoc();
  const config = vscode.workspace.getConfiguration('AntdDoc');
  const versionInWorkspace = config.get('docVersion');
  const languageInWorkspace = config.get('language') as string | undefined;
  // TODO: 根据版本获取文档
  if (versionInWorkspace) {
    const workspaceState = context.workspaceState;
    // For debugging docs fetching and parsing, please do not remove it.
    // workspaceState.update('documentData',  undefined);
    const documentData = workspaceState.get('documentData');
    // TODO: 存储 documentData 版本，与 versionInWorkspace 比较，不同则提示更新
    if (documentData) {
      console.log('docsMap existed!');
      console.log(documentData);
      
      // const parsedDoc = parseDoc(documentData);

    } else {
      console.log('fetching Docs!');
      const docsMap = await fetchDoc();
      if (docsMap) {
        console.log('fetch Doc successfully!');
        const parsedDoc = parseDoc(docsMap);
        workspaceState.update('documentData', parsedDoc);
      }
    }
  }

  let setVersion = vscode.commands.registerCommand('AntdDoc.setVersion', async () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    const inputVersion = await vscode.window.showInputBox({
      title: `Antd Doc Version(${versionInWorkspace} currently)`,
      placeHolder: '4.x, 5.x, 5.6.1 ...', // TODO: a better placeholder
    });
    // TODO: validate version before update
    // TODO: change workspace setting
    await config.update('docVersion', inputVersion);
  });

  let listener = vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('AntdDoc.docVersion')) {
      // 执行相应操作
      const config = vscode.workspace.getConfiguration('AntdDoc');
      const newVersion = config.get('docVersion');
      vscode.window.showInformationMessage(`Version changed! Antd Doc version is "${newVersion}"`);
    }
  });

  const provider = vscode.languages.registerHoverProvider(['typescript', 'typescriptreact', 'javascript'], new DocsHoverProvider(context, languageInWorkspace)) ;

  context.subscriptions.push(setVersion, listener, provider );
}



