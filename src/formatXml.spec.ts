import { formatXml } from './formatXml';
import { FormatOptions } from './models';
import { DOMParser, Node } from '@xmldom/xmldom';
import { EOL } from 'os';

describe('formatXml', () => {
  const domParser = new DOMParser();

  const addHtmlBody = (content: string, pretty?: boolean) => {
    if (pretty) {
      return `
<html>
  <head>
    <title>test</title>
  </head>
  <body>
    ${content}
  </body>
</html>`.trim();
    }
    return `<html><head><title>test</title></head><body>${content}</body></html>`;
  };

  describe('empty formatOptions', () => {
    const xmlTests = [
      `<head>test</head>`,
      addHtmlBody('<h1 style="color: red">Hello World</h1><p>Lorem Ipsum<br/>Lorem ipsum</p>'),
      '<html xmlns="http://www.w3.org/1999/xhtml"><head><script><![CDATA[escape that <]]></script></head></html>',
    ];
    for (const xml of xmlTests) {
      it(`format ${xml}`, async () => {
        const document = domParser.parseFromString(xml, 'text/xml');
        const result = formatXml(document);
        expect(result).toBe(xml);
      });
    }
    it(`format unknown Node`, () => {
      expect(formatXml({ nodeType: -2, nodeName: 'foo' } as Node)).toBe('??foo');
    });
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
      it(`use WhitespaceInAutoClosingNode with xml ${test.xml}`, async () => {
        const document = domParser.parseFromString(test.xml, 'text/xml');
        const formatOptions = { useWhitespaceInAutoClosingNode: true };
        expect(formatXml(document)).toBe(test.xml);
        expect(formatXml(document, formatOptions)).toBe(test.expected);
      });
    }
  });
  describe('use indentation', () => {
    const xmlTests = [
      {
        name: 'head',
        xml: `<head>test<br/>test</head>`,
        expected: `<head>test<br />test</head>`,
      },
      {
        name: 'h1 style',
        xml: addHtmlBody('<h1 style="color: red">Hello World</h1><p>Lorem Ipsum<br/>Lorem ipsum</p>'),
        expected: addHtmlBody(
          `
    <h1 style="color: red">Hello World</h1>
    <p>Lorem Ipsum<br />Lorem ipsum</p>`.trim(),
          true
        ),
      },
      {
        name: 'comment style',
        xml: addHtmlBody('<!-- Test -->'),
        expected: addHtmlBody(`<!-- Test -->`, true),
      },
      {
        name: 'html div',
        xml: addHtmlBody('<div><![CDATA[ test ]]></div>'),
        expected: addHtmlBody(`<div><![CDATA[ test ]]></div>`, true),
      },
      {
        name: 'note test',
        xml: `<?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE note SYSTEM "Note.dtd">
        <?xml-stylesheet href="Namen.css" type="text/css"?>
        <note>
        <to>Tove</to>
        <from>Jani</from>
        <heading>Reminder</heading>
        <body>Don't forget me this weekend!</body>
        </note>`,
        expected: `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE note SYSTEM "Note.dtd">
<?xml-stylesheet href="Namen.css" type="text/css"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`.trim(),
      },
      {
        name: 'xml book',
        xml: `<?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE book PUBLIC "-//Norman Walsh//DTD DocBk XML V3.1.4//EN"
                         "http://nwalsh.com/docbook/xml/3.1.4/db3xml.dtd">
        <?xml-stylesheet href="Namen.css" type="text/css"?>
        <note>
        <to>Tove</to>
        <from>Jani</from>
        <heading>Reminder</heading>
        <body>Don't forget me this weekend!</body>
        </note>`,
        expected: `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE book PUBLIC "-//Norman Walsh//DTD DocBk XML V3.1.4//EN" "http://nwalsh.com/docbook/xml/3.1.4/db3xml.dtd">
<?xml-stylesheet href="Namen.css" type="text/css"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`.trim(),
      },
    ];
    for (const test of xmlTests) {
      it(`indentation with ${test.name || test.xml}`, async () => {
        const document = domParser.parseFromString(test.xml, 'text/xml');
        const formatOptions: FormatOptions = {
          indentation: '  ',
          eol: EOL,
          useWhitespaceInAutoClosingNode: true,
        };
        expect(formatXml(document, formatOptions)).toBe(test.expected);
      });
    }
  });
});
