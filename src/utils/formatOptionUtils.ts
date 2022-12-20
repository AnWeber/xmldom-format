import { SerializerContext } from '../models';

export function addIndentation(buffer: string[], context: SerializerContext) {
  if (context.formatOptions?.indentation) {
    buffer.push(context.formatOptions.eol || `\r\n`);
    for (let index = 0; index < context.level; index++) {
      buffer.push(context.formatOptions.indentation);
    }
  }
}

export function addWhitespaceInAutoClosingNode(buffer: string[], context: SerializerContext) {
  if (context.formatOptions?.useWhitespaceInAutoClosingNode) {
    buffer.push(' ');
  }
}
