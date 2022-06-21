# `img-figcaptions`

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Motivation](#motivation)
- [Installation and use](#installation-and-use)
  - [Options](#options)
- [Examples of input / output](#examples-of-input--output)
  - [Using title attribute](#using-title-attribute)
  - [Neighboring text node](#neighboring-text-node)
  - [Neighboring paragraph](#neighboring-paragraph)
  - [Neighboring paragraph with nested image](#neighboring-paragraph-with-nested-image)
  - [Markdown examples](#markdown-examples)
- [Issues / Roadmap](#issues--roadmap)
- [Contributing](#contributing)

## Overview

Easily add user-friendly captions to HTML images with `<figure>` and
`<figcaption>`, using user-friendly "Caption: " blocks. 

This module is intended to be used in a Node.js environment, e.g. in a static
site generator pipeline or workflow. It takes an HTML string and parses
plain-text captions into semantic elements. HTML comes in, and HTML goes out.
Simple.

## Features

- captions can be easily be indicated in 4 potential places (in decreasing order
  of priority):
  1. `title` attribute on the image
  2. The next text node after the image
  3. The next `<p>` element after the image
  4. If the `<img>` is in a paragraph, the parent's next sibling `<p>`
- works with `<img>` as well as `<picture>` images
- works with images wrapped in `<a>` tags
- case-insensitive:
  - `Caption: `
  - `caption: `
  - `CAPTION: `

## Motivation

When working with a CMS or writing markdown, it can be tricky for non-technical
content creators / editors to indicate captions for images. There do exist
plugins and packages that will transform `title` attributes into captions, but
it can be hard for non-technical writers to get that markdown syntax right
everytime. This can result in broken or mis-rendered content, which no one
wants.

This module allows easy creation of captions by adding a `title` attribute to
the image, or by indicating caption text next to or below the image itself with
"Caption: …"

For instance, you could write this in markdown:

```markdown
![alt text](example.jpg)

Caption: An example caption

I took this picture on my trip to South Africa, when I had the opportunity to
climb Table Mountain. (Rest of flow content ...)
```

… parse that markdown with e.g. `markdown-it`, and this module would then give
you:

```html
<figure>
  <img src="example.jpg" alt="alt text" />
  <figcaption>An example caption</figcaption>
</figure>
<p>
  I took this picture on my trip to South Africa, when I had the opportunity to climb Table
  Mountain. (Rest of flow content ...)
</p>
```

Markdown is possibly the most common source for content coming to a SSG, but I
didn't want to make any assumptions about where the content was coming from, and
therefore what shape the HTML would be.  That is why I decided to design this
module to make transformations on raw `html`, and not make e.g. a `markdown-it`
extension, which would limit the functionality to parsing markdown only.
Different CMS work differently, and this allows the most flexibility.

## Installation and use

To install:

```bash
# using NPM:
npm install @bradleyburgess/img-figcaptions

# using yarn:
yarn add @bradleyburgess/img-figcaptions
```

To use in your project, import the module, and pass the function the HTML string
you want to transform. You can optionally supply an options object, that has a
`replaceEmptyParagraph` key and a `removeTitle` key (shown here with the
defaults):

```js
const imgFigcaptions = require("@bradleyburgess/img-figcaptions");
const content = getHtmlContentFromSomewhere; // html string

const options = { removeTitle: false, replaceEmptyParagraph: true };

const output = imgFigcaptions(content, options); // transformed html string
```

### Options

`replaceEmptyParagraph` will remove a parent `<p>` if the only child is the
resulting `<figure>` element containing the image and caption. The default is
**true**.

`removeTitle` set to `true` will strip the `title` attribute from an image if
the caption comes from that attribute. The default is **false**.

## Examples of input / output

### Using title attribute

```html
<!-- input: -->
<img src="example.jpg" title="I have a caption" />

<!-- output: -->
<!-- You can also retain the title, which is the default behavior -->
<figure>
  <img src="example.jpg" />
  <figcaption>I have a caption</figcaption>
</figure>
```

### Neighboring text node

```html
<!-- input: -->
<div>
  <img src="example1.jpg" />caption: I have a caption
  <img src="example2.jpg" />
  CAPTION: I also have a caption
</div>

<!-- output: -->
<div>
  <figure>
    <img src="example1.jpg" />
    <figcaption>I have a caption</figcaption>
  </figure>
  <figure>
    <img src="example2.jpg" />
    <figcaption>I also have a caption</figcaption>
  </figure>
</div>
```

### Neighboring paragraph

```html
<!-- input: -->
<img src="puppy.jpg" />
<p>Caption: What a cute puppy!</p>

<!-- output: -->
<figure>
  <img src="puppy.jpg" />
  <figcaption>What a cute puppy!</figcaption>
</figure>
```

### Neighboring paragraph, with nested image

```html
<!-- input: 
     This is a typical example that would come from parsing markdown -->
<p>
  <img src="puppy.jpg" />
</p>
<p>Caption: What a cute puppy!</p>

<!-- output: -->
<!-- Note: you can leave the image parent <p> tag if you want,
     which is the default behavior -->
<figure>
  <img src="puppy.jpg" />
  <figcaption>What a cute puppy!</figcaption>
</figure>
```

### Markdown examples

Input:

```markdown
<!-- any of these inputs will work, and have the same result: -->

<!-- same line -->

![alt text](image.jpg) Caption: My fancy caption

<!-- or on the next line: -->

![alt text](image.jpg)
Caption: My fancy caption

<!-- or with a line in between: -->

![alt text](image.jpg)

Caption: My fancy caption
```

Result:

```html
<figure>
  <img src="image.jpg" alt="alt text" />
  <figcaption>My fancy caption</figcaption>
</figure>
```

## Issues / Roadmap

There are two current main limitations:

1\. `<br />` elements are not ignored, and therefore will often return "false"
negatives that don't transform captions. Ideally, when searching for the next
sibling text node, break tags will be removed if the text node following the
break tag has the caption. This will be implemented at a future time.

2\. The resulting HTML can be a bit untidy. The one assumption I've made is that
this will be part of a pipeline, where HTML will ultimately be cleaned up and/or
minified (using `prettier` or `html-minifier` e.g.). So little attempt has been
made to tidy the HTML. One exception is the removal of whitespace before an
element that is removed, so as to not have unnecessary empty lines.

- [x] Get caption from title attribute
- [x] Get caption from next text node
- [x] Get caption from next paragraph tag
- [x] Get caption from next paragraph tag, if image is nested in a paragraph
- [x] Works with `<picture>` tags
- [x] Works if the image is wrapped in an `<a>` tag.
- [ ] Works if `<br />` tags are in the next text node.

## Contributing

Please feel free to file an issue or a pull request!
