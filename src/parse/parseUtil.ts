import { DocsLang, DocsMap, ParsedComponentProperty, ParsedDocsMap, ParsedComponent, PendingComponent, CustomParser } from '../types';
import { visit } from 'unist-util-visit';
import { Heading, Link, Parent, Root, Table, TableRow, Text } from "mdast";
import { DOC_LANG } from "../constant";
import { ComponentParseConfig, CommonParseConfig } from '../types';
import { selectAll } from 'unist-util-select';
import { TProcessor } from './processor';

export const findHeadingAndTable = (heading: string | string[], root: Root, tableIndex = 0): [Table | null, Heading | null, Parent | null] => {
  let foundHeading: Heading | null = null;
  let foundTable: Table | null = null;
  let foundParent: Parent | null = null;
  visit(root, 'heading', (node, index, parent) => {
    if (foundTable) { return; };
    if (node.children[0].type === 'text' && toArray(heading).includes(node.children[0].value)) {
      foundHeading = node;
      foundParent = parent;

      const nextTable = parent?.children.slice(index!).filter(item => item.type === 'table')[tableIndex] as Table;
      foundTable = nextTable;
    }
  });
  return [foundTable, foundHeading, foundParent];
};

export const findNodesFromHeadingToTable = (heading: string | string[], root: Root, tableIndex = 0) => {
  const [foundTable, foundHeading, foundParent] = findHeadingAndTable(heading, root, tableIndex);
  if (foundTable && foundHeading && foundParent) {
    const start = foundParent.children.indexOf(foundHeading);
    const end = foundParent.children.indexOf(foundTable);
    const nodes = foundParent.children.slice(start, end + 1);
    return nodes;
  }
  return null;
};

// Parse rawDocs for most components. Some components are special and should implement their own parser. 
export const parseComponent = ({ heading, name: componentName, index: tableIndex = 0, merge }: CommonParseConfig & { heading: string | string[] }, docsMapItem: DocsMap[string], processor: TProcessor, parsedDocsMap: ParsedDocsMap): PendingComponent => {
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
    let [foundTable] = findHeadingAndTable(heading, tree);

    if (foundTable) {
      const parsedComponent = parseComponentTable(foundTable, processor);
      if (merge?.name) {
        if (merge.table !== false) {
          parsedComponent.mdTable = parsedComponent.mdTable + '\n' + parsedDocsMap[merge.name]?.[lang as DocsLang]?.mdTable;
        }
        if (merge.property !== false) {
          parsedComponent.properties = {
            ...parsedDocsMap[merge.name]?.[lang as DocsLang]?.properties,
            ...parsedComponent.properties,
          };
        }
      }
      pendingComponent.value[lang as DocsLang] = parsedComponent;
    } else {
      console.log('Table not found: ', componentName, lang, heading, tableIndex);
    }
  }

  return pendingComponent;
};

