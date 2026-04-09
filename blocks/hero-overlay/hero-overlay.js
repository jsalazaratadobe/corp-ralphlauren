import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Optimize images for responsive delivery
  block.querySelectorAll('img').forEach((img) => {
    if (!img.src) return;
    const pic = img.closest('picture');
    const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1200' }]);
    if (pic) {
      pic.replaceWith(optimized);
    } else {
      const p = img.closest('p');
      if (p && p.children.length === 1) {
        p.replaceWith(optimized);
      } else {
        img.replaceWith(optimized);
      }
    }
  });
}
