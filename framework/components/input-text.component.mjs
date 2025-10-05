import { HTML_ACTION_EVENT, htmlAction } from '../../shared/html-action/html-action.mjs'
import html from '../../shared/html/html-tag.mjs'
import { getUserChoices } from '../globals/user-choices.mjs'
import { WILDCARD_OPTION_VALUE } from '../engine/user-choices.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('input-text', this)
  }

  userChoices = getUserChoices()

  connectedCallback() {
    this.render()
  }

  render() {
    const choiceID = this.getAttribute('choice-id')
    if (!choiceID) {
      // TODO ACY erreur
      this.innerHTML = ''
      return
    }

    const choice = this.userChoices.choices.find((choice) => choice.choiceID === choiceID)
    if (!choice) {
      // TODO ACY erreur
      this.innerHTML = ''
      return
    }

    const wildcardOption = choice.options?.find((option) => option.value === WILDCARD_OPTION_VALUE)
    if (!wildcardOption) {
      // TODO ACY erreur
      this.innerHTML = ''
      return
    }

    this.innerHTML = html`
      <form onsubmit="${htmlAction(this).onSubmit(choiceID, HTML_ACTION_EVENT)}">
        <section>
          <input name="text" type="text" />
          <button type="submit">${wildcardOption.label}</button>
          <i>Current value is: <b>${this.userChoices.userAnswers[choiceID] ?? ''}</b></i>
        </section>
      </form>
      <option-list choice-id="${choiceID}"></<option-list>
    `
  }

  onSubmit = async (/** @type {string} */ choiceID, /** @type {Event} */ event) => {
    event.preventDefault()

    const form = /** @type {HTMLFormElement | null} */ (event.target)
    if (form) {
      const data = new FormData(form)

      const text = data.get('text')?.toString()
      if (text) {
        this.answerQuestion(choiceID, text)
      }
    }
  }

  answerQuestion = async (/** @type {any} */ choiceID, /** @type {string} */ userAnswer) => {
    await this.userChoices.answer(choiceID, userAnswer)
    this.render()
  }
}
