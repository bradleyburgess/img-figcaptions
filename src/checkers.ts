import { getTagName, isCaptionText, stripCaption } from "./helpers";
import { CheckerResult, CheerioElement } from "./types";

const defaultResult: CheckerResult = {
  success: false,
  captionText: null,
  elementToRemove: null,
  elementToWrap: null,
};

export function checkForTitle(el: CheerioElement): CheckerResult {
  const result = { ...defaultResult };
  const title = el.attr("title");
  if (typeof title === "string" && title !== "") {
    result.success = true;
    result.captionText = stripCaption(title);
    result.elementToWrap = el;
  }
  return result;
}

export function checkSiblingTextNode(el: CheerioElement, result?: CheckerResult): CheckerResult {
  result = result || { ...defaultResult };
  const parent = el.parent();
  const parentTagName = parent[0].tagName;
  if (parentTagName === "picture") return checkSiblingTextNode(parent, result);
  const node = el[0].nextSibling as unknown as ChildNode;
  const nodeText = node?.nodeValue ?? "";
  if (isCaptionText(nodeText)) {
    result.success = true;
    result.captionText = stripCaption(nodeText);
    result.elementToRemove = node;
    result.elementToWrap = el;
  }
  return result;
}

export function checkSiblingElement(el: CheerioElement, result?: CheckerResult): CheckerResult {
  result = result || { ...defaultResult };
  const parent = el.parent();
  if (getTagName(parent) === "picture") return checkSiblingElement(parent, result);
  if (getTagName(parent) === "a") return checkSiblingElement(parent, result);
  const nextEl = el.next();
  const nextElTagName = getTagName(nextEl);
  const nextElText = nextEl.text();
  if (nextElTagName === "p" && nextEl.children().length === 0 && isCaptionText(nextElText)) {
    result.success = true;
    result.captionText = stripCaption(nextEl.text());
    result.elementToRemove = nextEl;
    result.elementToWrap = el;
  }
  return result;
}

export function checkCousinElement(el: CheerioElement, result?: CheckerResult): CheckerResult {
  result = result || { ...defaultResult };
  const parent = el.parent();
  if (getTagName(parent) === "picture") return checkCousinElement(parent, result);
  if (getTagName(parent) === "a") return checkCousinElement(parent, result);
  result = checkSiblingElement(parent, result);
  if (result.success) result.elementToWrap = el;
  return result;
}
