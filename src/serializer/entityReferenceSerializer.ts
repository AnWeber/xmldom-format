import { NodeType } from '../models';
import { Node } from '@xmldom/xmldom';

export function serializeEntityReferenceNode(node: Node): Array<string> | undefined {
  if (node.nodeType === NodeType.ENTITY_REFERENCE_NODE) {
    return ['&', node.nodeName, ';'];
  }
  return undefined;
}
