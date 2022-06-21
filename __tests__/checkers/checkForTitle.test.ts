/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import * as cheerio from "cheerio";
import { checkForTitle } from "../../src/checkers";

const content = `<html>
  <body>
    <img class="title" title="I have a title" />
    <img class="no-title" />
  </body>
</html>`;

const $ = cheerio.load(content);

test("true for a title", () => {
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
