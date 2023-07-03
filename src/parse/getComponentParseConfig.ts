import { ComponentParseConfig, parseConfigMap } from './parseConfig';

export const getComponentParseConfig = (componentName: string): ComponentParseConfig[] => {
  return parseConfigMap[componentName] ?? [{
    name: componentName,
    heading: 'API'
  }]; 
};