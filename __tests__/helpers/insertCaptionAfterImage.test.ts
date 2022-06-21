import * as cheerio from "cheerio";
import { insertCaptionAfterImage } from "../../src/helpers";

const content = {
  img: `<html>
  <body>
    <div class="container">
      <figure>
        <img />
      </figure>
    </div>
  </body>
</html>`,
};

describe("insertCaptionAfterImage", () => {
  it("works with img", () => {
    const $ = cheerio.load(content.img);
    const img = $("img");
    insertCaptionAfterImage(img, "Test Caption");

    const container = $(".container");
    const figure = $("figure");
    const figcaption = $("figcaption");

    expect(container.children().length).toBe(1);
    expect(figure.length).toBe(1);
    expect(figure.children().length).toBe(2);
    expect(figcaption.length).toBe(1);
    expect(figcaption.text()).toBe("Test Caption");
    expect(img.next()[0].tagName).toBe("figcaption");
  });
});
