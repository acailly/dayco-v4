import './fetch-list-item.component.mjs'
import html from '../../../shared/html/html-tag.mjs'
import { getFeedsFetcher } from '../../main.mjs'
import compareString from '../../../shared/strings/compareString.mjs'
import '../../components/option-list.component.mjs'

/** @typedef {import("../types.mjs").Feed} Feed  */
/**
 * @template T
 * @typedef {import('../../../shared/listenable-data/listenableData.mjs').ListenableData<T>} ListenableData<T>
 */
/** @typedef {import('../feed-fetcher/feedFetcher.mjs').FetchStatus} FetchStatus */

export default class extends HTMLElement {
  static {
    customElements.define('fetch-list', this)
  }

  feedsFetcher = getFeedsFetcher()

  connectedCallback() {
    this.render(this.feedsFetcher.$fetchStatuses.get())
    this.feedsFetcher.$fetchStatuses.onChange(({ currentValue: fetchStatuses }) => {
      this.render(fetchStatuses)
    })
  }

  /**
   * @param {ListenableData<FetchStatus>[]} fetchStatuses
   */
  render(fetchStatuses) {
    const choiceID = this.getAttribute('choice-id')
    this.innerHTML = html` <option-list choice-id="${choiceID}"></option-list>
      <ul>
        ${[...fetchStatuses]
          .sort(($fetchStatusA, $fetchStatusB) => {
            return compareString($fetchStatusA.get().feed.title, $fetchStatusB.get().feed.title)
          })
          .map(($fetchStatus) => html`<fetch-list-item id="${$fetchStatus.get().feed.id}"></fetch-list-item>`)
          .join('\n')}
      </ul>`
  }
}
