import { DocsLang, DocsMap, ParsedComponentProperty, ParsedDocsMap, ParsedComponent, PendingComponent, CustomParser } from '../types';
import { getComponentParseConfig } from './getComponentParseConfig';
import { getComponentLink } from '../utils';
import { correctMdLink, parseComponent, toArray } from './parseUtil';
import { processor } from './processor';

export const parseDoc = (docsMap: DocsMap, version: string) => {
  const parsedDocsMap: ParsedDocsMap = {};
  const parsedVersion = 'v' + version[0] as 'v4' | 'v5';
  console.log('Parsing started!');

  for (const [name, value] of Object.entries(docsMap)) {
    const parseConfigs = getComponentParseConfig(name);
    for (const config of parseConfigs) {
      const parser = config?.parser as CustomParser ?? parseComponent;
      const parsedComponent = parser(config, value, processor, parsedDocsMap, docsMap);

      for (let lang in parsedComponent.value) {
        const parsedComponentValue = parsedComponent.value[lang as DocsLang];
        if (parsedComponentValue) {
          const prefix = getComponentLink(name, parsedVersion, lang as DocsLang, '');
          parsedComponentValue.mdTable = correctMdLink(parsedComponentValue.mdTable, processor, prefix, lang, parsedVersion);
        }
      }

      parsedDocsMap[parsedComponent.name] = parsedComponent.value;
    }
  }

  console.log('Parsing completed!');
  console.log('ParsedDocs: ', parsedDocsMap);

  return parsedDocsMap;
};

