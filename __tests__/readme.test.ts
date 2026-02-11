import { Transformer, TransformingModel, transform, StringTransformer } from "../src/transformer"
import { HtmlParser, HtmlExtractionModel, css, extract } from "../src/extractor"

describe("xcrap README Example", () => {
    it("should successfully extract and transform data as shown in the README", async () => {
        // --- 1. Extraction ---
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
                extractor: extract("innerText"),
            },
            price: {
                query: css(".price"),
                extractor: extract("innerText"),
            },
            weight: {
                query: css("[data-spec='weight']"),
                extractor: extract("innerText"),
            },
            specsUrl: {
                query: css("a"),
                extractor: extract("href"),
            },
        })

        // Run the extraction
        const parser = new HtmlParser(html)
        const rawData = await parser.extractModel({ model: extractionModel })

        // Verify extraction results
        expect(rawData).toEqual({
            name: "  Cool Gadget  ",
            price: "$99.99",
            weight: "250g",
            specsUrl: "/specs.pdf",
        })

        // --- 2. Transformation ---

        // Define the transformation model
        const transformerModel = new TransformingModel({
            name: [
                transform({
                    key: "name", // Use the 'name' field from rawData
                    transformer: StringTransformer.trim, // Trim whitespace
                }),
            ],
            price: [
                transform({
                    key: "price",
                    transformer: (val: string) => parseFloat(val.replace("$", "")), // Custom cleanup
                }),
            ],
            specsUrl: [
                transform({
                    key: "specsUrl",
                    transformer: StringTransformer.resolveUrl("https://myshop.com/"), // Resolve relative URL
                }),
            ],
        })

        // Run the transformation
        const transformer = new Transformer(rawData)
        const cleanData = await transformer.transform(transformerModel)

        // Verify transformation results
        expect(cleanData).toEqual({
            name: "Cool Gadget",
            price: 99.99,
            specsUrl: "https://myshop.com/specs.pdf",
            weight: "250g",
        })
    })
})
