/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-brands variant.
 * Base block: carousel. Source: https://corporate.ralphlauren.com/
 * UE Model fields per slide: media_image (reference), media_imageAlt (collapsed), content_text (richtext)
 * Carousel block: Each row = 1 slide with 2 columns: image | text
 * Source DOM: section.fullbleed with div.corp-slide items, each with .corp-picture-holder img + .corp-secondary-button a
 * 5 slides: Ralph Lauren Luxury, Polo Ralph Lauren, Lauren Ralph Lauren, Chaps, Hospitality
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.corp-slide');
  const cells = [];

  slides.forEach((slide) => {
    // Column 1: Slide image
    const img = slide.querySelector('.corp-picture-holder img.corp-image, .corp-picture-holder picture img');
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:media_image '));
    if (img) {
      const pic = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src || '';
      newImg.alt = img.alt || '';
      pic.appendChild(newImg);
      imageFrag.appendChild(pic);
    }

    // Column 2: Brand name link
    const brandLink = slide.querySelector('.corp-secondary-button a');
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:content_text '));
    if (brandLink) {
      const a = document.createElement('a');
      a.href = brandLink.href || '';
      a.textContent = brandLink.textContent.trim();
      textFrag.appendChild(a);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-brands', cells });
  element.replaceWith(block);
}
