/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import heroOverlayParser from './parsers/hero-overlay.js';
import carouselBrandsParser from './parsers/carousel-brands.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/ralphlauren-cleanup.js';
import sectionsTransformer from './transformers/ralphlauren-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'hero-overlay': heroOverlayParser,
  'carousel-brands': carouselBrandsParser,
  'cards-news': cardsNewsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'corporate-homepage',
  description: 'Ralph Lauren corporate homepage with company overview, news, and investor information',
  urls: [
    'https://corporate.ralphlauren.com/',
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['div.hero'],
    },
    {
      name: 'hero-overlay',
      instances: [
        'div.cid_homepage-company-bucket section.img-link',
        'div.cid_homepage-careers-bucket section.img-link',
        'div.cid_homepage-citizenship-bucket section.img-link',
        'div.cid_homepage-investors-bucket section.img-link',
      ],
    },
    {
      name: 'carousel-brands',
      instances: ['div.cid_homepage-brands-carousel section.fullbleed'],
    },
    {
      name: 'cards-news',
      instances: ['div.corp-news-hp'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'div.hero',
      style: null,
      blocks: ['hero-video'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Our Company',
      selector: 'div.cid_homepage-company-bucket',
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Brands',
      selector: 'div.cid_homepage-brands-carousel',
      style: null,
      blocks: ['carousel-brands'],
      defaultContent: ['h2.section-header'],
    },
    {
      id: 'section-4',
      name: 'Careers',
      selector: 'div.cid_homepage-careers-bucket',
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Citizenship and Sustainability',
      selector: 'div.cid_homepage-citizenship-bucket',
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Investor Relations',
      selector: 'div.cid_homepage-investors-bucket',
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Latest From RL Newsroom',
      selector: 'div.home-page-news',
      style: null,
      blocks: ['cards-news'],
      defaultContent: ['h2.widget-title', 'div.corp-news-more-btn'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
