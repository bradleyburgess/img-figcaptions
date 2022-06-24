/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import * as cheerio from "cheerio";
import { checkForTitle } from "../../src/checkers";
import { getTagName } from "../../src/helpers";
import { CheckResultSuccessTitle } from "../../src/types";

const content = {
  img: `<html>
  <body>
    <img class="title" title="I have a title" />
    <img class="no-title" />
  </body>
</html>`,

  picture: `<html>
  <body>
    <picture>
      <source>
      <img title="I have a title caption" />
    </picture>
  </body>
</html>`,
};

describe("checkForTitle", () => {
  test("true for a title", () => {
    const $ = cheerio.load(content.img);
    const img = $(".title");
    const result = checkForTitle(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.elementToWrap).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("I have a title");
    expect(result.elementToRemove).toBe(null);
    expect(result.elementToWrap!.hasClass("title")).toBe(true);
  });

  test("false for no title", () => {
    const $ = cheerio.load(content.img);
    const img = $(".no-title");
    const result = checkForTitle(img);
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.captionText).toBe(null);
    expect(result.elementToRemove).toBe(null);
    expect(result.elementToWrap).toBe(null);
  });

  test("works with picture", () => {
    const $ = cheerio.load(content.picture);
    const img = $("img");
    const result = checkForTitle(img) as CheckResultSuccessTitle;
    expect(result.success).toBeDefined();
    expect(result.captionText).toBeDefined();
    expect(result.elementToRemove).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.captionText).toBe("I have a title caption");
    const elementToWrap = getTagName(result.elementToWrap);
    expect(elementToWrap).toBe("picture");
  });
});
