import { FormatOptions } from './formatOptions';
import { Namespace } from './namespace';
import { Node } from '@xmldom/xmldom';

export type RequiredSerializerFunction = (node: Node, context: SerializerContext) => Array<string>;

export type SerializerFunction = (node: Node, context: SerializerContext) => Array<string> | undefined;

export interface SerializerContext {
  isHtml: boolean;
  visibleNamespaces: Array<Namespace>;
  serializeNode: RequiredSerializerFunction;
  formatOptions?: FormatOptions;
  level: number;
}
