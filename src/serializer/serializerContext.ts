import { FormatOptions } from './formatOptions';

export type RequiredSerializerFunction = (node: Node, context: SerializerContext) => Array<string>;

export type SerializerFunction = (node: Node, context: SerializerContext) => Array<string> | undefined;

export interface SerializerContext {
  isHtml: boolean;
  visibleNamespaces: Array<Namespace>;
  serializeNode: RequiredSerializerFunction;
  formatOptions?: FormatOptions;
  level?: number;
}
export interface Namespace {
  namespace: string | null;
  prefix: null | string;
}