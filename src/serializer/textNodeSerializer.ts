import { NodeType } from './nodeType';
import { xmlEncoder } from './xmlEncoder';

/**
 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
 * `&amp;` and `&lt;` respectively.
 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
 * when that string is not marking the end of a CDATA section.
 *
 * In the content of elements, character data is any string of characters
 * which does not contain the start-delimiter of any markup
 * and does not include the CDATA-section-close delimiter, `]]>`.
 *
 * @see https://www.w3.org/TR/xml/#NT-CharData
 * @see https://w3c.github.io/DOM-Parsing/#xml-serializing-a-text-node
 */
export function serializeTextNode(node: Node): Array<string> | undefined {
	if (isTextNode(node)) {
		return [ node.data
			.replace(/[<&>]/gu, xmlEncoder)
		];
	}
	return undefined;
}


function isTextNode(node: Node): node is CharacterData{
	return node.nodeType === NodeType.TEXT_NODE || typeof (node as {data?: unknown}).data === "string";
}