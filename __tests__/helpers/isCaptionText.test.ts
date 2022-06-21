import { isCaptionText } from "../../src/helpers";

describe("isCaptionText", () => {
  test("true: uppercase", () => {
    expect(isCaptionText("CAPTION: This is a caption")).toBe(true);
  });

  test("true: lowercase", () => {
    expect(isCaptionText("caption: This is a caption")).toBe(true);
  });

  test("true: sentence case", () => {
    expect(isCaptionText("Caption: This is a caption")).toBe(true);
  });

  test("false", () => {
    expect(isCaptionText("asdflaksdf")).toBe(false);
  });
});
