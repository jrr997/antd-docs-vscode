import { DocsLang, DocsMap } from "./types";
import { unified } from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import remarkGfm, { Root } from 'remark-gfm';
import { Heading, Parent, Table, Text } from "mdast";
import { DOC_LANG } from "./constant";

export const parseDoc = (docsMap: DocsMap) => {

  // 提供你要查找的标题
  const targetTitle = 'API';
  const processor = unified().use(parse).use(remarkGfm).use(stringify);
  const parsedDocsMap = {};
  const createTpl = () => ({
    [DOC_LANG.ZH]: undefined,
    [DOC_LANG.EN]: undefined,
  });
  for (const [componentName, value] of Object.entries(docsMap)) {
    parsedDocsMap[componentName] = createTpl();

    for (const [lang, rawDocs] of Object.entries(value)) {
      // 解析 Markdown 文件
      const tree = processor.parse(rawDocs);
      // console.log('tree', tree);

      let foundTable: Table | null = null;

      // visit(tree, 'table', (node, index, parent) => {
      //   if (foundTable) { return; };
      //   const lastHeading = parent?.children.slice(0, index!).filter(item => item.type === 'heading').pop() as Heading;
      //   const textNode = lastHeading?.children?.[0].type === 'text' ? lastHeading?.children?.[0] : undefined;
      //   if (textNode?.value === targetTitle) {
      //     foundTable = node;
      //   }
      // });
      visit(tree, 'heading', (node, index, parent) => {
        if (foundTable) { return; };
        if (node.children[0].type === 'text' && node.children[0].value === 'API') {
          const nextTable = parent?.children.slice(index!).filter(item => item.type === 'table')[0] as Table;
          foundTable = nextTable;
        }
      });
      if (foundTable) {
        // 如果找到匹配的表格节点，则进行相应的处理
        // console.log(foundTable);
        const mdTable = processor.stringify(foundTable);
        parsedDocsMap[componentName][lang] = {
          mdTable
        };
        // console.log(compiledTable);
      } else {
        console.log('Table not found: ', componentName);
      }
    }
  }
  console.log('parsedDocsMap:', parsedDocsMap);
  
  return parsedDocsMap;
};



