// 导入必要的模块
import { HoverProvider, TextDocument, Position, Hover, ProviderResult, Token } from 'vscode';
import * as parser from '@babel/parser';
import traverse from "@babel/traverse";
import * as vscode from 'vscode';
import { DocsLang, ParsedDocs } from './types';
import { getComponentNameByJSXAttribute, isComponent } from './utils';


// 自定义 HoverProvider 类
export default class DocsHoverProvider implements HoverProvider {
  private context: vscode.ExtensionContext;
  private language: DocsLang;
  constructor(context: vscode.ExtensionContext, language: string | undefined) {
    this.context = context;
    this.language = language === DocsLang.ZH ? language : DocsLang.EN;
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
    let that = this;
    let markdownText: string  | vscode.MarkdownString = '';
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
      JSXIdentifier(path) {
        const { node, parentPath } = path;
        if (
          node.loc &&
          node.loc.start.line === positionToFind.line &&
          node.loc.start.column <= positionToFind.column &&
          node.loc.end.column >= positionToFind.column
        ) {
          // 找到匹配位置的节点
          const workspaceState = that.context.workspaceState;
          const documentData = workspaceState.get('documentData') as ParsedDocs;
          const parseName = (name: string) => name.toLowerCase();
            const { name } = node;
            const parsedName = parseName(name);
            if (isComponent(name)) {
              const mdTable = documentData[parsedName][that.language].mdTable;
              markdownText = mdTable;
            } else {
              const componentName = getComponentNameByJSXAttribute(path);
              if (componentName && antdImportedComponents.has(componentName.split('.')[0])) {
                const propertyInfo = documentData[parseName(componentName)][that.language].properties?.[name];
                const { description, type, default: _default } = propertyInfo;
                // TODO: 中文
                const md = new vscode.MarkdownString(`**description**: ${description}  \n **type**: ${type}  \n **default**: ${_default}`);
                markdownText = md;
              }

            }
        }
      },
    });

    if (markdownText) {
      return new Hover(markdownText);
    }
    // 返回一个 Hover 对象，用于显示悬停提示
  }
}
