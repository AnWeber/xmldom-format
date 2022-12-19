import { NodeType } from '../models';
import { xmlEncoder } from './xmlEncoder';

export function addSerializedAttribute(qualifiedName: string, value: string): Array<string> {
  return [' ', qualifiedName, '="', value.replace(/[<>&"\t\n\r]/gu, xmlEncoder), '"'];
}

export function serializeAttributeNode(node: Node): Array<string> | undefined {
  if (isAttributeNode(node)) {
    return addSerializedAttribute(node.name, node.value);
  }
  return undefined;
}

function isAttributeNode(node: Node): node is Attr {
  return node.nodeType === NodeType.ATTRIBUTE_NODE;
}
