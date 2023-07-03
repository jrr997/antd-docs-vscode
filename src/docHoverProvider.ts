import { HoverProvider, TextDocument, Position, Hover, ProviderResult, CancellationToken } from 'vscode';
import * as parser from '@babel/parser';
import traverse, { Node } from "@babel/traverse";
import * as vscode from 'vscode';
import { DocsLang, ParsedComponentProperty, ParsedDocs } from './types';
import { getComponentNameFromJSXAttribute, getComponentNameFromOpeningJSXElement, isComponent } from './utils';

const IsNodeAtPosition = (node: Node, position: Position): boolean => {
  const positionToFind = {
    line: position.line + 1, // position.line starts from 0
    column: position.character
  };
  return !!(node.loc &&
    node.loc.start.line === positionToFind.line &&
    node.loc.start.column <= positionToFind.column &&
    node.loc.end.column >= positionToFind.column);
};

export default class DocsHoverProvider implements HoverProvider {
  private context: vscode.ExtensionContext;
  private language: DocsLang;

  constructor(context: vscode.ExtensionContext, language: string | undefined) {
    this.context = context;
    this.language = language === DocsLang.ZH ? language : DocsLang.EN;
  }

  provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
    if (token.isCancellationRequested) { return; }
    const ast = parser.parse(document.getText(), {
      sourceType: "module",
      plugins: ['typescript', 'jsx']
    });
    
    const antdImportedComponents = new Set<string>();
    let that = this;
    let markdownText: string | vscode.MarkdownString = '';

    const workspaceState = that.context.workspaceState;
    const documentData = workspaceState.get('documentData') as ParsedDocs;

    traverse(ast, {
      ImportDeclaration: (path) => {
        if (path.node.source.value === 'antd') {
          const specifiers = path.node.specifiers;
          specifiers.map(specifier => {
            const componentName = specifier.local.name.toLowerCase();
            antdImportedComponents.add(componentName);
          });
        }
      },
      JSXAttribute(path) {
        const { node } = path;
        if (IsNodeAtPosition(node, position)) {
          console.log(node);
          
          if (node.name.type === 'JSXIdentifier') {
            const attributeName = node.name.name;
            const componentName = getComponentNameFromJSXAttribute(path);
            if (componentName && antdImportedComponents.has(componentName.split('.')[0].toLowerCase())) {
              const propertyInfo = documentData[componentName.toLowerCase()][that.language].properties?.[attributeName];
              markdownText = getPropertyHoverMd(propertyInfo, that.language);
              console.log(attributeName);
            }
          }
        }
      },
      JSXOpeningElement(path) {
        const { node } = path;
        if (IsNodeAtPosition(node.name, position)) {
          // let componentName: string = '';
          // if (node.name.type === 'JSXIdentifier') {
          //   componentName = node.name.name.toLowerCase();
          // } else if (node.name.type === 'JSXMemberExpression') {
          //   const { object, property } = node.name;
          //   if (object.type === 'JSXIdentifier') {
          //     const subName = property.name;
          //     const name = object.name;
          //     componentName = `${name.toLowerCase()}.${subName.toLowerCase()}`;
          //   }
          // }
          let componentName = getComponentNameFromOpeningJSXElement(node).toLowerCase();
          if (componentName && antdImportedComponents.has(componentName.split('.')[0])) {
            console.log(componentName);
            const mdTable = documentData[componentName][that.language].mdTable;
            markdownText = mdTable;
          }
        }
      }
    });

    if (markdownText) {
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
