// 导入必要的模块
import { HoverProvider, TextDocument, Position, Hover, ProviderResult, Token } from 'vscode';
import * as parser from '@babel/parser';
import traverse from "@babel/traverse";
import * as vscode from 'vscode';


// 自定义 HoverProvider 类
export default class DocsHoverProvider implements HoverProvider {
  private context: vscode.ExtensionContext;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }
  provideHover(document: TextDocument, position: Position, token: Token): ProviderResult<Hover> {
    if (token.isCancellationRequested) { return; }
    // 根据位置信息分析代码并生成悬停提示信息
    const wordRange = document.getWordRangeAtPosition(position);
    const word = document.getText(wordRange);
    console.log(position, token);
    const ast = parser.parse(document.getText(), {
      sourceType: "module",
      plugins: ['typescript', 'jsx']
    });
    // console.log(ast);
    const positionToFind = {
      line: position.line + 1, // position.line starts from 0
      column: position.character
    };
    console.log('positionToFind:', positionToFind);

    const antdImportedComponents = new Set<string>();
    const context = this.context;
    let markdownText: string = '';
    traverse(ast, {
      ImportDeclaration: (path) => {
        console.log('path:', path);
        if (path.node.source.value === 'antd') {
          const specifiers = path.node.specifiers;
          specifiers.map(specifier => {
            const componentName = specifier.local.name;
            antdImportedComponents.add(componentName);
          });
        }
      },
      enter(path) {
        const { node, parentPath } = path;
        if (
          node.loc &&
          node.loc.start.line === positionToFind.line &&
          node.loc.start.column <= positionToFind.column &&
          node.loc.end.column >= positionToFind.column
        ) {
          // 找到匹配位置的节点
          // console.log('Found Node:', node.type);
          // console.log('Node Value:', node);
          if (node.type === 'JSXIdentifier') {
            const { name } = node;
            const parseName = (name: string) => name.toLowerCase();
            const parsedName = parseName(name);
            const workspaceState = context.workspaceState;
            const documentData = workspaceState.get('documentData');
            const mdTable = documentData[parsedName]['zh-CN'].mdTable;
            console.log(documentData,mdTable);
            markdownText = mdTable;
            return; 
            // TODO: 显示组件API
          } else if (node.type === 'JSXAttribute') {

          }
        }
      },
    });
    // console.log('antdImportedComponents:', antdImportedComponents);

    if (markdownText) {
      return new Hover(markdownText);
    }
    // 返回一个 Hover 对象，用于显示悬停提示
  }
}
