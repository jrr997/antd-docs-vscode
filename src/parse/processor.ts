import parse from 'remark-parse';
import remarkGfm from "remark-gfm";
import { unified } from "unified";
import stringify from 'remark-stringify';

export const processor = unified().use(parse).use(remarkGfm).use(stringify);

export type TProcessor = typeof processor;