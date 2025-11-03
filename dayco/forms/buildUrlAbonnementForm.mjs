import html from '../../shared/html/html-tag.mjs'

/**
 * @returns {Promise<string>}
 */
export const buildUrlAbonnementForm = async () => {
  return html`<input name="url" type="text" required />`
}
