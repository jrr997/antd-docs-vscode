// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // 获取插件的设置对象
  const config = vscode.workspace.getConfiguration('AntdDoc');
  const versionInWorkspace = config.get('docVersion');
  console.log('version: ', versionInWorkspace);
  
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "antd-doc" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
  let setVersion = vscode.commands.registerCommand('AntdDoc.setVersion', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
    const inputVersion = await vscode.window.showInputBox({
      title: `Antd Doc Version(${versionInWorkspace} currently)`,
      placeHolder: '4.x, 5.x, 5.6.1 ...', // TODO: a better placeholder
    });
    // TODO: validate version before update
    // TODO: change workspace setting
    await config.update('docVersion', inputVersion );
	});

  let listener = vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('AntdDoc.docVersion')) {
      // 执行相应操作
      const config = vscode.workspace.getConfiguration('AntdDoc');
      const newVersion = config.get('docVersion');
      vscode.window.showInformationMessage(`Version changed! Antd Doc version is "${newVersion}"`);
    }
  });
  context.subscriptions.push(setVersion, listener);
}

// This method is called when your extension is deactivated
export function deactivate() {}
