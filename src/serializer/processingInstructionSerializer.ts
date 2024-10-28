import { NodeType, SerializerContext } from '../models';
import { addIndentation } from '../utils';
import { Node, ProcessingInstruction } from '@xmldom/xmldom';

function isProcessingInstructionNode(node: Node): node is ProcessingInstruction {
  return node.nodeType === NodeType.PROCESSING_INSTRUCTION_NODE;
}

export function serializeProcessingInstructionNode(node: Node, context: SerializerContext): Array<string> | undefined {
  if (isProcessingInstructionNode(node)) {
    const buffer: Array<string> = [];
    addIndentation(buffer, context);
    buffer.push('<?', node.target, ' ', node.data, '?>');
    return buffer;
  }
  return undefined;
}
