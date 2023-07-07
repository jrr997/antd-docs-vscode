import { DocsLang, DocsMap, ParsedComponentProperty, ParsedDocsMap, ParsedComponent, PendingComponent, CustomParser } from '../types';
import { Processor, unified } from 'unified';
import { visit } from 'unist-util-visit';
import { Heading, Parent, Root, Table, Text } from "mdast";
import { DOC_LANG } from "../constant";
import { ComponentParseConfig, CommonParseConfig } from '../types';
import { toArray } from '../utils';

// Parse rawDocs for most components. Some components are special and should implement their own parser. 
export const parseComponent = ({ heading, name: componentName, index: tableIndex = 0 }: CommonParseConfig, docsMapItem: DocsMap[string], processor: Processor<Root, Root, Root, string>): PendingComponent => {
  const formattedComponentName = componentName.replaceAll('-', '');
  const pendingComponent: PendingComponent = {
    name: formattedComponentName,
    value: {
      [DOC_LANG.ZH]: undefined,
      [DOC_LANG.EN]: undefined,
    }
  };

  for (const [lang, rawDocs] of Object.entries(docsMapItem)) {
    const tree = processor.parse(rawDocs);
    let foundTable: Table | null = null;

    visit(tree, 'heading', (node, index, parent) => {
      if (foundTable) { return; };
      if (node.children[0].type === 'text' && toArray(heading).includes(node.children[0].value)) {
        const nextTable = parent?.children.slice(index!).filter(item => item.type === 'table')[tableIndex] as Table;
        foundTable = nextTable;
      }
    });

    if (foundTable) {
      const parsedComponent = parseComponentTable(foundTable, processor);
      pendingComponent.value[lang as DocsLang] = parsedComponent;
    } else {
      console.log('Table not found: ', componentName, lang, heading, tableIndex);
    }
  }

  return pendingComponent;
};

// TODO: 对Link特殊处理，#开头的自动拼接前缀以打开文档页
// Parse all properties according to the markdown table.
export const parseComponentTable = (table: Table, processor: any): ParsedComponent => {
  const propertyRows = table.children.slice(1);

  const propertyMap = propertyRows.reduce<Record<string, ParsedComponentProperty>>((obj, row) => {
    const property = (row.children[0].children[0] as Text).value;
    const [description, type, _default, version] = row.children.slice(1).map(tableCell => {
      return processor.stringify(tableCell as unknown as Root);
    });
    obj[property] = {
      description,
      type,
      version,
      default: _default,
    };
    return obj;
  }, {});

  return {
    mdTable: processor.stringify(table),
    properties: propertyMap
  };
};

// =============================== custom parser ===============================

export const datePickerParser: CustomParser = (config, docsMapItem, processor) =>  {

  const datePickerParserImpl: CustomParser = ({ name: componentName }, docsMapItem, processor) => {
    const formattedComponentName = componentName.replaceAll('-', '');
    const pendingComponent: PendingComponent = {
      name: formattedComponentName,
      value: {
        [DOC_LANG.ZH]: undefined,
        [DOC_LANG.EN]: undefined,
      }
    };

    for (const [lang, rawDocs] of Object.entries(docsMapItem)) {
      const tree = processor.parse(rawDocs);
      let foundTable: Table | null = null;

      visit(tree, 'text', (node, index, parent) => {
        if (foundTable) { return; };
        // if (node.children[0].type === 'text' && toArray(heading).includes(node.children[0].value)) {
        //   const nextTable = parent?.children.slice(index!).filter(item => item.type === 'table')[tableIndex] as Table;
        //   foundTable = nextTable;
        // }
      });

      if (foundTable) {
        const parsedComponent = parseComponentTable(foundTable, processor);
        pendingComponent.value[lang as DocsLang] = parsedComponent;
      } else {
        // console.log('Table not found: ', componentName, lang, heading, tableIndex);
      }
    }
  }; 

  const rangePickerParserImpl: CustomParser = (config, docsMapItem, processor) => {

  };

  if ((config.name as 'datepicker' | 'datepicker.rangePicker')  === 'datepicker') {
    return datePickerParserImpl(config, docsMapItem, processor);
  } else if (config.name === 'datepicker.rangePicker') {
    return rangePickerParserImpl(config, docsMapItem, processor);
  }
};