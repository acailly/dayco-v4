import { getFeedsFetcher } from '../../main.mjs'
import html from '../../../shared/html/html-tag.mjs'
import spinner from '../../../shared/spinner/spinner.mjs'

/** @typedef {import("../types.mjs").Feed} Feed  */
/** @typedef {import('../feed-fetcher/feedFetcher.mjs').FetchStatus} FetchStatus */

export default class extends HTMLElement {
  static {
    customElements.define('fetch-list-item', this)
  }

  feedsFetcher = getFeedsFetcher()

  connectedCallback() {
    const id = this.getAttribute('id')

    if (!id) {
      return
    }

    const $fetchStatus = this.feedsFetcher.$fetchStatuses.get().find((fetchStatus) => {
      return fetchStatus.get().feed.id === id
    })

    if (!$fetchStatus) {
      return
    }

    this.render($fetchStatus.get())
    $fetchStatus.onChange(({ currentValue: fetchStatus }) => {
      this.render(fetchStatus)
    })
  }

  /**
   * @param {FetchStatus} fetchStatus
   */
  render(fetchStatus) {
    switch (fetchStatus.type) {
      case 'SUCCESS': {
        this.innerHTML = html` <li>
          <span>${fetchStatus.feed.title} ✅</span>
        </li>`
        break
      }
      case 'ERROR': {
        this.innerHTML = html`
          <li>
            <span>${fetchStatus.feed.title} ❌</span>
            <small>
              <details>
                <summary>Plus de détails sur l'erreur</summary>
                <a target="_blank" rel="noopener noreferrer" href="${fetchStatus.feed.url}"
                  >${fetchStatus.feed.url} ↗</a
                >
                <pre>${fetchStatus.error}</pre>
              </details>
            </small>
          </li>
        `
        break
      }
      case 'LOADING':
      default: {
        this.innerHTML = html`<li>
          <span> ${fetchStatus.feed.title} ${spinner}</span>
        </li>`
      }
    }
  }
}
