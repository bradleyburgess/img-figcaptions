import { CheerioElement } from "./types";

/**
 * Check text to see if it's a caption.
 *
 * @param text - Text to check for caption
 * @returns Whether or not the input text is a caption, i.e. starts with "caption:"
 */
export const isCaptionText = (text: string | null | undefined): boolean =>
  !text ? false : text.trim().toLowerCase().startsWith("caption:");

/**
 * Get the tag name for a Cheerio element.
 *
 * @param el - the element you want the tag namr for
 * @returns The element's tag name, or `null` if there is none.
 */
export const getTagName = (el: CheerioElement): string | null => el[0]?.tagName ?? null;

/**
 * Get the stripped caption text from an element.
 *
 * @param text - the caption text
 * @returns The text without the "caption:" prefix
 */
export const stripCaption = (text: string) =>
  text
    .trim()
    .replace(/^caption:/i, "")
    .trim();

/**
 * Wrap an element in a `<figure>` tag.
 *
 * @param el - the element to wrap
 */
export function wrapElement(el: CheerioElement): void {
  el.wrap("<figure></figure>");
}

/**
 * Insert the `<figcaption>` tag with caption after the image.
 *
 * @param el - the element to insert a <figcaption> after
 * @param caption - the caption text to put in the `<figcaption>` tag
 */
export function insertCaptionAfterImage(el: CheerioElement, caption: string): void {
  el.after(`<figcaption>${caption}</figcaption>`);
}

/**
 * Remove the (now unneeded) element containing the caption.
 * Removes preceeding whitespace as well.
 *
 * @param el - the element to remove from the DOM tree.
 */
export function removeElement(el: CheerioElement): void {
  const prevNode = el[0].previousSibling as unknown as ChildNode;
  if (prevNode.nodeValue !== undefined && prevNode.nodeValue?.trim() === "")
    prevNode.nodeValue = "";
  el.remove();
}

/**
 * Remove the caption text from a text node.
 *
 * @param el - the text node element to remove caption from.
 */
export function deleteText(el: ChildNode): void {
  el.nodeValue = "";
}

/**
 * Get text in an element that isn't within a child.
 *
 * @param el - the element to get child-less text from
 * @returns text - the element's text
 * @example
 * <div>
 *   <p>This text is in a child element and won't be returned.</p>
 *   This text will be returned.
 * </div>
 */
export function getText(el: CheerioElement) {
  return el
    .first()
    .contents()
    .filter(function () {
      return this.type === "text";
    })
    .text()
    .trim();
}

/**
 * Replace an other-wise empty paragraph tag with the image.
 *
 * @param el - the element whose parent `<p>` to replace.
 */
export function replaceEmptyParagraphParent(el: CheerioElement): void {
  const elTagName = el[0].tagName;
  if (!["img", "picture", "figure", "a"].includes(elTagName)) return;
  const parent = el.parent();
  const parentTagName = el.parent()[0].tagName;
  if (parentTagName === "picture") return replaceEmptyParagraphParent(parent);
  if (parentTagName === "a") return replaceEmptyParagraphParent(parent);
  if (parentTagName === "figure") return replaceEmptyParagraphParent(parent);
  const parentChildrenLength = parent.children().length;
  const parentText = getText(parent);
  if (parentTagName === "p" && parentChildrenLength === 1 && parentText === "") {
    parent.replaceWith(el);
  }
}
