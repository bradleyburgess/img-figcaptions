import * as cheerio from "cheerio";
import { getElementToWrap, wrapElement } from "../../src/helpers";

const content = {
  img: `<html>
  <body>
    <div class="container">
      <img />
    </div>
  </body>
</html>`,

  picture: `<html>
  <body>
    <div>
      <picture>
        <source>
        <img />
      </picture>
    </div>
  </body>
</html>`,
};

describe("wrapElement", () => {
  it("wraps an img", () => {
    const $ = cheerio.load(content.img);
    const imgToWrap = $("img");
    wrapElement(imgToWrap);
    const figure = $(".container figure");
    const img = $(".container figure img");
    expect(figure.length).toBe(1);
    expect(img.length).toBe(1);
  });

  it("wraps a picture", () => {
    const $ = cheerio.load(content.picture);
    const el = $("img");
    const elementToWrap = getElementToWrap(el);
    wrapElement(elementToWrap);
    const figure = $("figure");
    const img = $("figure picture img");
    expect(figure.length).toBe(1);
    expect(img.length).toBe(1);
  });
});
