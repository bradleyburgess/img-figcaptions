import * as cheerio from "cheerio";
import { replaceEmptyParagraphParent } from "../../src/helpers";

const content = {
  img: `<html>
  <body>
    <p>
     <img />
    </p>
  </body>
</html>`,

  picture: `<html>
  <body>
    <p>
      <picture>
        <source>
        <img />
      </picture>
    </p>
  </body>
</html>`,

  anchor: `<html>
  <body>
    <p>
      <a>
        <img />
      </a>
    </p>
  </body>
</html>`,

  anchorWithPicture: `<html>
  <body>
    <p>
      <a>
        <picture>
          <source>
          <img />
        </picture>
      </a>
    </p>
  </body>
</html>`,
};

describe("replaceEmptyParagraph", () => {
  it("works with img", () => {
    const $ = cheerio.load(content.img);
    const img = $("img");
    img.wrap("<figure></figure>");
    replaceEmptyParagraphParent(img);

    const figure = $("figure");
    const p = $("p");

    expect(figure.length).toBe(1);
    expect(figure.parent()[0].tagName).toBe("body");
    expect(p.length).toBe(0);
  });

  it("works with picture", () => {
    const $ = cheerio.load(content.picture);
    const picture = $("picture");
    picture.wrap("<figure></figure>");
    const img = $("img");
    replaceEmptyParagraphParent(img);

    const figure = $("figure");
    const pictureInFigure = $("figure picture");
    const p = $("p");

    expect(figure.length).toBe(1);
    expect(pictureInFigure.length).toBe(1);
    expect(figure.parent()[0].tagName).toBe("body");
    expect(p.length).toBe(0);
  });

  it("works with anchors", () => {
    const $ = cheerio.load(content.anchor);
    const img = $("img");
    const a = $("a");
    a.wrap("<figure></figure>");
    replaceEmptyParagraphParent(img);

    const imgInAnchorInFigure = $("figure a img");
    const p = $("p");
    expect(imgInAnchorInFigure.length).toBe(1);
    expect(p.length).toBe(0);
  });
});
