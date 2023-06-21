export enum DocsLang  {
  ZH = 'zh-CN',
  EN = 'en-US',
};

export interface DocsMap {
  [componentName: string]: {
    [K in DocsLang]?: string;
  }
}

export interface ParsedComponent {
  apiMD: string;
  properties: {
    name: string;
    description: string;
    default: string;
  }
}

export interface ParsedDocs {
  [componentName: string]: {
    [K in DocsLang]?: ParsedComponent;
  }
}