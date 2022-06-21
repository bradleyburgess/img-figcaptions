/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import * as cheerio from "cheerio";
import { checkSiblingElement } from "../../src/checkers";
import { CheerioElement } from "../../src/types";

const content = `<html>
  <body>
    <!-- true: normal example -->
    <img class="normal-example" />
    <p class="normal-example">Caption: this is a normal example</p>

    <!-- false: bad caption -->
    <img class="bad-caption" />
    <p>This is false</p>

    <!-- false: wrong tag for caption -->
    <img class="wrong-tag" />
    <span>Caption: This shouldn't work</span>

    <!-- false: no caption -->
    <img class="nothing-there" />

    <!-- true: works with picture -->
    <picture class="picture-parent">
      <source>
      <img class="with-picture" />
    </picture>
    <p class="with-picture">Caption: Works with a picture</p>

    <!-- works with anchors -->
    <a href="/" class="with-anchor">
      <img class="with-anchor" />
    </a>
    <p class="with-anchor">Caption: Works with anchors</p>
  </body>
</html>`;

const $ = cheerio.load(content);

describe("checkSiblingElement", () => {
  it("caption in next p", () => {
    const img = $("img.normal-example");
    const result = checkSiblingElement(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("this is a normal example");
    expect((result.elementToRemove as CheerioElement).hasClass("normal-example")).toBe(true);
    expect((result.elementToRemove as CheerioElement)!.get(0)!.tagName).toBe("p");
    expect(result.elementToWrap?.hasClass("normal-example")).toBe(true);
  });

  it("no caption in next p", () => {
    const img = $(".bad-caption");
    const result = checkSiblingElement(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.captionText).toBe(null);
    expect(result.elementToRemove).toBe(null);
    expect(result.elementToWrap).toBe(null);
  });

  it("wrong element type", () => {
    const img = $(".wrong-tag");
    const result = checkSiblingElement(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.captionText).toBe(null);
    expect(result.elementToRemove).toBe(null);
    expect(result.elementToWrap).toBe(null);
  });

  it("no sibling", () => {
    const img = $(".nothing-there");
    const result = checkSiblingElement(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.captionText).toBe(null);
    expect(result.elementToRemove).toBe(null);
    expect(result.elementToWrap).toBe(null);
  });

  it("works with picture", () => {
    const img = $("img.with-picture");
    const result = checkSiblingElement(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("Works with a picture");
    expect((result.elementToRemove as CheerioElement).hasClass("with-picture")).toBe(true);
    expect((result.elementToRemove as CheerioElement)!.get(0)!.tagName).toBe("p");
    expect(result.elementToWrap?.hasClass("with-picture")).toBe(false);
    expect(result.elementToWrap![0].tagName).toBe("picture");
    expect(result.elementToWrap?.hasClass("picture-parent")).toBe(true);
  });

  it("works with anchor", () => {
    const img = $("img.with-anchor");
    const result = checkSiblingElement(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("Works with anchors");
    expect((result.elementToWrap as CheerioElement)[0].tagName).toBe("a");
    expect((result.elementToRemove as CheerioElement).hasClass("with-anchor")).toBe(true);
  });
});
