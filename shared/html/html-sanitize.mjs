import DOMPurify from '../../vendors/dom-purify/purify.es.mjs'

const DOM_PURIFY_CONFIG = {
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
 * @param {string} text
 * @returns {string}
 */
function sanitize(text) {
  return DOMPurify.sanitize(text, DOM_PURIFY_CONFIG)
}

export default sanitize
