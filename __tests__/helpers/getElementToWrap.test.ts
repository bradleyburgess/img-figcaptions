import * as cheerio from "cheerio";
import { getElementToWrap, getTagName } from "../../src/helpers";

const content = {
  img: `<html>
  <body>
    <div>
      <img />
    </div>
  </body>
</html>`,

  picture: `<html>
  <body>
    <div>
      <picture>
        <img />
      </picture>
    </div>
  </body>
</html>`,
};

describe("getElementToWrap", () => {
  it("returns img", () => {
    const $ = cheerio.load(content.img);
    const img = $("img");
    const elementToWrap = getElementToWrap(img);
    const tagName = getTagName(elementToWrap);
    expect(tagName).toBe("img");
  });

  it("returne picture", () => {
    const $ = cheerio.load(content.picture);
    const img = $("img");
    const elementToWrap = getElementToWrap(img);
    const tagName = getTagName(elementToWrap);
    expect(tagName).toBe("picture");
  });
});
