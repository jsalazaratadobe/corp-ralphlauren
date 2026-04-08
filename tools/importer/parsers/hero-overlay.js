/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-overlay variant.
 * Base block: hero. Source: https://corporate.ralphlauren.com/
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Hero block: Row 1 = image, Row 2 = text (heading/description/CTA)
 * Source DOM: section.img-link with .corp-picture-holder img, h2.title, h3.deck, .corp-cta-button a
 * 4 instances: Our Company, Careers, Citizenship & Sustainability, Investor Relations
 */
export default function parse(element, { document }) {
  // Row 1: Background image
  const img = element.querySelector('.corp-picture-holder img.corp-image, .corp-picture-holder picture img');
  const imageFrag = document.createDocumentFragment();
  if (img) {
    imageFrag.appendChild(document.createComment(' field:image '));
    const pic = document.createElement('picture');
    const newImg = document.createElement('img');
    newImg.src = img.src || '';
    newImg.alt = img.alt || '';
    pic.appendChild(newImg);
    imageFrag.appendChild(pic);
  }

  // Row 2: Text content - heading + description + CTA
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  // Heading (h2.title)
  const heading = element.querySelector('h2.title, .copy-cont h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    textFrag.appendChild(h2);
  }

  // Description (h3.deck - desktop version, skip mobile duplicate)
  const desc = element.querySelector('h3.deck.tablet-only.desktop-only, .copy-cont h3.deck');
  if (desc) {
    const p = document.createElement('p');
    p.innerHTML = desc.innerHTML.trim();
    textFrag.appendChild(p);
  }

  // CTA button
  const cta = element.querySelector('.corp-cta-button a');
  if (cta) {
    const a = document.createElement('a');
    a.href = cta.href || '';
    a.textContent = cta.textContent.trim();
    textFrag.appendChild(a);
  }

  const cells = [
    [imageFrag],
    [textFrag],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
