import { DocsLang, DocsMap, ParsedComponentProperty, ParsedDocsMap, ParsedComponent, PendingComponent, CustomParser } from '../types';
import { Processor, unified } from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import remarkGfm, { Root } from 'remark-gfm';
import { Heading, Parent, Table, Text } from "mdast";
import { DOC_LANG } from "../constant";
import { getComponentParseConfig } from './getComponentParseConfig';
import { ComponentParseConfig, CommonParseConfig } from '../types';
import { getComponentLink } from '../utils';
import { correctMdLink, parseComponent, toArray } from './parseUtil';

export const parseDoc = (docsMap: DocsMap, version: string) => {

  const processor = unified().use(parse).use(remarkGfm).use(stringify);
  const parsedDocsMap: ParsedDocsMap = {};
  const parsedVersion = 'v' + version[0] as 'v4' | 'v5';
  console.log('Parsing started!');

  for (const [name, value] of Object.entries(docsMap)) {
    const parseConfigs = getComponentParseConfig(name);
    for (const config of parseConfigs) {
      const parser = config?.parser as CustomParser ?? parseComponent;   
      const parsedComponent = parser(config, value, processor, parsedDocsMap);

      for (let lang in parsedComponent.value) {
        const parsedComponentValue = parsedComponent.value[lang as DocsLang];
        if (parsedComponentValue) {
          const prefix = getComponentLink(name, parsedVersion, lang as DocsLang, '');
          parsedComponentValue.mdTable = correctMdLink(parsedComponentValue.mdTable, processor, prefix);
        }
      }
      
      parsedDocsMap[parsedComponent.name] = parsedComponent.value;  
    }
  }

  console.log('Parsing completed!');
  console.log('ParsedDocs: ', parsedDocsMap);

  return parsedDocsMap;
};

