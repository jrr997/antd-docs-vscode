import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export function getComponentNameFromJSXAttribute(path: NodePath<t.Node>): string | undefined {
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

export function isComponent(name: string) {
  return name[0].toLowerCase() !== name[0];
}

export function getComponentNameFromOpeningJSXElement(node: t.JSXOpeningElement): string {
  const getName = (node: t.JSXIdentifier | t.JSXMemberExpression, pre = ''): string => {
    if (node.type === 'JSXIdentifier') {
      return pre ? `${pre}.${node.name}` : node.name;
    } else {
      const { object, property } = node;
      const subName = property.name;
      return `${getName(object, pre)}.${subName}`;
    }
  };
  return getName(node.name as t.JSXIdentifier | t.JSXMemberExpression);
}

export function validateVersion(version?: string): boolean  {
  if (!version) {return false;}
  let re =  /^\d+\.\d+\.\d+$/;
  return re.test(version);
}

export const toArray = (arg: unknown | unknown[]) => Array.isArray(arg) ? arg : [arg];