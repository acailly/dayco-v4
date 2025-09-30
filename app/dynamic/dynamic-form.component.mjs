import html from '../../shared/html/html-tag.mjs'
import { getUserChoices, getView } from '../main.mjs'

/**
 * @typedef {import('../user-choices.mjs').UserAnswers} UserAnswers
 */

/**
 * @typedef {import('../user-choices.mjs').Choice} Choice
 */

/**
 * @typedef {import('../user-choices.mjs').ChoicesFromAnswers} ChoicesFromAnswers
 */

export default class extends HTMLElement {
  static {
    customElements.define('dynamic-form', this)
  }

  userChoices = getUserChoices()

  async connectedCallback() {
    this.userChoices.$changed.onChange(this.render)
    await this.userChoices.initialize({})
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
