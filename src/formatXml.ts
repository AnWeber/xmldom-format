import { FormatOptions } from './models';
import * as serializer from './serializer';

export function formatXml(node: Node, formatOptions?: FormatOptions) {
  const context: serializer.SerializerContext = {
    isHtml: false,
    visibleNamespaces: [],
    serializeNode,
    level: -1,
    formatOptions
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
  return buffer.join('');
}

const serializers: Array<serializer.SerializerFunction> = [
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

function serializeNode(node: Node, context: serializer.SerializerContext): Array<string> {
  const contextClone = {
    ...context,
    visibleNamespaces: context.visibleNamespaces.slice(),
    level: context.level + 1,
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
