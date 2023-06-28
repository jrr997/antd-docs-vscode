import { HoverProvider, TextDocument, Position, Hover, ProviderResult, Token } from 'vscode';
import * as parser from '@babel/parser';
import traverse from "@babel/traverse";
import * as vscode from 'vscode';
import { DocsLang, ParsedComponentProperty, ParsedDocs } from './types';
import { getComponentNameByJSXAttribute, isComponent } from './utils';


export default class DocsHoverProvider implements HoverProvider {
  private context: vscode.ExtensionContext;
  private language: DocsLang;

  constructor(context: vscode.ExtensionContext, language: string | undefined) {
    this.context = context;
    this.language = language === DocsLang.ZH ? language : DocsLang.EN;
  }

  provideHover(document: TextDocument, position: Position, token: Token): ProviderResult<Hover> {
    if (token.isCancellationRequested) { return; }
    const ast = parser.parse(document.getText(), {
      sourceType: "module",
      plugins: ['typescript', 'jsx']
    });

    const positionToFind = {
      line: position.line + 1, // position.line starts from 0
      column: position.character
    };
    const antdImportedComponents = new Set<string>();
    let that = this;
    let markdownText: string  | vscode.MarkdownString = '';

    traverse(ast, {
      ImportDeclaration: (path) => {
        if (path.node.source.value === 'antd') {
          const specifiers = path.node.specifiers;
          specifiers.map(specifier => {
            const componentName = specifier.local.name;
            antdImportedComponents.add(componentName);
          });
        }
      },
      JSXIdentifier(path) {
        const { node } = path;
        if (
          node.loc &&
          node.loc.start.line === positionToFind.line &&
          node.loc.start.column <= positionToFind.column &&
          node.loc.end.column >= positionToFind.column
        ) {
          const workspaceState = that.context.workspaceState;
          const documentData = workspaceState.get('documentData') as ParsedDocs;
          const parseName = (name: string) => name.toLowerCase();
            const { name } = node;
            const parsedName = parseName(name);
            if (isComponent(name)) {
              const mdTable = documentData[parsedName][that.language].mdTable;
              markdownText = mdTable;
            } else { // property
              const componentName = getComponentNameByJSXAttribute(path);
              if (componentName && antdImportedComponents.has(componentName.split('.')[0])) {
                console.log(name);
                const p = documentData[parseName(componentName)][that.language].properties;
                console.log(p);
                console.log(p?.[name]);
                
                const propertyInfo = documentData[parseName(componentName)][that.language].properties?.[name];
                markdownText = getPropertyHoverMd(propertyInfo, that.language);
              }

            }
        }
      },
    });

    if (markdownText) {
      console.log(markdownText);
      
      return new Hover(markdownText);
    }
  }
}

const getPropertyHoverMd = (propertyInfo: ParsedComponentProperty, language: DocsLang): vscode.MarkdownString => {
  const { description, type, default: _default } = propertyInfo;
  if (language === DocsLang.ZH) {
    return new vscode.MarkdownString(`**描述**: ${description}  \n **类型**: ${type}  \n **默认值**: ${_default}`);
  } else {
    return new vscode.MarkdownString(`**description**: ${description}  \n **type**: ${type}  \n **default**: ${_default}`);
  }
};
