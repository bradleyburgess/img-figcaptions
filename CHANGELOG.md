# Changelog

## v1.1.1 (06/24/2022)

- Fixed a bug with `checkForTitle` that didn't return `picture` parent

---

## v1.1.0 (06/23/2022)

- Added `addFigureToAllImgs` option.
- Added `getElementToWrap` helper, with tests.

---

## v1.0.0 (06/21/2022)

First version.

Features:

- accepts caption text from:
  - title attribute
  - next text node
  - next paragraph element
  - paragraph parent's next paragraph sibling
- `replaceEmptyParagraph`, by default
- `removeTitle`, if caption text comes from title attribute
- works with `<picture>` elements
- works when images are wrapped in anchor tags
