/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import * as cheerio from "cheerio";
import { checkSiblingTextNode } from "../../src/checkers";

const content = `<html>
  <body>
    <!-- true: same line -->
    <img class="true same-line" />Caption: this caption is on the same line

    <!-- true: next line -->
    <img class="true next-line" />
    Caption: this caption is on the next line

    <!-- false: bad format -->
    <img class="false bad-caption" />Bad format

    <!-- false: no caption -->
    <img class="false no-caption" /><img />

    <!-- true: in picture -->
    <picture>
      <source>
      <img class="true in-picture" />
      Caption: this caption is inside a picture
    </picture>

    <!-- true: next to picture -->
    <picture class="next-to-picture--parent">
      <source>
      <img class="next-to-picture" />
    </picture>
    Caption: this caption is next to a picture

    <!-- works with anchors -->
    <a class="with-anchor" >
      <img class="with-anchor" />
      Caption: works with anchor
    </a>
  </body>
</html>`;

const $ = cheerio.load(content);

describe("checkSiblingTextNode", () => {
  test("true if on same line", () => {
    const img = $(".true.same-line");
    const textNode = img[0].nextSibling;
    const result = checkSiblingTextNode(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("this caption is on the same line");
    expect(result.elementToRemove).toBe(textNode);
    expect(result.elementToWrap!.hasClass("same-line")).toBe(true);
  });

  test("true if on next line", () => {
    const img = $(".true.next-line");
    const textNode = img[0].nextSibling;
    const result = checkSiblingTextNode(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("this caption is on the next line");
    expect(result.elementToRemove).toBe(textNode);
    expect(result.elementToWrap!.hasClass("next-line")).toBe(true);
  });

  test("false with bad caption", () => {
    const img = $(".false.bad-caption");
    const result = checkSiblingTextNode(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.captionText).toBe(null);
    expect(result.elementToRemove).toBe(null);
    expect(result.elementToWrap).toBe(null);
  });

  test("false with no caption", () => {
    const img = $(".false.no-caption");
    const result = checkSiblingTextNode(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.captionText).toBe(null);
    expect(result.elementToRemove).toBe(null);
    expect(result.elementToWrap).toBe(null);
  });

  test("false inside picture", () => {
    const img = $(".true.in-picture");
    const result = checkSiblingTextNode(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.captionText).toBe(null);
    expect(result.elementToRemove).toBe(null);
  });

  test("true if next to picture", () => {
    const img = $(".next-to-picture");
    const textNode = img.parent()[0].nextSibling;
    const result = checkSiblingTextNode(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("this caption is next to a picture");
    expect(result.elementToRemove).toBe(textNode);
    expect(result.elementToWrap!.hasClass("next-to-picture")).toBe(false);
    expect(result.elementToWrap!.hasClass("next-to-picture--parent")).toBe(true);
  });

  it("works with anchors", () => {
    const img = $("img.with-anchor");
    const textNode = img[0].nextSibling;
    const result = checkSiblingTextNode(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("works with anchor");
    expect(result.elementToRemove).toBe(textNode);
    expect(result.elementToWrap!.hasClass("with-anchor")).toBe(true);
  });
});
