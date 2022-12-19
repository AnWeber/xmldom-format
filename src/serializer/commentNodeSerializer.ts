import { NodeType } from './nodeType';

function isCommentNode(node: Node): node is Comment{
	return node.nodeType === NodeType.COMMENT_NODE;
}

export function serializeCommentNode(node: Node): Array<string> | undefined  {
	if (isCommentNode(node)) {
		return ["<!--", node.data, "-->"];
	}
	return undefined;
}