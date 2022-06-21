import * as cheerio from "cheerio";
import { wrapElement } from "../../src/helpers";

describe("wrapElement", () => {
  it("wraps an element", () => {
    const content = `<html><body><div class="container"><img /></div></body></html>`;
    const $ = cheerio.load(content);
    const imgToWrap = $("img");
    wrapElement(imgToWrap);
    const figure = $(".container figure");
    const img = $(".container figure img");
    expect(figure.length).toBe(1);
    expect(img.length).toBe(1);
  });
});
