import * as cheerio from "cheerio";
import { getTagName, getText } from "../src/helpers";
import imgFigcaptions from "../src/index";

const content = {
  oneImg: `<html>
  <body>
    <div class="container">
      <img class="one-img"/>Caption: one image caption
    </div>
  </body>
</html>`,

  onePicture: `<html>
  <body>
    <div class="container">
      <picture>
        <source>
        <img class="one-picture"/>
      </picture>
      Caption: one picture caption
    </div>
  </body>
</html>`,

  emptyParagraph: `<html>
  <body>
    <p>
      <img />
      Caption: Empty Paragraph
    </p>
  </body>
</html>`,

  removeTitle: `<html>
  <body>
      <img title="I have a title" />
  </body>
</html>`,

  multipleImages: `<html>
  <body>
    <!-- img with sibling text caption -->
    <img class="sibling-text" />
    Caption: Sibling text

    <!-- img with sibling paragraph -->
    <img class="sibling-paragraph" />
    <p>Caption: Sibling paragraph</p>

    <!-- inside a paragraph -->
    <p class="parent-paragraph">
      <img class="parent-paragraph" />
      Caption: Inside a paragraph
    </p>

    <!-- cousin -->
    <p>
      <img class="cousin" />
    </p>
    <p>Caption: Cousin paragraph</p>

    <!-- picture -->
    <p>
      <picture>
        <img class="picture" />
      </picture>
      Caption: Picture in a paragraph
    </p>
  </body>
</html>`,

  captionInsideAnchor: `<html>
  <body>
    <a href="/" >
      <img /> 
      Caption: Caption inside anchor
    </a>
  </body>
</html>`,

  captionNextToAnchor: `<html>
  <body>
    <a href="/" >
      <img /> 
    </a>
    <p>Caption: Caption next to anchor</p>
  </body>
</html>`,

  captionAsCousin: `<html>
  <body>
    <p>
      <a href="/" >
        <img /> 
      </a>
    </p>
    <p>Caption: Caption as cousin</p>
  </body>
</html>`,

  fullHtml: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Testing plugin</title>
  </head>
  <body>
    <p>
      <img src="example.jpg" />
    </p>
    <p>Caption: This is a caption</p>
    <p>This is a sample paragraph</p>
    <img src="example.com" alt="" class="remain" />
    <p>This paragraph should remain</p>
    <a href="/"><img src="example.jpg" alt="" /></a>
    <p>Caption: This should be transformed</p>
  </body>
</html>`,
};

const setup = (content: string) => cheerio.load(content);

describe("end to end", () => {
  it("works with one img", () => {
    const result = imgFigcaptions(content.oneImg);
    const $ = setup(result);
    const container = $(".container");
    const figure = $(".container figure");
    const figcaption = $(".container figure figcaption");
    const figcaptionText = figcaption.text();
    const img = $(".container figure img");
    expect(container.children().length).toBe(1);
    expect(getText(container)).toBe("");
    expect(figure.length).toBe(1);
    expect(figcaption.length).toBe(1);
    expect(img.length).toBe(1);
    expect(figcaptionText).toBe("one image caption");
  });

  it("works with one picture", () => {
    const result = imgFigcaptions(content.onePicture);
    const $ = setup(result);
    const container = $(".container");
    const figure = $(".container figure");
    const figcaption = $(".container figure figcaption");
    const figcaptionText = figcaption.text();
    const picture = $(".container figure picture");
    const img = $(".container figure picture img");
    expect(container.children().length).toBe(1);
    expect(getText(container)).toBe("");
    expect(figure.length).toBe(1);
    expect(figcaption.length).toBe(1);
    expect(picture.length).toBe(1);
    expect(img.length).toBe(1);
    expect(figcaptionText).toBe("one picture caption");
  });

  it("replaces empty paragraph", () => {
    const result = imgFigcaptions(content.emptyParagraph, { replaceEmptyParagraph: true });
    const $ = setup(result);
    const figure = $("figure");
    const figcaption = $("figcaption");
    const figcaptionText = figcaption.text();
    const img = $("figure img");
    const p = $("p");
    expect(figure.length).toBe(1);
    expect(figcaption.length).toBe(1);
    expect(img.length).toBe(1);
    expect(p.length).toBe(0);
    expect(figcaptionText).toBe("Empty Paragraph");
  });

  it("works with remove title", () => {
    const result = imgFigcaptions(content.removeTitle, { removeTitle: true });
    const $ = setup(result);
    const figure = $("figure");
    const img = $("figure img");
    const figcaption = $("figure figcaption");

    expect(figure.length).toBe(1);
    expect(figcaption.length).toBe(1);
    expect(img.length).toBe(1);
    expect(figcaption.text()).toBe("I have a title");
    expect(img.attr("title")).toBeFalsy();
  });

  it("works with multiple images", () => {
    const result = imgFigcaptions(content.multipleImages, { replaceEmptyParagraph: true });
    const $ = setup(result);
    const figure = $("figure");
    const figcaption = $("figcaption");
    const picture = $("picture");
    const img = $("img");
    const p = $("p");

    expect(figure.length).toBe(5);
    expect(img.length).toBe(5);
    expect(figcaption.length).toBe(5);
    expect(picture.length).toBe(1);
    expect(p.length).toBe(0);

    // sibling text
    let el = $("img.sibling-text");
    expect(el.next().text()).toBe("Sibling text");
    expect(el.parent().children().length).toBe(2);

    // sibling paragraph
    el = $("img.sibling-paragraph");
    expect(el.next().text()).toBe("Sibling paragraph");
    expect(el.parent().children().length).toBe(2);

    // inside paragraph
    el = $("img.parent-paragraph");
    expect(el.next().text()).toBe("Inside a paragraph");
    expect(el.parent().children().length).toBe(2);

    // inside paragraph
    el = $("img.cousin");
    expect(el.next().text()).toBe("Cousin paragraph");
    expect(el.parent().children().length).toBe(2);

    // inside paragraph
    el = $("img.picture");
    expect(el.parent().next().text()).toBe("Picture in a paragraph");
    expect(el.parent().parent().children().length).toBe(2);
  });

  it("works with captions inside anchor", () => {
    const result = imgFigcaptions(content.captionInsideAnchor);
    const $ = cheerio.load(result);
    const img = $("img");
    const a = $("a");
    const figure = $("figure");
    const figcaption = $("figcaption");

    expect(getTagName(figure.parent())).toBe("a");
    expect(a.children().length).toBe(1);
    expect(figcaption.length).toBe(1);
    expect(figure.children().length).toBe(2);
    expect(getTagName(img.parent())).toBe("figure");
  });

  it("works with caption next to anchor", () => {
    const result = imgFigcaptions(content.captionAsCousin, { replaceEmptyParagraph: true });
    const $ = cheerio.load(result);
    const img = $("img");
    const a = $("a");
    const figure = $("figure");
    const figcaption = $("figcaption");
    const p = $("p");

    expect(p.length).toBe(0);
    expect(figcaption.text()).toBe("Caption as cousin");
    expect(figure.length).toBe(1);
    expect(figcaption.length).toBe(1);
    expect(getTagName(img.parent())).toBe("a");
    expect(getTagName(a.parent())).toBe("figure");
    expect(getTagName(a.next())).toBe("figcaption");
  });

  it("works with a full html page", () => {
    const result = imgFigcaptions(content.fullHtml);
    const $ = cheerio.load(result);
    const imgs = $("img");

    // first img
    let img = $(imgs[0]);
    let figcaption = img.next();
    expect(figcaption[0].tagName).toBe("figcaption");
    expect(figcaption.text()).toBe("This is a caption");

    // second img
    img = $(imgs[2]);
    figcaption = img.parent().next();
    expect(figcaption[0].tagName).toBe("figcaption");
    expect(figcaption.text()).toBe("This should be transformed");

    const p = $("p").filter((i, el) => $(el).text() === "This paragraph should remain");
    expect(p.prev().hasClass("remain")).toBe(true);
  });
});
