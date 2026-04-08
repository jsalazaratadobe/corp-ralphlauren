/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video variant.
 * Base block: hero. Source: https://corporate.ralphlauren.com/
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Hero block: Row 1 = image, Row 2 = text (heading/description/CTA)
 * Source DOM: div.hero containing video + div.corp-quote with quote text and signature
 */
export default function parse(element, { document }) {
  // Row 1: Background image - use video poster or first significant image
  // Source has a <video> with source, not a static image
  // For import, we extract the video source as a link placeholder
  const video = element.querySelector('video source');
  const imageFrag = document.createDocumentFragment();
  if (video) {
    const videoLink = document.createElement('a');
    videoLink.href = video.getAttribute('src') || '';
    videoLink.textContent = video.getAttribute('src') || '';
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(videoLink);
  }

  // Row 2: Text content - quote text + signature
  const quoteDiv = element.querySelector('.corp-quote');
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  if (quoteDiv) {
    // Get the quote text (first child div with text content)
    const quoteTextEl = quoteDiv.querySelector(':scope > div:first-child');
    if (quoteTextEl) {
      const p = document.createElement('p');
      p.textContent = quoteTextEl.textContent.trim();
      textFrag.appendChild(p);
    }

    // Get the signature image
    const sigImg = quoteDiv.querySelector('.corp-signature img');
    if (sigImg) {
      const pic = document.createElement('picture');
      const img = document.createElement('img');
      img.src = sigImg.src || '';
      img.alt = sigImg.alt || 'Ralph Lauren signature';
      pic.appendChild(img);
      textFrag.appendChild(pic);
    }
  }

  const cells = [
    [imageFrag],
    [textFrag],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
