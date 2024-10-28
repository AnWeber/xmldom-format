import { formatXml } from './formatXml';
import { FormatOptions } from './models';
import { Node } from '@xmldom/xmldom';

export class XMLSerializer {
  constructor(private readonly formatOptions?: FormatOptions) {}
  serializeToString(node: Node) {
    return formatXml(node, this.formatOptions);
  }
}
