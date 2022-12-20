import { XMLSerializer } from './xmlSerializer';
import { DOMParser } from '@xmldom/xmldom';
import { EOL } from 'os';

describe('xmlSerializer', () => {
  const domParser = new DOMParser();
  const xmlSerializer = new XMLSerializer();

  it('serializeToString', async () => {
    const xml =
      '<html><head>test</head><body><h1 style="color: red">Hello World</h1><p>Lorem Ipsum<br/>Lorem ipsum</p></body></html>';
    const document = domParser.parseFromString(xml);
    expect(xmlSerializer.serializeToString(document)).toBe(xml);
  });

  it('supports text node containing "]]>"', () => {
    const doc = domParser.parseFromString('<test/>', 'text/xml');
    doc.documentElement.appendChild(doc.createTextNode('hello ]]> there'));
    if (doc.documentElement.firstChild) {
      expect(xmlSerializer.serializeToString(doc.documentElement.firstChild)).toBe('hello ]]&gt; there');
    }
  });

  it('supports <script> element with no children', () => {
    const doc = domParser.parseFromString('<html2><script></script></html2>', 'text/html');
    if (doc.documentElement.firstChild) {
      expect(xmlSerializer.serializeToString(doc.documentElement.firstChild)).toBe(
        '<script xmlns="http://www.w3.org/1999/xhtml"></script>'
      );
    }
  });

  describe('does not serialize namespaces with an empty URI', () => {
    // for more details see the comments in lib/dom.js:needNamespaceDefine
    it('that are used in a node', () => {
      const source = '<w:p><w:r>test1</w:r><w:r>test2</w:r></w:p>';
      const { documentElement } = domParser.parseFromString(source);

      expect(xmlSerializer.serializeToString(documentElement)).toStrictEqual(source);
    });

    it('that are used in an attribute', () => {
      const source = '<w:p w:attr="val"/>';
      const { documentElement } = domParser.parseFromString(source);

      expect(xmlSerializer.serializeToString(documentElement)).toStrictEqual(source);
    });
  });

  describe('does detect matching visible namespace for tags without prefix', () => {
    it('should add local namespace after sibling', () => {
      const str = '<a:foo xmlns:a="AAA"><bar xmlns="AAA"/></a:foo>';
      const doc = domParser.parseFromString(str, 'text/xml');

      const child = doc.createElementNS('AAA', 'child');
      expect(xmlSerializer.serializeToString(child)).toBe('<child xmlns="AAA"/>');
      doc.documentElement.appendChild(child);
      expect(xmlSerializer.serializeToString(doc)).toBe('<a:foo xmlns:a="AAA"><bar xmlns="AAA"/><a:child/></a:foo>');
    });
    it('should add local namespace from parent', () => {
      const str = '<a:foo xmlns:a="AAA"/>';
      const doc = domParser.parseFromString(str, 'text/xml');

      const child = doc.createElementNS('AAA', 'child');
      expect(xmlSerializer.serializeToString(child)).toBe('<child xmlns="AAA"/>');
      doc.documentElement.appendChild(child);
      expect(xmlSerializer.serializeToString(doc)).toBe('<a:foo xmlns:a="AAA"><a:child/></a:foo>');
      const nested = doc.createElementNS('AAA', 'nested');
      expect(xmlSerializer.serializeToString(nested)).toBe('<nested xmlns="AAA"/>');
      child.appendChild(nested);
      expect(xmlSerializer.serializeToString(doc)).toBe('<a:foo xmlns:a="AAA"><a:child><a:nested/></a:child></a:foo>');
    });
    it('should add local namespace as xmlns in HTML', () => {
      const str = '<a:foo xmlns:a="AAA"/>';
      const doc = domParser.parseFromString(str, 'text/html');

      const child = doc.createElementNS('AAA', 'child');
      expect(xmlSerializer.serializeToString(child)).toBe('<child xmlns="AAA"/>');
      doc.documentElement.appendChild(child);
      expect(xmlSerializer.serializeToString(doc)).toBe('<a:foo xmlns:a="AAA"><a:child/></a:foo>');
      const nested = doc.createElementNS('AAA', 'nested');
      expect(xmlSerializer.serializeToString(nested)).toBe('<nested xmlns="AAA"/>');
      child.appendChild(nested);
      expect(xmlSerializer.serializeToString(doc)).toBe('<a:foo xmlns:a="AAA"><a:child><a:nested/></a:child></a:foo>');
    });
    it('should add keep different default namespace of child', () => {
      const str = '<a:foo xmlns:a="AAA"/>';
      const doc = domParser.parseFromString(str, 'text/xml');

      const child = doc.createElementNS('BBB', 'child');
      child.setAttribute('xmlns', 'BBB');
      expect(xmlSerializer.serializeToString(child)).toBe('<child xmlns="BBB"/>');
      doc.documentElement.appendChild(child);
      const nested = doc.createElementNS('BBB', 'nested');
      expect(xmlSerializer.serializeToString(nested)).toBe('<nested xmlns="BBB"/>');
      child.appendChild(nested);
      expect(xmlSerializer.serializeToString(doc)).toBe(
        '<a:foo xmlns:a="AAA"><child xmlns="BBB"><nested/></child></a:foo>'
      );
    });
  });
  describe('is insensitive to namespace order', () => {
    it('should preserve prefixes for inner elements and attributes', () => {
      const NS = 'http://www.w3.org/test';
      const xml = minify(`
  <xml xmlns="${NS}">
    <one attr="first"/>
    <group xmlns:inner="${NS}">
      <two attr="second"/>
      <inner:three inner:attr="second"/>
    </group>
  </xml>
  `);
      const dom = domParser.parseFromString(xml, 'text/xml');
      expect(xmlSerializer.serializeToString(dom)).toEqual(xml);
    });
    it('should preserve missing prefixes for inner prefixed elements and attributes', () => {
      const NS = 'http://www.w3.org/test';
      const xml = minify(`
      <xml xmlns:inner="${NS}">
    <inner:one attr="first"/>
    <inner:group xmlns="${NS}">
      <inner:two attr="second"/>
      <three attr="second"/>
    </inner:group>
  </xml>
  `);
      const dom = domParser.parseFromString(xml, 'text/xml');
      expect(xmlSerializer.serializeToString(dom)).toEqual(xml);
    });
    it('should produce unprefixed svg elements when prefixed namespace comes first', () => {
      const svg = minify(`
  <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg">
    <g><circle/></g>
  </svg>`);
      const dom = domParser.parseFromString(svg, 'text/xml');

      expect(xmlSerializer.serializeToString(dom)).toEqual(svg);
    });
    it('should produce unprefixed svg elements when default namespace comes first', () => {
      const svg = minify(`
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
    <g><circle/></g>
  </svg>
  `);
      const dom = domParser.parseFromString(svg, 'text/xml');

      expect(xmlSerializer.serializeToString(dom)).toEqual(svg);
    });
  });
  describe('properly escapes attribute values', () => {
    it('should properly convert whitespace literals back to character references', () => {
      const input = '<xml attr="&#9;&#10;&#13;"/>';
      const dom = domParser.parseFromString(input, 'text/xml');

      expect(xmlSerializer.serializeToString(dom)).toBe(input);
    });

    it('should escape special characters in namespace attributes', () => {
      const input = `<xml xmlns='<&"' xmlns:attr='"&<'><test attr:test=""/></xml>`;
      const doc = domParser.parseFromString(input, 'text/xml');

      // in this case the explicit attribute nodes are serialized
      expect(xmlSerializer.serializeToString(doc)).toBe(
        '<xml xmlns="&lt;&amp;&quot;" xmlns:attr="&quot;&amp;&lt;"><test attr:test=""/></xml>'
      );

      if (doc.documentElement.firstChild) {
        // in this case the namespace attributes are "inherited" from the parent,
        // which is not serialized
        expect(xmlSerializer.serializeToString(doc.documentElement.firstChild)).toBe(
          '<test xmlns:attr="&quot;&amp;&lt;" attr:test="" xmlns="&lt;&amp;&quot;"/>'
        );
      }
    });
  });
});

function minify(value: string): string {
  return value
    .split(EOL)
    .map(val => val.trim())
    .join('');
}
