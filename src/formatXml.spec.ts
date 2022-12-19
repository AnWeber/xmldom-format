import { formatXml } from './formatXml';
import { DOMParser } from '@xmldom/xmldom';

describe('formatXml', () => {
  const domParser = new DOMParser();

  describe('format', () => {
    it('format simple', async () => {
      const document = domParser.parseFromString(`<head>test</head>`);
      const result = formatXml(document);
      expect(result).toBe('<head>test</head>');
    });
    it('format nested', async () => {
      const document = domParser.parseFromString(
        `<html><head>test</head><body><h1 style="color: red">Hello World</h1><p>Lorem Ipsum<br/>Lorem ipsum</p></body></html>`
      );
      const result = formatXml(document);
      expect(result).toBe(
        '<html><head>test</head><body><h1 style="color: red">Hello World</h1><p>Lorem Ipsum<br/>Lorem ipsum</p></body></html>'
      );
    });
    it('should serialize a CDATA section', () => {
      const xml =
        '<html xmlns="http://www.w3.org/1999/xhtml"><head><script><![CDATA[escape that <]]></script></head></html>';
      const doc = domParser.parseFromString(xml);

      expect(formatXml(doc)).toBe(xml);
    });
  });
});
