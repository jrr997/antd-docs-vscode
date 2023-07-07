import { DocsLang, DocsMap, ParsedComponentProperty, ParsedDocsMap, ParsedComponent, PendingComponent } from '../types';
import { Processor, unified } from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import remarkGfm, { Root } from 'remark-gfm';
import { Heading, Parent, Table, Text } from "mdast";
import { DOC_LANG } from "../constant";
import { getComponentParseConfig } from './getComponentParseConfig';
import { ComponentParseConfig, CommonParseConfig } from '../types';
import { toArray } from '../utils';
import { parseComponent } from './parseUtil';

export const parseDoc = (docsMap: DocsMap) => {

  const processor = unified().use(parse).use(remarkGfm).use(stringify);
  const parsedDocsMap: ParsedDocsMap = {};

  console.log('Parsing started!');

  for (const [name, value] of Object.entries(docsMap)) {
    const parseConfigs = getComponentParseConfig(name);
    for (const config of parseConfigs) {
      console.log(config.name, config);
      
      if ('parser' in config) {
        const parsedComponent = config.parser(config, value, processor);
        parsedDocsMap[parsedComponent.name] = parsedComponent.value;
      } else {
        const parsedComponent = parseComponent(config, value, processor);
        parsedDocsMap[parsedComponent.name] = parsedComponent.value;
      }
    }
  }

  console.log('Parsing completed!');
  console.log('ParsedDocs: ', parsedDocsMap);

  return parsedDocsMap;
};

