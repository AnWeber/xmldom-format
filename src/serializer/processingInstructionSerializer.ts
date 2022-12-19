import { NodeType } from '../models';

function isProcessingInstructionNode(node: Node): node is ProcessingInstruction {
  return node.nodeType === NodeType.PROCESSING_INSTRUCTION_NODE;
}

export function serializeProcessingInstructionNode(node: Node): Array<string> | undefined {
  if (isProcessingInstructionNode(node)) {
    return ['<?', node.target, ' ', node.data, '?>'];
  }
  return undefined;
}
