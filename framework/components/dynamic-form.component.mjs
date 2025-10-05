import html from '../../shared/html/html-tag.mjs'
import { getUserChoices } from '../globals/user-choices.mjs'

/**
 * @typedef {import('../../framework/engine/user-choices.mjs').UserAnswers} UserAnswers
 */

/**
 * @typedef {import('../../framework/engine/user-choices.mjs').Choice} Choice
 */

/**
 * @typedef {import('../../framework/engine/user-choices.mjs').ChoicesFromAnswers} ChoicesFromAnswers
 */

/**
 * @typedef {Record<string, (choice: Choice) => string>} ChoiceViewFactory
 */

/** @type {ChoiceViewFactory} */
const __choiceViewFactory = {}

export const registerChoiceViewFactory = (
  /** @type {string} */ choiceType,
  /** @type {(choice: Choice) => string} */ viewFactory
) => {
  __choiceViewFactory[choiceType] = viewFactory
}

// Default views
registerChoiceViewFactory('optionList', (choice) => html`<option-list choice-id="${choice.choiceID}"></<option-list>`)
registerChoiceViewFactory('inputJson', (choice) => html`<input-json choice-id="${choice.choiceID}"></<input-json>`)
registerChoiceViewFactory('inputText', (choice) => html`<input-text choice-id="${choice.choiceID}"></<input-text>`)

const getView = (/** @type {Choice} */ choice) => {
  const customViewFactory = choice.choiceType ? __choiceViewFactory[choice.choiceType] : undefined
  if (customViewFactory) {
    return customViewFactory(choice)
  }

  return html``
}

export default class extends HTMLElement {
  static {
    customElements.define('dynamic-form', this)
  }

  userChoices = getUserChoices()

  async connectedCallback() {
    // TODO ACY memory leak
    this.userChoices.$changed.onChange(this.render)
  }

  render = () => {
    this.innerHTML = html`
      <h1 id="main-title">Dayco v4</h1>
      ${this.userChoices.choices
        .map(
          (choice, choiceIndex) => html`
            <section id="${choice.choiceID}" class="choice-container">
              <header class="choice-header">
                <h2>${choice.prompt ?? ''}</h2>
                <a
                  class="light-text"
                  href="#${choiceIndex > 0 ? this.userChoices.choices[choiceIndex - 1].choiceID : ''}"
                  >haut ↑</a
                >
              </header>
              ${getView(choice)}
            </section>
          `
        )
        .join('\n')}

      <!-- <h2>Debug user answers</h2>
      <pre>${JSON.stringify(this.userChoices.userAnswers, null, 2)}</pre>

      <h2>Debug choices</h2>
      <pre>${JSON.stringify(this.userChoices.choices, null, 2)}</pre> -->
    `

    // scroll to the last choice
    const choiceContainers = document.querySelectorAll('.choice-container')
    if (choiceContainers.length) {
      const lastChoiceContainer = choiceContainers.item(choiceContainers.length - 1)
      lastChoiceContainer.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
