import DOMPurify from '../../vendors/dom-purify/purify.es.mjs'

const DOM_PURIFY_CONFIG_HTML = {
  ADD_ATTR: ['onclick', 'onsubmit', 'form'],
  CUSTOM_ELEMENT_HANDLING: {
    tagNameCheck: () => true,
    attributeNameCheck: null,
    allowCustomizedBuiltInElements: false,
  },
}

/**
 * Sanitize HTML content
 *
 * @param {string} content
 * @returns {string}
 */
export function sanitizeHTML(content) {
  return DOMPurify.sanitize(content, DOM_PURIFY_CONFIG_HTML)
}

/**
 * Sanitize text content
 *
 * @param {string} content
 * @returns {string}
 */
export function sanitizeText(content) {
  return DOMPurify.sanitize(content)
}
