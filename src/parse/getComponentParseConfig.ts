import { ComponentParseConfig } from '../types';
import { parseConfigMap } from './config';

const preset = {
  heading: 'API',
  index: 0
} as const; 
 
export const getComponentParseConfig = (componentName: string): ComponentParseConfig[] => {
  return parseConfigMap[componentName] ?? [{
    name: componentName,
    ...preset
  }]; 
};