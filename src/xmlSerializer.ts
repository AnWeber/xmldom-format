import { formatXml } from './formatXml';
import { FormatOptions } from './models';

export class XMLSerializer {
  constructor(private readonly formatOptions?: FormatOptions){}
  serializeToString(node: Node) {
    return formatXml(node, this.formatOptions);
  }
}
