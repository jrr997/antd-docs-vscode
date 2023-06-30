import { DocsLang, DocsMap, ParsedComponentProperty, ParsedDocs, ParsedComponent } from "./types";
import { unified } from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import remarkGfm, { Root } from 'remark-gfm';
import { Heading, Parent, Table, Text } from "mdast";
import { DOC_LANG } from "./constant";

interface ComponentParseConfig {
  name: string;
  heading: string;
}

const getComponentParseConfig = (componentName: string): ComponentParseConfig[] => {
  if (componentName === 'typography') {
    return [
      {
        name: 'typography.text',
        heading: 'Typography.Text',
      },
      {
        name: 'typography.title',
        heading: 'Typography.Title',
      },
      {
        name: 'typography.paragraph',
        heading: 'Typography.Paragraph',
      }
    ];
  } else if (componentName === 'grid') {
    return [
      {
        name: 'row',
        heading: 'Row',
      },
      {
        name: 'col',
        heading: 'Col',
      },
    ];
  } else {
    return [{
      name: componentName,
      heading: 'API'
    }];
  }
};

export const parseDoc = (docsMap: DocsMap) => {

  const processor = unified().use(parse).use(remarkGfm).use(stringify);
  const parsedDocsMap: any = {};
  const createTpl = () => ({
    [DOC_LANG.ZH]: undefined,
    [DOC_LANG.EN]: undefined,
  });

  let tableCellType = new Set();

  for (const [name, value] of Object.entries(docsMap)) {
    const parseConfig = getComponentParseConfig(name);
    for (const { name: componentName, heading } of parseConfig) {
      parsedDocsMap[componentName] = createTpl();

      for (const [lang, rawDocs] of Object.entries(value)) {
        const tree = processor.parse(rawDocs);
        let foundTable: Table | null = null;

        visit(tree, 'heading', (node, index, parent) => {
          if (foundTable) { return; };
          if (node.children[0].type === 'text' && node.children[0].value === heading) {
            const nextTable = parent?.children.slice(index!).filter(item => item.type === 'table')[0] as Table;
            foundTable = nextTable;
          }
        });
        if (foundTable) {
          const parsedComponent = parseComponentTable(foundTable, processor);
          parsedDocsMap[componentName][lang] = parsedComponent;
        } else {
          console.log('Table not found: ', componentName);
        }
      }
    }
  }
  console.log('parsedDocsMap:', parsedDocsMap);
  console.log('tableCellType: ', tableCellType);
  return parsedDocsMap;
};

const parseComponentTable = (table: Table, processor: any): ParsedComponent => {
  const propertyRows = table.children.slice(1);
  const propertyMap = propertyRows.reduce<Record<string, ParsedComponentProperty>>((obj, row) => {
    const property = (row.children[0].children[0] as Text).value;
    const [description, type, _default, version] = row.children.slice(1).map(tableCell => {
      return processor.stringify(tableCell as unknown as Root);
    });
    obj[property] = {
      // property,
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


