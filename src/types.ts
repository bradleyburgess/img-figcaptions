import * as cheerio from "cheerio";

export type CheerioElement = cheerio.Cheerio<cheerio.Element>;

export interface CheckerResult {
  success: boolean;
  captionText: string | null;
  elementToRemove: ChildNode | CheerioElement | null;
  elementToWrap: CheerioElement | null;
}

export interface CheckResultSuccessTitle {
  success: true;
  captionText: string;
  elementToRemove: null;
  elementToWrap: CheerioElement;
}

export interface CheckResultSuccess<T> {
  success: true;
  captionText: string;
  elementToWrap: CheerioElement;
  elementToRemove: T;
}

export interface Img2FigureOptions {
  removeTitle?: boolean;
  replaceEmptyParagraph?: boolean;
}
