/**
 * @typedef {import('../engine/user-choices.mjs').Choice} Choice
 * @typedef {import('../engine/user-choices.mjs').ChoiceOption} ChoiceOption
 */

import { HTML_ACTION_EVENT, htmlAction } from '../../shared/html-action/html-action.mjs'
import html from '../../shared/html/html-tag.mjs'
import spinner from '../../shared/spinner/spinner.mjs'
import { getUserChoices } from '../globals/user-choices.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('option-list', this)
  }

  userChoices = getUserChoices()

  currentExecutingOption = null

  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = ''

    const choiceID = this.getAttribute('choice-id')
    const choice = this.userChoices.choices.find((choice) => choice.choiceID === choiceID)
    if (!choice) {
      return
    }

    const options = choice.options?.filter((option) => option.value !== '*')

    // Render chips
    const chipOptions = options?.filter((option) => option.tags?.includes('chip')) ?? []
    if (chipOptions.length) {
      this.innerHTML += html`
        <nav>
          ${chipOptions
            .map(
              (option) => html`
                <button
                  type="button"
                  class="${this.userChoices.userAnswers[choice.choiceID] === option.value ? ' selected' : ''}"
                  onclick="${htmlAction(this).answerQuestion(choice.choiceID, option.value)}"
                >
                  ${option.label} ${this.currentExecutingOption === option.value ? spinner : ''}
                </button>
              `
            )
            .join('\n')}
        </nav>
      `
    }

    // Render list items
    const listItemOptions = options?.filter((option) => option.tags?.includes('list-item')) ?? []
    if (listItemOptions.length) {
      const previewItemCount = 5
      const selectedListItemIndex = listItemOptions.findIndex(
        (listItemOption) => this.userChoices.userAnswers[choice.choiceID] === listItemOption.value
      )
      let firstListItemOptions = listItemOptions.slice(0, previewItemCount)
      let lastListItemOptions = listItemOptions.slice(previewItemCount)

      // Show the selected item in the preview section
      if (selectedListItemIndex >= previewItemCount) {
        const selectedListItem = listItemOptions[selectedListItemIndex]
        firstListItemOptions.push(selectedListItem)
        lastListItemOptions.splice(selectedListItemIndex - previewItemCount, 1)
      }

      this.innerHTML += html`
        <ul>
          ${firstListItemOptions.map((option) => this.renderListItem(choice, option)).join('\n') ?? ''}
        </ul>
        ${lastListItemOptions.length > 1
          ? html`
              <details>
                <summary>voir plus (${lastListItemOptions.length})</summary>
                <ul>
                  ${lastListItemOptions.map((option) => this.renderListItem(choice, option)).join('\n') ?? ''}
                </ul>
              </details>
            `
          : ''}
      `
    }
  }

  renderListItem = (/** @type {Choice} */ choice, /** @type {ChoiceOption} */ option) => {
    return html`
      <li
        class="${this.userChoices.userAnswers[choice.choiceID] === option.value ? ' selected' : ''}"
        onclick="${htmlAction(this).answerQuestion(choice.choiceID, option.value)}"
      >
        <span>${option.label} ${this.currentExecutingOption === option.value ? spinner : ''}</span>
        ${option.url
          ? html`
              <a
                onclick="${htmlAction(this).stopPropagation(HTML_ACTION_EVENT)}"
                target="_blank"
                rel="noopener noreferrer"
                href="${option.url}"
                class="light-text"
                >${option.url} ↗
              </a>
            `
          : ''}
      </li>
    `
  }

  answerQuestion = async (/** @type {any} */ choiceID, /** @type {any} */ userAnswer) => {
    this.currentExecutingOption = userAnswer
    this.render()

    await this.userChoices.answer(choiceID, userAnswer)

    this.currentExecutingOption = null
    this.render()
  }

  stopPropagation = (/** @type {Event} */ event) => {
    event.stopPropagation()
  }
}
