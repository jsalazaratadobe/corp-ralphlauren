/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Ralph Lauren Corporate sections.
 * Adds section breaks (<hr>) between sections based on template definitions.
 * Selectors from captured DOM of https://corporate.ralphlauren.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues
    const sectionElements = [];
    for (const section of sections) {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let el = null;
      for (const sel of selectors) {
        el = element.querySelector(sel);
        if (el) break;
      }
      if (el) {
        sectionElements.push({ el, section });
      }
    }

    // Insert <hr> before each section (except the first) and section-metadata if style is set
    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const { el, section } = sectionElements[i];

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        el.after(sectionMetadata);
      }

      // Add <hr> before non-first sections (only if there is content before it)
      if (i > 0) {
        const hr = document.createElement('hr');
        el.before(hr);
      }
    }
  }
}
