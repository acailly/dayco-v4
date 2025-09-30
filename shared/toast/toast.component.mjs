import html from '../html/html-tag.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('toast-message', this)
  }

  connectedCallback() {
    this.animate(
      {
        bottom: ['-50px', '20px'],
      },
      {
        duration: 200,
      }
    )

    setTimeout(() => {
      this.animate(
        {
          bottom: ['20px', '-50px'],
        },
        {
          duration: 200,
        }
      ).onfinish = () => {
        this.remove()
      }
    }, 2000)
  }
}

/**
 * @param {string} message
 */
export const showToast = (message) => {
  document.body.insertAdjacentHTML('beforeend', html`<toast-message>${message}</toast-message>`)
}
