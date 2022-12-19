import { addSerializedAttribute } from './attributeNodeSerializer';
import { isCDataSectionNode } from './cdataSectionSerializer';
import { NodeType } from './nodeType';
import { Namespace, SerializerContext } from './serializerContext';

export function serializeElementNode(node: Node, context: SerializerContext): Array<string> | undefined {
  if (isElementNode(node)) {
    const buffer: Array<string> = [];

    const attrs = node.attributes;
    const len = attrs.length;
    const nodeName = node.tagName;

    context.isHtml = node.namespaceURI === 'http://www.w3.org/1999/xhtml' || context.isHtml;

    let prefixedNodeName = nodeName;
    if (!context.isHtml && !node.prefix && node.namespaceURI) {
      let defaultNS;
      // lookup current default ns from `xmlns` attribute
      for (let ai = 0; ai < attrs.length; ai++) {
        if (attrs.item(ai)?.name === 'xmlns') {
          defaultNS = attrs.item(ai)?.value;
          break;
        }
      }
      if (!defaultNS) {
        // lookup current default ns in visibleNamespaces
        for (let nsi = context.visibleNamespaces.length - 1; nsi >= 0; nsi--) {
          const namespace = context.visibleNamespaces[nsi];
          if (namespace.prefix === '' && namespace.namespace === node.namespaceURI) {
            defaultNS = namespace.namespace;
            break;
          }
        }
      }
      if (defaultNS !== node.namespaceURI) {
        for (let nsi = context.visibleNamespaces.length - 1; nsi >= 0; nsi--) {
          const namespace = context.visibleNamespaces[nsi];
          if (namespace.namespace === node.namespaceURI) {
            if (namespace.prefix) {
              prefixedNodeName = `${namespace.prefix}:${nodeName}`;
            }
            break;
          }
        }
      }
    }

    buffer.push('<', prefixedNodeName);

    for (let i = 0; i < len; i++) {
      // add namespaces for attributes
      const attr = attrs.item(i);
      if (attr?.prefix === 'xmlns') {
        context.visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
      } else if (attr?.nodeName === 'xmlns') {
        context.visibleNamespaces.push({ prefix: '', namespace: attr.value });
      }
    }

    for (let i = 0; i < len; i++) {
      const attr = attrs.item(i);
      if (attr) {
        if (needNamespaceDefine(attr, context.visibleNamespaces) && attr.namespaceURI) {
          const prefix = attr.prefix || '';
          buffer.push(...addSerializedAttribute(prefix ? `xmlns:${prefix}` : 'xmlns', attr.namespaceURI));
          context.visibleNamespaces.push({ prefix, namespace: attr.namespaceURI });
        }
        buffer.push(...context.serializeNode(attr, context));
      }
    }

    // add namespace for current node
    if (nodeName === prefixedNodeName && needNamespaceDefine(node, context.visibleNamespaces)) {
      if (node.namespaceURI) {
        const prefix = node.prefix || '';
        buffer.push(...addSerializedAttribute(prefix ? `xmlns:${prefix}` : 'xmlns', node.namespaceURI));
        context.visibleNamespaces.push({ prefix, namespace: node.namespaceURI });
      }
    }

    if (node.firstChild || (context.isHtml && !/^(?:meta|link|img|br|hr|input)$/iu.test(nodeName))) {
      buffer.push('>');

      let child = node.firstChild;
      // if is cdata child node
      const isScriptNode = context.isHtml && /^script$/iu.test(nodeName);
      while (child) {
        if (isScriptNode && isCharacterData(child) && child.data) {
          buffer.push(child.data);
        } else {
          buffer.push(...context.serializeNode(child, context));
        }
        child = child.nextSibling;
      }

      buffer.push('</', prefixedNodeName, '>');
    } else {
      if (context.formatOptions?.autoClosingUseWhitespace) {
        buffer.push(' ');
      }
      buffer.push('/>');
    }
    return buffer;
  }
  return undefined;
}

function needNamespaceDefine(node: Attr | Element, visibleNamespaces: Array<Namespace>) {
  const prefix = node.prefix || '';
  const uri = node.namespaceURI;
  // According to [Namespaces in XML 1.0](https://www.w3.org/TR/REC-xml-names/#ns-using) ,
  // and more specifically https://www.w3.org/TR/REC-xml-names/#nsc-NoPrefixUndecl :
  // > In a namespace declaration for a prefix [...], the attribute value MUST NOT be empty.
  // in a similar manner [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-using)
  // and more specifically https://www.w3.org/TR/xml-names11/#nsc-NSDeclared :
  // > [...] Furthermore, the attribute value [...] must not be an empty string.
  // so serializing empty namespace value like xmlns:ds="" would produce an invalid XML document.
  if (!uri) {
    return false;
  }
  if ((prefix === 'xml' && uri === 'http://www.w3.org/XML/1998/namespace') || uri === 'http://www.w3.org/2000/xmlns/') {
    return false;
  }

  let i = visibleNamespaces.length;
  while (i--) {
    const ns = visibleNamespaces[i];
    // get namespace prefix
    if (ns.prefix === prefix) {
      return ns.namespace !== uri;
    }
  }
  return true;
}

function isElementNode(node: Node): node is Element {
  return node.nodeType === NodeType.ELEMENT_NODE;
}
function isCharacterData(node: Node): node is CharacterData {
  return !!(node as CharacterData).data;
}
