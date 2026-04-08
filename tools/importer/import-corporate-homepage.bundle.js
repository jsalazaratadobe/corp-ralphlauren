var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-corporate-homepage.js
  var import_corporate_homepage_exports = {};
  __export(import_corporate_homepage_exports, {
    default: () => import_corporate_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const video = element.querySelector("video source");
    const imageFrag = document.createDocumentFragment();
    if (video) {
      const videoLink = document.createElement("a");
      videoLink.href = video.getAttribute("src") || "";
      videoLink.textContent = video.getAttribute("src") || "";
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(videoLink);
    }
    const quoteDiv = element.querySelector(".corp-quote");
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (quoteDiv) {
      const quoteTextEl = quoteDiv.querySelector(":scope > div:first-child");
      if (quoteTextEl) {
        const p = document.createElement("p");
        p.textContent = quoteTextEl.textContent.trim();
        textFrag.appendChild(p);
      }
      const sigImg = quoteDiv.querySelector(".corp-signature img");
      if (sigImg) {
        const pic = document.createElement("picture");
        const img = document.createElement("img");
        img.src = sigImg.src || "";
        img.alt = sigImg.alt || "Ralph Lauren signature";
        pic.appendChild(img);
        textFrag.appendChild(pic);
      }
    }
    const cells = [
      [imageFrag],
      [textFrag]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse2(element, { document }) {
    const img = element.querySelector(".corp-picture-holder img.corp-image, .corp-picture-holder picture img");
    const imageFrag = document.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document.createComment(" field:image "));
      const pic = document.createElement("picture");
      const newImg = document.createElement("img");
      newImg.src = img.src || "";
      newImg.alt = img.alt || "";
      pic.appendChild(newImg);
      imageFrag.appendChild(pic);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    const heading = element.querySelector("h2.title, .copy-cont h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      textFrag.appendChild(h2);
    }
    const desc = element.querySelector("h3.deck.tablet-only.desktop-only, .copy-cont h3.deck");
    if (desc) {
      const p = document.createElement("p");
      p.innerHTML = desc.innerHTML.trim();
      textFrag.appendChild(p);
    }
    const cta = element.querySelector(".corp-cta-button a");
    if (cta) {
      const a = document.createElement("a");
      a.href = cta.href || "";
      a.textContent = cta.textContent.trim();
      textFrag.appendChild(a);
    }
    const cells = [
      [imageFrag],
      [textFrag]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-brands.js
  function parse3(element, { document }) {
    const slides = element.querySelectorAll(".corp-slide");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".corp-picture-holder img.corp-image, .corp-picture-holder picture img");
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:media_image "));
      if (img) {
        const pic = document.createElement("picture");
        const newImg = document.createElement("img");
        newImg.src = img.src || "";
        newImg.alt = img.alt || "";
        pic.appendChild(newImg);
        imageFrag.appendChild(pic);
      }
      const brandLink = slide.querySelector(".corp-secondary-button a");
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:content_text "));
      if (brandLink) {
        const a = document.createElement("a");
        a.href = brandLink.href || "";
        a.textContent = brandLink.textContent.trim();
        textFrag.appendChild(a);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-brands", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse4(element, { document }) {
    const newsItems = element.querySelectorAll(".corp-news-widget .corp-news");
    const cells = [];
    newsItems.forEach((item) => {
      const img = item.querySelector(".news-thumb img.corp-image, .news-thumb picture img");
      const imageFrag = document.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document.createComment(" field:image "));
        const pic = document.createElement("picture");
        const newImg = document.createElement("img");
        newImg.src = img.src || "";
        newImg.alt = img.alt || "";
        pic.appendChild(newImg);
        imageFrag.appendChild(pic);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const titleLink = item.querySelector(".news-copy-title a");
      if (titleLink) {
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = titleLink.href || "";
        a.textContent = titleLink.textContent.trim();
        h3.appendChild(a);
        textFrag.appendChild(h3);
      }
      const dateEl = item.querySelector(".news-copy-publish");
      if (dateEl) {
        const p = document.createElement("p");
        p.textContent = dateEl.textContent.trim();
        textFrag.appendChild(p);
      }
      const downloadLink = item.querySelector(".news-download a");
      if (downloadLink) {
        const a = document.createElement("a");
        a.href = downloadLink.href || "";
        a.textContent = "Download";
        textFrag.appendChild(a);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ralphlauren-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#usntA40Toggle",
        "#search-flyout"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "#footer",
        "nav#navigation",
        ".mobile-nav-blue-bar",
        ".home-page-rlmag",
        "#live-error-messages",
        "noscript",
        "link",
        "iframe"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
      });
    }
  }

  // tools/importer/transformers/ralphlauren-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
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
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { el, section } = sectionElements[i];
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          el.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          el.before(hr);
        }
      }
    }
  }

  // tools/importer/import-corporate-homepage.js
  var parsers = {
    "hero-video": parse,
    "hero-overlay": parse2,
    "carousel-brands": parse3,
    "cards-news": parse4
  };
  var PAGE_TEMPLATE = {
    name: "corporate-homepage",
    description: "Ralph Lauren corporate homepage with company overview, news, and investor information",
    urls: [
      "https://corporate.ralphlauren.com/"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: ["div.hero"]
      },
      {
        name: "hero-overlay",
        instances: [
          "div.cid_homepage-company-bucket section.img-link",
          "div.cid_homepage-careers-bucket section.img-link",
          "div.cid_homepage-citizenship-bucket section.img-link",
          "div.cid_homepage-investors-bucket section.img-link"
        ]
      },
      {
        name: "carousel-brands",
        instances: ["div.cid_homepage-brands-carousel section.fullbleed"]
      },
      {
        name: "cards-news",
        instances: ["div.corp-news-hp"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "div.hero",
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Our Company",
        selector: "div.cid_homepage-company-bucket",
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Brands",
        selector: "div.cid_homepage-brands-carousel",
        style: null,
        blocks: ["carousel-brands"],
        defaultContent: ["h2.section-header"]
      },
      {
        id: "section-4",
        name: "Careers",
        selector: "div.cid_homepage-careers-bucket",
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Citizenship and Sustainability",
        selector: "div.cid_homepage-citizenship-bucket",
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Investor Relations",
        selector: "div.cid_homepage-investors-bucket",
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Latest From RL Newsroom",
        selector: "div.home-page-news",
        style: null,
        blocks: ["cards-news"],
        defaultContent: ["h2.widget-title", "div.corp-news-more-btn"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_corporate_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_corporate_homepage_exports);
})();
