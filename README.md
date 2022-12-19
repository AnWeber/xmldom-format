# xmldom-format

[XMLSerializer](https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer) to serialize and format Document  

## Installation

```shell
npm install xmldom-format
```

## Usage

### XMLSerializer

use `XMLSerializer.serializeToString(rootNode)` to serialize Document without FormatOptions

```js
  import { XMLSerializer } from "xmldom-format";
  const rootNode = new DOMParser().parse(`<html><body>Hello<br/>World</body></html>`);
  const xmlSerializer = new XMLSerializer();
  console.info(xmlSerializer.serializeToString(rootNode)); // <html><body>Hello<br/>World</body></html>
```


### formatXml

use `formatXml` to serialize and format Document with [FormatOptions](./src/models/formatOptions.ts)

```js
  import { formatXml } from "xmldom-format";
  const rootNode = new DOMParser().parse(`<html><body>Hello<br/>World</body></html>`);
  console.info(formatXml(rootNode, { useWhitespaceInAutoClosingNode: true})); // <html><body>Hello<br />World</body></html>
```

## License

[MIT License](LICENSE)

## Change Log

[CHANGELOG](CHANGELOG.md)
