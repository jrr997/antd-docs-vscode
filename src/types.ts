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

export interface ParsedDocs {
  [componentName: string]: {
    [K in DocsLang]: ParsedComponent;
  }
}