/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news variant.
 * Base block: cards. Source: https://corporate.ralphlauren.com/
 * UE Model fields per card: image (reference), text (richtext)
 * Cards block: Each row = 1 card with 2 columns: image | text
 * Source DOM: div.corp-news-hp with div.corp-news items containing
 *   .news-thumb img (optional), .news-copy-title a, .news-copy-publish, .news-download a
 */
export default function parse(element, { document }) {
  const newsItems = element.querySelectorAll('.corp-news-widget .corp-news');
  const cells = [];

  newsItems.forEach((item) => {
    // Column 1: Thumbnail image (optional - some news items have no thumbnail)
    const img = item.querySelector('.news-thumb img.corp-image, .news-thumb picture img');
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

    // Column 2: News text - title + date + download link
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Title as heading with link
    const titleLink = item.querySelector('.news-copy-title a');
    if (titleLink) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = titleLink.href || '';
      a.textContent = titleLink.textContent.trim();
      h3.appendChild(a);
      textFrag.appendChild(h3);
    }

    // Publish date
    const dateEl = item.querySelector('.news-copy-publish');
    if (dateEl) {
      const p = document.createElement('p');
      p.textContent = dateEl.textContent.trim();
      textFrag.appendChild(p);
    }

    // Download link
    const downloadLink = item.querySelector('.news-download a');
    if (downloadLink) {
      const a = document.createElement('a');
      a.href = downloadLink.href || '';
      a.textContent = 'Download';
      textFrag.appendChild(a);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
