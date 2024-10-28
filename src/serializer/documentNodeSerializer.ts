import { NodeType, SerializerContext } from '../models';
import { Node, Document, DocumentFragment } from '@xmldom/xmldom';

export function isDocumentNode(node: Node): node is Document {
  return node.nodeType === NodeType.DOCUMENT_NODE;
}
function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE;
}

export function serializeDocumentNode(node: Node, context: SerializerContext) {
  if (isDocumentNode(node) || isDocumentFragment(node)) {
    const buffer: Array<string> = [];
    let child = node.firstChild;
    while (child) {
      buffer.push(...context.serializeNode(child, context));
      child = child.nextSibling;
    }
    return buffer;
  }
  return undefined;
}
