import * as cheerio from "cheerio";
import {
  checkCousinElement,
  checkForTitle,
  checkSiblingElement,
  checkSiblingTextNode,
} from "./checkers";
import {
  deleteText,
  getElementToWrap,
  insertCaptionAfterImage,
  removeElement,
  replaceEmptyParagraphParent,
  wrapElement,
} from "./helpers";
import {
  CheckerResult,
  CheckResultSuccess,
  CheckResultSuccessTitle,
  CheerioElement,
  Img2FigureOptions,
} from "./types";

const defaultOptions: Img2FigureOptions = {
  removeTitle: false,
  replaceEmptyParagraph: true,
  addFigureToAllImgs: false,
};

export = function imgFigcaptions(content: string, options?: Img2FigureOptions) {
  options = { ...defaultOptions, ...(options || {}) };
  const $ = cheerio.load(content);
  const imgs = $("img").not("figure img");

  for (let i = 0; i < imgs.length; i++) {
    const img = $(imgs[i]);
    const results: Results = {};

    results.checkForTitle = checkForTitle(img);
    if (results.checkForTitle.success) {
      const { elementToWrap, captionText } = results.checkForTitle as CheckResultSuccessTitle;
      wrapElement(elementToWrap);
      insertCaptionAfterImage(img, captionText);
      if (options.removeTitle) img.removeAttr("title");
      if (options.replaceEmptyParagraph) replaceEmptyParagraphParent(elementToWrap);
      continue;
    }

    results.checkSiblingTextNode = checkSiblingTextNode(img);
    if (results.checkSiblingTextNode.success) {
      const { elementToWrap, elementToRemove, captionText } =
        results.checkSiblingTextNode as CheckResultSuccess<ChildNode>;
      wrapElement(elementToWrap);
      insertCaptionAfterImage(elementToWrap, captionText);
      deleteText(elementToRemove);
      if (options.replaceEmptyParagraph) replaceEmptyParagraphParent(elementToWrap);
      continue;
    }

    results.checkSiblingElement = checkSiblingElement(img);
    if (results.checkSiblingElement.success) {
      const { elementToWrap, elementToRemove, captionText } =
        results.checkSiblingElement as CheckResultSuccess<CheerioElement>;
      removeElement(elementToRemove);
      wrapElement(elementToWrap);
      insertCaptionAfterImage(elementToWrap, captionText);
      if (options.replaceEmptyParagraph) replaceEmptyParagraphParent(elementToWrap);
      continue;
    }

    results.checkCousinElement = checkCousinElement(img);
    if (results.checkCousinElement.success) {
      const { elementToWrap, elementToRemove, captionText } =
        results.checkCousinElement as CheckResultSuccess<CheerioElement>;
      removeElement(elementToRemove);
      wrapElement(elementToWrap);
      insertCaptionAfterImage(elementToWrap, captionText);
      if (options.replaceEmptyParagraph) replaceEmptyParagraphParent(elementToWrap);
      continue;
    }

    if (options.addFigureToAllImgs) {
      const elementToWrap = getElementToWrap(img);
      wrapElement(elementToWrap);
      if (options.replaceEmptyParagraph) replaceEmptyParagraphParent(elementToWrap);
    }
  }

  const output = $.html();
  return output;
};

interface Results {
  [key: string]: CheckerResult;
}
