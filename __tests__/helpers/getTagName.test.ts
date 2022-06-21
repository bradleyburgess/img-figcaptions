import * as cheerio from "cheerio";
import { getTagName } from "../../src/helpers";

const content = `<html>
  <body>
    <p class="paragraph-true">Caption: This is a caption</p>
    <p class="paragraph-true">caption: This is also a caption</p>
    <p class="paragraph-true">CAPTION: This is also a caption</p>

    <p class="paragraph-false">This is not a caption</p>

    <p id="image-with-caption">
      <img src="example.jpg" />
      Caption: This has a caption
    </p>
    <p id="image-with-no-caption">
      <img src="example.jpg" />
      This has no caption
    </p>
  </body>
</html>`;

const $ = cheerio.load(content);

describe("getTagName", () => {
  test("gets the tag name", () => {
    const p = $("p");
    const img = $("img");
    const _undefined = $($(".paragraph-true").children()[0]);

    expect(getTagName(p)).toBe("p");
    expect(getTagName(img)).toBe("img");
    expect(getTagName(_undefined)).toBe(null);
  });
});
