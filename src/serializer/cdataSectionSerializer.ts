import { NodeType } from '../models';

export function isCDataSectionNode(node: Node): node is Text {
  return node.nodeType === NodeType.CDATA_SECTION_NODE;
}
export function serializeCDataSectionNode(node: Node): Array<string> | undefined {
  if (isCDataSectionNode(node)) {
    return ['<![CDATA[', node.data, ']]>'];
  }
  return [];
}
