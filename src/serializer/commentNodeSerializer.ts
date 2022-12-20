import { NodeType, SerializerContext } from '../models';
import { addIndentation } from '../utils';

function isCommentNode(node: Node): node is Comment {
  return node.nodeType === NodeType.COMMENT_NODE;
}

export function serializeCommentNode(node: Node, context: SerializerContext): Array<string> | undefined {
  if (isCommentNode(node)) {
    const buffer: Array<string> = [];
    addIndentation(buffer, context);
    buffer.push('<!--', node.data, '-->');
    return buffer;
  }
  return undefined;
}
