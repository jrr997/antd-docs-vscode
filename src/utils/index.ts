import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export function getComponentNameByJSXAttribute(path: NodePath<t.Node>): string | undefined {
  const jsxElement = path.findParent(p => t.isJSXElement(p.node));
  if (jsxElement) {
    const openingElement = (jsxElement.node as t.JSXElement).openingElement;
    let componentName;
    if (t.isJSXIdentifier(openingElement.name)) {
      componentName = openingElement.name.name;
    } else if (t.isJSXMemberExpression(openingElement.name)) {
      componentName = (openingElement.name.object as t.JSXIdentifier).name + '.' + openingElement.name.property.name;
    } else {
      console.log(`'Can't find componentName from JSXAttribute Node`);
    }
    return componentName;
  }
}