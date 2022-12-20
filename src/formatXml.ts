import { FormatOptions, SerializerContext, SerializerFunction } from './models';
import * as serializer from './serializer';

export function formatXml(node: Node, formatOptions?: FormatOptions) {
  const context: SerializerContext = {
    isHtml: false,
    visibleNamespaces: [],
    serializeNode,
    level: 0,
    formatOptions,
  };

  if (serializer.isDocumentNode(node) && node.documentElement && !node.documentElement.prefix) {
    const prefix = node.documentElement.lookupPrefix(node.documentElement.namespaceURI);
    if (!prefix) {
      context.visibleNamespaces.push({
        prefix: null,
        namespace: node.documentElement.namespaceURI,
      });
    }
  }
  const buffer = serializeNode(node, context);
  return buffer.join('').trim();
}

const serializers: Array<SerializerFunction> = [
  serializer.serializeElementNode,
  serializer.serializeDocumentNode,
  serializer.serializeAttributeNode,
  serializer.serializeTextNode,
  serializer.serializeCDataSectionNode,
  serializer.serializeCommentNode,
  serializer.serializeDocumentType,
  serializer.serializeProcessingInstructionNode,
  serializer.serializeEntityReferenceNode,
  serializer.serializeUnknownNode,
];

function serializeNode(node: Node, context: SerializerContext): Array<string> {
  const contextClone = {
    ...context,
    visibleNamespaces: context.visibleNamespaces.slice(),
  };
  const buffer: Array<string> = [];
  for (const serializer of serializers) {
    const result = serializer(node, contextClone);
    if (result) {
      buffer.push(...result);
      return buffer;
    }
  }
  return buffer;
}
