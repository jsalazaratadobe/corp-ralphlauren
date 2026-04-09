import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Identify image vs body divs: check for img (with or without picture wrapper)
    [...li.children].forEach((div) => {
      const img = div.querySelector('img');
      const hasOnlyImage = img && div.querySelectorAll('h1, h2, h3, h4, h5, h6, a').length === 0;
      if (hasOnlyImage) {
        div.className = 'cards-news-card-image';
      } else {
        div.className = 'cards-news-card-body';
      }
    });

    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('img').forEach((img) => {
    if (!img.src) return;
    const pic = img.closest('picture');
    const optimizedPic = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
    if (pic) {
      pic.replaceWith(optimizedPic);
    } else {
      const p = img.closest('p');
      if (p) {
        p.replaceWith(optimizedPic);
      } else {
        img.replaceWith(optimizedPic);
      }
    }
  });

  block.textContent = '';
  block.append(ul);
}
