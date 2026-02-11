# 🕷️ xcrap

**xcrap** is a powerful and flexible web scraping framework for Node.js. It bundles the best-in-class tools for data extraction and transformation into a single, easy-to-use package.

With **xcrap**, you can extract data from HTML, JSON, and Markdown using declarative models, and then clean, validate, and transform that data using a robust pipeline system.

---

## 📦 Installation

Install `xcrap` using your preferred package manager:

```bash
npm install xcrap
```

Or with yarn/pnpm:

```bash
yarn add xcrap
pnpm add xcrap
```

---

## 🚀 Features

- **Declarative Extraction**: Extract data from HTML, JSON, and Markdown using simple, readable models (`@xcrap/extractor`).
- **Data Transformation**: Clean, validate, and transform your extracted data with a powerful pipeline (`@xcrap/transformer`).
- **Modular Design**: Built on top of a solid core (`@xcrap/core`) for reliability and extensibility.
- **Type-Safe**: Written in TypeScript with full type definitions included.

---

## 📚 Quick Start

Here's a complete example showing how to extract data from an HTML string and then transform it into a clean, structured format.

### 1. Extraction

First, let's extract raw data from an HTML source using `HtmlParser` and `HtmlExtractionModel`.

```typescript
import { HtmlParser, HtmlExtractionModel, css, extract } from "xcrap/extractor"

const html = `
<html>
  <body>
    <div class="product">
      <h1 id="title">  Cool Gadget  </h1>
      <span class="price">$99.99</span>
      <div class="details">
        <span data-spec="weight">250g</span>
        <a href="/specs.pdf">Download Specs</a>
      </div>
    </div>
  </body>
</html>
`

// Define the extraction model
const extractionModel = new HtmlExtractionModel({
  name: {
    query: css("#title"),
    extractor: extract("innerText")
  },
  price: {
    query: css(".price"),
    extractor: extract("innerText")
  },
  weight: {
    query: css("[data-spec='weight']"),
    extractor: extract("innerText")
  },
  specsUrl: {
    query: css("a"),
    extractor: extract("href")
  }
})

// Run the extraction
const parser = new HtmlParser(html)
const rawData = await parser.extractModel({ model: extractionModel })

console.log(rawData)
/*
Output:
{
  name: "  Cool Gadget  ",
  price: "$99.99",
  weight: "250g",
  specsUrl: "/specs.pdf"
}
*/
```

### 2. Transformation

Now, let's clean up that raw data using `Transformer` and `TransformingModel`.

```typescript
import { Transformer, TransformingModel, transform, StringTransformer, StringValidator } from "xcrap/transformer"

// Define the transformation model
const transformerModel = new TransformingModel({
  name: [
    transform({
      key: "name", // Use the 'name' field from rawData
      transformer: StringTransformer.trim // Trim whitespace
    })
  ],
  price: [
    transform({
      key: "price",
      transformer: (val) => parseFloat(val.replace("$", "")) // Custom cleanup
    })
  ],
  specsUrl: [
    transform({
      key: "specsUrl",
      transformer: StringTransformer.resolveUrl("https://myshop.com") // Resolve relative URL
    })
  ]
})

// Run the transformation
const transformer = new Transformer(rawData)
const cleanData = await transformer.transform(transformerModel)

console.log(cleanData)
/*
Output:
{
    name: "Cool Gadget",
    price: 99.99,
    specsUrl: "https://myshop.com/specs.pdf",
    weight: "250g",
}
*/
```

---

## 📖 Core Concepts

### Extractor (`@xcrap/extractor`)

The extraction engine allows you to parse structured data from various sources.

- **`HtmlParser`**: For parsing HTML documents.
- **`JsonParser`**: For traversing and extracting from JSON objects.
- **`MarkdownParser`**: For extracting content from Markdown files.
- **`HtmlExtractionModel`**: Define the structure of the data you want to extract using query selectors (`css`, `xpath`) and extractors (`extract`).

### Transformer (`@xcrap/transformer`)

The transformation engine allows you to process raw data into its final form.

- **`Transformer`**: The main class that applies transformations to a dataset.
- **`TransformingModel`**: Defines a declarative pipeline of transformations for each field.
- **`StringTransformer`**: A collection of utility functions for common string operations (trim, replace, split, etc.).
- **`StringValidator`**: A collection of utility functions for validating string content (isNumeric, isEmail, etc.).

---

## 🤝 Contributing

We welcome contributions! Whether it's fixing bugs, improving documentation, or adding new features.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
