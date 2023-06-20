import * as vscode from 'vscode';
import { fetchDoc } from './getSourceDoc';
import DocHoverProvider from './docHoverProvider';


export async function activate(context: vscode.ExtensionContext) {
  // 获取插件的设置对象
  const config = vscode.workspace.getConfiguration('AntdDoc');
  const versionInWorkspace = config.get('docVersion');
  console.log('version: ', versionInWorkspace);
  // TODO: 根据版本获取文档
  if (versionInWorkspace) {
    const workspaceState = context.workspaceState;
    const documentData = workspaceState.get('documentData');
    // TODO: 存储 documentData 版本，与 versionInWorkspace 比较，不同则提示更新
    if (documentData) {
      console.log('docsMap existed!');
    } else {
      const docsMap = await fetchDoc();
      if (docsMap) {
        console.log('fetch Doc complete!');
        workspaceState.update('documentData', docsMap);
      }
    }
  }
  console.log('Congratulations, your extension "antd-doc" is now active!');

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

  const provider = vscode.languages.registerHoverProvider(['typescript', 'typescriptreact', 'javascript'], new DocHoverProvider()) ;

  context.subscriptions.push(setVersion, listener, provider );
}



