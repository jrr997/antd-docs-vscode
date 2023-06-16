const fs = require('fs');
const path = require('path');
import * as vscode from 'vscode';


// 获取插件的扩展目录
// const workspaceStoragePath = vscode.workspace.workspaceFolders[0].uri.fsPath;


export const saveDocs =  (data: any) => {
  // 定义存储文件的目录
  // console.log('saveDocs');
  
  // const storagePath = path.join(extensionPath, 'storage1');
  // console.log(storagePath);

  // // 创建存储文件的目录
  // fs.mkdirSync(storagePath, { recursive: true });

  // // 定义要写入的JSON对象

  // // 将JSON对象转换为字符串
  // const jsonString = JSON.stringify(data);

  // // 写入JSON字符串到文件中
  // fs.writeFileSync(path.join(storagePath, 'myFile.json'), jsonString, 'utf-8');

};





