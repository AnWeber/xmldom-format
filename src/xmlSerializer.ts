import { formatXml } from './formatXml';


export class XMLSerializer{
  serializeToString(node: Node) {
    return formatXml(node);
  }
}