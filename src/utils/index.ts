import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { ANTD_LINK, DOC_LANG, LATEST_VERSIONS } from '../constant';
import { DocsLang } from '../types';
import { parseConfigMap } from '../parse/config';

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

export function getComponentNameFromOpeningOrClosingJSXElement(node: t.JSXOpeningElement | t.JSXClosingElement): string {
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

export function versionToRef(version: string) {
  if (version.startsWith("4")) {
    return 'output4';
  } else if (version.startsWith("5") || !version) {
    return "output";
  } else {
    // For compatibility
    return "output";
  }
}

export const getComponentLink = (componentName: string, version: 'v4' | 'v5', lang: DocsLang, anchor = version === 'v4' ? 'API' : 'api') => {
  // Some components'link are not the same with their name. e.g. 'row'/ 'col' -> 'Grid'
  // And some like form.item should link to form
  const componentNameInUrl = Object.entries(parseConfigMap).find(([_, value]) => {
    const names = value.map(item => item.name);
    return names.includes(componentName);
  })?.[0] ?? componentName;

  const formattedName = componentNameInUrl[0] + componentNameInUrl.slice(1).replaceAll(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
  const prefix = ANTD_LINK[version];
  return `${prefix}/components/${formattedName}${lang === DOC_LANG.ZH ? '-cn' : ''}${anchor ? `#${anchor}` : ''}`;
};

export const getUpperCaseName = (componentName: string) => {
  return componentName[0].toUpperCase() + componentName.slice(1).replaceAll(/\.[a-z]/g, (match) => `${match.toUpperCase()}`);
};

const anchorMap = Object.fromEntries(Object.values(parseConfigMap).flatMap(item => item).map(item => [item.name, item?.heading]));

export const getHoverHeader = (componentName: string, version: 'v4' | 'v5', anchor = version === 'v4' ? 'API' : 'api') => {
  // Now we fallback to use the anchor 'api' when heading is an array.
  const _anchor = Array.isArray(anchorMap[componentName]) ? undefined : anchorMap[componentName] as string;
  // Some components'link are not the same with their name. e.g. 'row'/ 'col' -> 'Grid'
  // and in v5 anchor is not the same with v4
  // row is 'grid-xx#col' in v5, but 'grid-xx#Col' in v4
  const formattedAnchor = version === 'v4' ? (_anchor ?? anchor).replaceAll('.', '') : (_anchor ?? anchor).toLowerCase().replaceAll('.', '');
  const upperCaseName = getUpperCaseName(componentName);
  const enLink = getComponentLink(componentName, version, DocsLang.EN, formattedAnchor);
  const zhLink = getComponentLink(componentName, version, DocsLang.ZH, formattedAnchor);
  return `${upperCaseName} | [EN](${enLink}) | [中文](${zhLink})`;
};