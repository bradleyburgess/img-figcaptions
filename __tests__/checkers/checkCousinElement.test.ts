/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import * as cheerio from "cheerio";
import { checkCousinElement } from "../../src/checkers";
import { getTagName } from "../../src/helpers";
import { CheerioElement } from "../../src/types";

const content = `<html>
  <body>
    <!-- true: typical markdown output example -->
    <p>
      <img class="typical-markdown" />
    </p>
    <p class="typical-markdown">Caption: Typical markdown example</p>

    <!-- false: wrong format -->
    <p>
      <img class="wrong-format" />
    </p>
    <p>This shouldn't work</p>

    <-- true: works with picture -->
    <p>
      <picture>
        <source>
        <img class="with-picture" />
      </picture>
    </p>
    <p class="with-picture">Caption: Works with a picture</p>

    <!-- works with anchors -->
    <p>
      <a href="/" class="with-anchor">
        <img class="with-anchor" />
      </a>
    </p>
    <p class="with-anchor">Caption: works with anchors</p>
  </body>
</html>`;

const $ = cheerio.load(content);

describe("checkCousinElement", () => {
  test("typical markdown example", () => {
    const img = $("img.typical-markdown");
    const element = $("p.typical-markdown")[0];
    const result = checkCousinElement(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("Typical markdown example");
    const { elementToRemove } = result;
    expect((elementToRemove as CheerioElement)![0]).toBe(element);
  });

  test("false with wrong format", () => {
    const img = $("img.wrong-format");
    const result = checkCousinElement(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.captionText).toBe(null);
    expect(result.elementToRemove).toBe(null);
  });

  test("works with picture", () => {
    const img = $("img.with-picture");
    const element = $("p.with-picture")[0];
    const result = checkCousinElement(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("Works with a picture");
    const { elementToRemove } = result;
    expect((elementToRemove as CheerioElement)![0]).toBe(element);
  });

  test("works with anchors", () => {
    const img = $("img.with-anchor");
    const element = $("p.with-anchor")[0];
    const result = checkCousinElement(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("works with anchors");
    const { elementToRemove } = result;
    const { elementToWrap } = result;
    expect((elementToRemove as CheerioElement)![0]).toBe(element);
    expect(getTagName(elementToWrap as CheerioElement)).toBe("a");
  });
});
