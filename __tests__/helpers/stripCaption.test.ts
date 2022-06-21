import { stripCaption } from "../../src/helpers";

describe("stripCaption", () => {
  it("removes the caption", () => {
    const caption = stripCaption("Caption: This is a caption");
    expect(caption).toBe("This is a caption");
  });

  it("works with lowercase", () => {
    const caption = stripCaption("caption: This is a caption");
    expect(caption).toBe("This is a caption");
  });

  it("works with uppercase", () => {
    const caption = stripCaption("CAPTION: This is a caption");
    expect(caption).toBe("This is a caption");
  });
});
