import { Node } from '@xmldom/xmldom';
export function serializeUnknownNode(node: Node) {
  return ['??', node.nodeName];
}