export const parseComponentTableProperties = (tableRows: TableRow[], processor: any): Record<string, ParsedComponentProperty> => {
  const propertyMap = tableRows.reduce<Record<string, ParsedComponentProperty>>((obj, row) => {
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

  return propertyMap;
};

// Parse all properties according to the markdown table.
export const parseComponentTable = (table: Table, processor: any): ParsedComponent => {
  const propertyMap = parseComponentTableProperties(table.children.slice(1), processor);
  return {
    mdTable: processor.stringify(table),
    properties: propertyMap,
  };
};

// =============================== custom parser ===============================

export const datePickerParser: CustomParser = (config, docsMapItem, processor) => {
  // Show common Api and datePicker Api 
  const datePickerParserImpl: CustomParser = ({ name: componentName }, docsMapItem, processor) => {
    const formattedComponentName = componentName.replaceAll('-', '');
    const pendingComponent: PendingComponent = {
      name: formattedComponentName,
      value: {
        [DOC_LANG.ZH]: undefined,
        [DOC_LANG.EN]: undefined,
      }
    };
    const commonTableHeading = ['共同的 API', 'Common API'];
    const datePickerTableHeading = ['DatePicker'];
    const rangePickerTableHeading = ['RangePicker'];
    const pickerTableHeading = componentName === 'datepicker' ? datePickerTableHeading : rangePickerTableHeading;
    for (const [lang, rawDocs] of Object.entries(docsMapItem)) {
      const tree = processor.parse(rawDocs);
      const commonTableNodes = findNodesFromHeadingToTable(commonTableHeading, tree);
      const commonTable = commonTableNodes?.find(node => node.type === 'table') as Table;
      const commonTableProperties = parseComponentTableProperties(commonTable.children.slice(1), processor);

      const datePickerTableNodes = findNodesFromHeadingToTable(pickerTableHeading, tree);
      const datePickerTable = datePickerTableNodes?.find(node => node.type === 'table') as Table;
      const datePickerTableProperties = parseComponentTableProperties(datePickerTable.children.slice(1), processor);

      const mergedProperties = {
        ...commonTableProperties,
        ...datePickerTableProperties,
      };
      pendingComponent.value[lang as DocsLang] = {
        mdTable: processor.stringify({ type: 'root', children: [...commonTableNodes!, ...datePickerTableNodes!] }),
        properties: mergedProperties,
      };
    }

    return pendingComponent;
  };

  return datePickerParserImpl(config, docsMapItem, processor);
};

export const timePickerParser: CustomParser = (config, docsMapItem, processor, pendingDocsMap) => {
  const pendingComponent: PendingComponent = {
    name: config.name,
    value: {
      [DOC_LANG.ZH]: undefined,
      [DOC_LANG.EN]: undefined,
    }
  };

  for (const [lang, rawDocs] of Object.entries(docsMapItem)) {
    const tree = processor.parse(rawDocs);
    const heading = 'RangePicker';
    const tableNodes = findNodesFromHeadingToTable(heading, tree);
    const table = tableNodes?.find(node => node.type === 'table') as Table;
    const tableProperties = parseComponentTableProperties(table.children.slice(1), processor);

    // datePicker.rangepicker is parsed before datePicker, so we can get common properties from pendingDocsMap.
    // The parsing order depends on the component directory order in antd repo.
    const commonProperties = pendingDocsMap?.['datepicker.rangepicker']?.[lang as DocsLang]?.properties;
    const mergedProperties = {
      ...commonProperties,
      ...tableProperties,
    };

    pendingComponent.value[lang as DocsLang] = {
      mdTable: processor.stringify({ type: 'root', children: tableNodes! }),
      properties: mergedProperties,
    };
  }

  return pendingComponent;

};

export const tooltipParser: CustomParser = (config, docsMapItem, processor, pendingDocsMap) => {
  const pendingComponent: PendingComponent = {
    name: config.name,
    value: {
      [DOC_LANG.ZH]: undefined,
      [DOC_LANG.EN]: undefined,
    }
  };

  for (const [lang, rawDocs] of Object.entries(docsMapItem)) {
    const tree = processor.parse(rawDocs);
    const heading = 'API';
    const tableNodes = findNodesFromHeadingToTable(heading, tree, 1);
    const [table, commonTable] = tableNodes?.filter(node => node.type === 'table') as Table[];

    const tableProperties = parseComponentTableProperties(table.children.slice(1), processor);
    const commonTableProperties = parseComponentTableProperties(commonTable.children.slice(1), processor);

    // commonTableProperties is shared with Tooltip, Popover, Popconfirm.
    // Since Popover and Popconfirm are parsed before Tooltip, we can set common properties from Popover and Popconfirm hear.
    const currentPopconfirmProperties = pendingDocsMap?.['popover']?.[lang as DocsLang]?.properties;
    const currentPopoverProperties = pendingDocsMap?.['popconfirm']?.[lang as DocsLang]?.properties;
    if (currentPopconfirmProperties && Object.keys(currentPopconfirmProperties).length < Object.keys(commonTableProperties).length) {
      Object.assign(currentPopconfirmProperties, commonTableProperties);
    }
    if (currentPopoverProperties && Object.keys(currentPopoverProperties).length < Object.keys(commonTableProperties).length) {
      Object.assign(currentPopoverProperties, commonTableProperties);
    }

    const mergedProperties = {
      ...commonTableProperties,
      ...tableProperties,
    };

    pendingComponent.value[lang as DocsLang] = {
      mdTable: processor.stringify({ type: 'root', children: tableNodes! }),
      properties: mergedProperties,
    };
  }

  return pendingComponent;
};

export const progressParser: CustomParser = (config, docsMapItem, processor, pendingDocsMap) => {
  const pendingComponent: any = {
    name: 'progress',
    value: {
      [DOC_LANG.ZH]: {},
      [DOC_LANG.EN]: {},
    }
  };

  for (const [lang, rawDocs] of Object.entries(docsMapItem)) {
    const tree = processor.parse(rawDocs);
    let [foundTable, heading] = findHeadingAndTable('API', tree);
    const mdTableStartIndex = tree.children.findIndex(item => item === heading!);
    if (mdTableStartIndex !== -1) {
      const mdTableString = processor.stringify({ type: 'root', children: tree.children.slice(mdTableStartIndex + 1) });
      pendingComponent.value[lang as DocsLang].mdTable = mdTableString;

    }
    if (foundTable) {
      const properties = parseComponentTableProperties(foundTable.children.slice(1), processor);
      pendingComponent.value[lang as DocsLang].properties = properties;
    } else {
      console.log('Table not found: ', 'progress', lang, heading);
    }
  }

  return pendingComponent as PendingComponent;
};

/**
 * correct markdown link '#xxx' to `${componentLink}#xxx`
 * @param mdString raw markdown string
 * @param processor 
 * @param prefix antd doc link prefix
 * @returns raw markdown string with correct link
 */
export const correctMdLink = (mdString: string, processor: any, prefix: string) => {
  const tree = processor.parse(mdString);
  const links = selectAll('link', tree) as Link[];
  links.forEach(link => {
    if (link.url.startsWith('#')) {
      link.url = prefix + link.url.toLowerCase();
    }
  });
  return processor.stringify(tree);
};

export const toArray = (arg: unknown | unknown[]) => Array.isArray(arg) ? arg : [arg];