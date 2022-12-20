import { NodeType, SerializerContext } from '../models';
import { addIndentation } from '../utils';

export function serializeDocumentType(node: Node, context: SerializerContext): Array<string> | undefined {
  if (isDocumentType(node)) {
    const buffer: Array<string> = [];
    addIndentation(buffer, context);
    buffer.push('<!DOCTYPE ', node.name);
    if (node.publicId) {
      buffer.push(' PUBLIC ', node.publicId);
      if (node.systemId && node.systemId !== '.') {
        buffer.push(' ', node.systemId);
      }
      buffer.push('>');
    } else if (node.systemId && node.systemId !== '.') {
      buffer.push(' SYSTEM ', node.systemId, '>');
    } else {
      if (node.internalSubset) {
        buffer.push(' [', node.internalSubset, ']');
      }
      buffer.push('>');
    }
    return buffer;
  }
  return undefined;
}

function isDocumentType(node: Node): node is DocumentType & { internalSubset?: string } {
  return node.nodeType === NodeType.DOCUMENT_TYPE_NODE;
}
