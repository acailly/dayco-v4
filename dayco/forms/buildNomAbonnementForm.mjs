import html from '../../shared/html/html-tag.mjs'

/**
 * @returns {Promise<string>}
 */
export const buildNomAbonnementForm = async () => {
  return html`<input name="nom" type="text" required />`
}
