

export function serializeUnknownNode(node: Node) {
  return ['??', node.nodeName];
}