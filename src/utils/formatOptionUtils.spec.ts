import { addWhitespaceInAutoClosingNode, addIndentation } from './formatOptionUtils';

describe('formatOptionUtils', () => {
  describe('addIndentation', () => {
    it('should add 2 indentation on level 2', () => {
      const buffer: Array<string> = [];
      addIndentation(buffer, {
        isHtml: false,
        level: 2,
        visibleNamespaces: [],
        serializeNode: () => [],
        formatOptions: {
          indentation: '  ',
        },
      });
      expect(buffer).toEqual(['\r\n', '  ', '  ']);
    });
    it('should add no indentation on level 0', () => {
      const buffer: Array<string> = [];
      addIndentation(buffer, {
        isHtml: false,
        level: 0,
        visibleNamespaces: [],
        serializeNode: () => [],
        formatOptions: {
          indentation: '  ',
        },
      });
      expect(buffer).toEqual(['\r\n']);
    });
    it('should add eol with foo', () => {
      const buffer: Array<string> = [];
      addIndentation(buffer, {
        isHtml: false,
        level: 1,
        visibleNamespaces: [],
        serializeNode: () => [],
        formatOptions: {
          indentation: '  ',
          eol: 'foo',
        },
      });
      expect(buffer).toEqual(['foo', '  ']);
    });
    it('should add eol with \\r\\n', () => {
      const buffer: Array<string> = [];
      addIndentation(buffer, {
        isHtml: false,
        level: 1,
        visibleNamespaces: [],
        serializeNode: () => [],
        formatOptions: {
          indentation: '  ',
        },
      });
      expect(buffer).toEqual(['\r\n', '  ']);
    });
  });
  describe('addWhitespaceInAutoClosingNode', () => {
    it('should add whitespace', () => {
      const buffer: Array<string> = [];
      addWhitespaceInAutoClosingNode(buffer, {
        isHtml: false,
        level: 0,
        visibleNamespaces: [],
        serializeNode: () => [],
        formatOptions: {
          useWhitespaceInAutoClosingNode: true,
        },
      });
      expect(buffer).toEqual([' ']);
    });
    it('should not add whitespace', () => {
      const buffer: Array<string> = [];
      addWhitespaceInAutoClosingNode(buffer, {
        isHtml: false,
        level: 0,
        visibleNamespaces: [],
        serializeNode: () => [],
        formatOptions: {
          useWhitespaceInAutoClosingNode: false,
        },
      });
      expect(buffer).toEqual([]);
    });
  });
});
