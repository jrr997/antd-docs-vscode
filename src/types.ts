import { Root } from "mdast";
import { Processor } from "unified";

export enum DocsLang  {
  ZH = 'zh-CN',
  EN = 'en-US',
};

export interface DocsMap {
  [componentName: string]: {
    [K in DocsLang]?: string;
  }
}

export interface ParsedComponentProperty {
  type: string;
  description: string;
  default: string;
  version: string;
}

export interface ParsedComponent {
  mdTable: string;
  properties: {
    [key: string]: ParsedComponentProperty;
  }
}

export interface ParsedDocsMap {
  [componentName: string]: {
    [K in DocsLang]?: ParsedComponent;
  }
}

export interface ParsedDocsState {
  parsedDocs: ParsedDocsMap;
  version: string;
}

export interface PendingComponent {
  name: string;
  value: ParsedDocsMap[string];
}

export type ComponentParseConfig = CommonParseConfig;

export interface CommonParseConfig {
  name: string; // name will be stored in docsMap, which is always lowercase.
  heading?: string | string[]; // md heading text before target table
  index?: number; // table index after heading
  merge?: {
    table?: boolean;
    property?: boolean;
    name: string;
  },
  parser?: CustomParser;
}
export interface CustomParseConfig {
  name: string; // name will be stored in docsMap, which is always lowercase.
  parser: CustomParser; // md heading text before target table
}

export type CustomParser = (config: ComponentParseConfig, docsMapItem: DocsMap[string], processor: Processor<Root, Root, Root, string>, parsingDocsMap?: ParsedDocsMap) => PendingComponent;