import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Optimize images (signature image etc.)
  block.querySelectorAll('img').forEach((img) => {
    if (!img.src || img.src.startsWith('data:')) return;
    const pic = img.closest('picture');
    const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '400' }]);
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
