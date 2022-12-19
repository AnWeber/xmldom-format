import { formatXml } from './formatXml';
import { DOMParser } from '@xmldom/xmldom';

describe('formatXml', () => {
  const domParser = new DOMParser();

  const addHtmlBody = (content: string) => `<html><head>test</head><body>${content}</body></html>`;

  describe('empty formatOptions', () => {
    const xmlTests = [
      `<head>test</head>`,
      addHtmlBody('<h1 style="color: red">Hello World</h1><p>Lorem Ipsum<br/>Lorem ipsum</p>'),
      '<html xmlns="http://www.w3.org/1999/xhtml"><head><script><![CDATA[escape that <]]></script></head></html>',
    ];
    for (const xml of xmlTests) {
      it(`format $[xml}`, async () => {
        const document = domParser.parseFromString(xml);
        const result = formatXml(document);
        expect(result).toBe(xml);
      });
    }
  });
  describe('useWhitespaceInAutoClosingNode', () => {
    const xmlTests = [
      { xml: `<head>test<br/></head>`, expected: `<head>test<br /></head>` },
      {
        xml: addHtmlBody('<h1 style="color: red">Hello World</h1><p>Lorem Ipsum<br/>Lorem ipsum</p>'),
        expected: addHtmlBody('<h1 style="color: red">Hello World</h1><p>Lorem Ipsum<br />Lorem ipsum</p>'),
      },
    ];
    for (const test of xmlTests) {
      it(`useWhitespaceInAutoClosingNode with xml $[xml}`, async () => {
        const document = domParser.parseFromString(test.xml);
        const formatOptions = { useWhitespaceInAutoClosingNode: true };
        expect(formatXml(document)).toBe(test.xml);
        expect(formatXml(document, formatOptions)).toBe(test.expected);
      });
    }
  });
});
