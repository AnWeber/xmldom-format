export function xmlEncoder(c: string) {
  return (
    (c === '<' && '&lt;') ||
    (c === '>' && '&gt;') ||
    (c === '&' && '&amp;') ||
    (c === '"' && '&quot;') ||
    `&#${c.charCodeAt(0)};`
  );
}
