/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Ralph Lauren Corporate cleanup.
 * Selectors from captured DOM of https://corporate.ralphlauren.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/consent banners (found: div#onetrust-consent-sdk)
    // Remove accessibility toggle (found: div#usntA40Toggle)
    // Remove search flyout (found: div#search-flyout)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#usntA40Toggle',
      '#search-flyout',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable content: header, footer, nav
    // Found: header with class header-sticky, div#footer with footer element
    // Found: nav#navigation, div.mobile-nav-blue-bar
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '#footer',
      'nav#navigation',
      '.mobile-nav-blue-bar',
      '.home-page-rlmag',
      '#live-error-messages',
      'noscript',
      'link',
      'iframe',
    ]);

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
    });
  }
}
