import { FORM_SUMIT_OPTION_VALUE, NOOP_OPTION_VALUE } from '../../framework/engine/user-choices.mjs'
import { HTML_ACTION_EVENT, htmlAction } from '../../shared/html-action/html-action.mjs'
import html from '../../shared/html/html-tag.mjs'
import spinner from '../../shared/spinner/spinner.mjs'
import { getUserChoices } from '../globals/user-choices.mjs'

/**
 * @typedef {import('../../framework/engine/user-choices.mjs').UserAnswers} UserAnswers
 * @typedef {import('../../framework/engine/user-choices.mjs').Choice} Choice
 * @typedef {import('../../framework/engine/user-choices.mjs').ChoiceOption} ChoiceOption
 * @typedef {import('../../framework/engine/user-choices.mjs').ChoicesFromAnswers} ChoicesFromAnswers
 * @typedef {import('../../framework/engine/user-choices.mjs').SubmittedFormValues} SubmittedFormValues
 */

export const CHIP = 'chip'
export const AFTER_TITLE = 'after-title'

/**
 * TODO ACY ICI finir d'implémenter
 *
 * Render each choice in the following format:
 *
 * --------------------
 * TITLE = [/] staticTitle followed by [X] dynamicTitle
 *
 * AFTER TITLE CHIP OPTIONS = [/] options [chip][after-title] from staticOptions/dynamicOptions
 *
 * CONTENT = [/] staticContent followed by [/] dynamicContent
 *
 * FORM = [/] staticForm followed by [X] dynamicForm
 *
 * CHIP OPTIONS = [/] options [chip] from staticOptions/dynamicOptions
 *
 * OPTIONS = [/] list of other options from staticOptions/dynamicOptions
 * --------------------
 */
export default class extends HTMLElement {
  static {
    customElements.define('dynamic-form', this)
  }

  userChoices = getUserChoices()

  async connectedCallback() {
    // TODO ACY memory leak
    this.userChoices.$changed.onChange(this.render)
  }

  render = async () => {
    // TODO ACY rendre le code plus propre
    this.innerHTML = html`
      <h1 id="main-title">${this.userChoices.choiceDefinitionRegistry?.title}</h1>
      ${(
        await Promise.all(
          this.userChoices.choices.map(
            async (choice, choiceIndex) => html`
              <article id="${choice.choiceID}" class="choice-container">
                <header class="choice-header">
                  <h2>${choice.staticTitle ?? ''}</h2>
                  <a
                    class="light-text"
                    href="#${choiceIndex > 0 ? this.userChoices.choices[choiceIndex - 1].choiceID : ''}"
                    >haut ↑</a
                  >
                </header>
                <main>${await this.renderChoice(choice)}</main>
              </article>
            `
          )
        )
      ).join('\n')}

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

  /**
   * @param {Choice} choice
   * @returns {Promise<string>}
   */
  renderChoice = async (choice) => {
    return [
      this.renderAfterTitleChipOptions(choice),
      await this.renderContent(choice),
      this.renderForm(choice),
      this.renderChipOptions(choice),
      this.renderListItemOptions(choice),
    ].join('\n')
  }

  /**
   * @param {Choice} choice
   * @returns {Promise<string>}
   */
  renderContent = async (choice) => {
    const content = []
    if (choice.staticContent) {
      content.push(choice.staticContent)
    }
    const dynamicContent = await choice.dynamicContent?.(this.userChoices.userAnswers)
    if (dynamicContent) {
      content.push(dynamicContent)
    }
    if (content.length) {
      return html` <section class="content">${content.join('\n')}</section> `
    }

    return ''
  }

  /**
   * @param {Choice} choice
   * @returns {string}
   */
  renderForm = (choice) => {
    const form = choice.staticForm
    if (form) {
      const userAnswerKeyPrefix = `${choice.choiceID}.`
      const currentValue = Array.from(this.userChoices.userAnswers.entries())
        .filter(([key]) => key.startsWith(userAnswerKeyPrefix))
        .map(([key, value]) => {
          const keyWithoutPrefix = key.slice(userAnswerKeyPrefix.length)
          if (Array.isArray(value)) {
            return `${keyWithoutPrefix}=${value.join(',')}`
          } else if (value.length > 100) {
            return `${keyWithoutPrefix}=...(too long)...`
          } else {
            return `${keyWithoutPrefix}=${value}`
          }
        })
        .join(' - ')

      return html`
        <section class="form">
          <form
            id="${this.getFormId(choice)}"
            onsubmit="${htmlAction(this).onSubmit(choice.choiceID, HTML_ACTION_EVENT)}"
          >
            ${form}
            <i>Current value is: <b>${currentValue}</b></i>
          </form>
        </section>
      `
    }

    return ''
  }

  /**
   * @param {Choice} choice
   * @returns {string}
   */
  getFormId(choice) {
    return `form-${choice.choiceID}`
  }

  /**
   * @param {string} choiceID
   * @param {Event} event
   */
  onSubmit = async (choiceID, event) => {
    event.preventDefault()

    const form = /** @type {HTMLFormElement | null} */ (event.target)
    if (form) {
      const data = new FormData(form)
      const submittedFormValue = await this.userChoices.formDataToSubmittedFormValues(data)
      this.answerQuestion(choiceID, FORM_SUMIT_OPTION_VALUE, submittedFormValue)
    }
  }

  /**
   * @param {Choice} choice
   * @returns {string}
   */
  renderAfterTitleChipOptions = (choice) => {
    const options = choice.options ?? []
    const afterTitleChipOptions =
      options?.filter((option) => option.tags?.includes(CHIP) && option.tags?.includes(AFTER_TITLE)) ?? []
    if (afterTitleChipOptions.length) {
      return html`
        <section class="options-chips-after-title">
          <nav>${afterTitleChipOptions.map((option) => this.renderChipOption(choice, option)).join('\n')}</nav>
        </section>
      `
    }

    return ''
  }

  /**
   * @param {Choice} choice
   * @returns {string}
   */
  renderChipOptions = (choice) => {
    const options = choice.options ?? []
    const chipOptions =
      options?.filter((option) => option.tags?.includes(CHIP) && !option.tags?.includes(AFTER_TITLE)) ?? []
    if (chipOptions.length) {
      return html`
        <section class="options-chips">
          <nav>${chipOptions.map((option) => this.renderChipOption(choice, option)).join('\n')}</nav>
        </section>
      `
    }

    return ''
  }

  /**
   * @param {Choice} choice
   * @param {ChoiceOption} option
   * @returns {string}
   */
  renderChipOption = (choice, option) => {
    const isSubmitOption = option.value === FORM_SUMIT_OPTION_VALUE
    const buttonType = isSubmitOption ? 'submit' : 'button'
    const buttonForm = isSubmitOption ? html`form="${this.getFormId(choice)}"` : ''
    const onclick = isSubmitOption
      ? ''
      : html`onclick="${htmlAction(this).answerQuestion(choice.choiceID, option.value)}"`
    const currentSelectedOption = this.userChoices.userAnswers.get(choice.choiceID) ?? undefined
    const isSelected = currentSelectedOption === option.value
    const currentExecutingOption = this.currentExecutingOption ?? undefined
    const isExecuting = currentExecutingOption === option.value
    return html`
      <button
        type="${buttonType}"
        ${buttonForm}
        class="${isSelected ? ' selected' : ''}"
        ${onclick}
        ${option.value === NOOP_OPTION_VALUE ? 'disabled' : ''}
      >
        ${option.label} ${isExecuting ? spinner : ''}
      </button>
    `
  }

  /**
   * @param {Choice} choice
   * @returns {string}
   */
  renderListItemOptions = (choice) => {
    const options = choice.options ?? []
    const listItemOptions = options.filter((option) => !option.tags?.includes(CHIP))
    if (listItemOptions.length) {
      const previewItemCount = 5
      const selectedListItemIndex = listItemOptions.findIndex(
        (listItemOption) => this.userChoices.userAnswers.get(choice.choiceID) === listItemOption.value
      )
      let firstListItemOptions = listItemOptions.slice(0, previewItemCount)
      let lastListItemOptions = listItemOptions.slice(previewItemCount)

      // Show the selected item in the preview section
      if (selectedListItemIndex >= previewItemCount) {
        const selectedListItem = listItemOptions[selectedListItemIndex]
        firstListItemOptions.push(selectedListItem)
        lastListItemOptions.splice(selectedListItemIndex - previewItemCount, 1)
      }

      return html`
        <section class="options-list">
          <ul>
            ${firstListItemOptions.map((option) => this.renderListItemOption(choice, option)).join('\n') ?? ''}
          </ul>
          ${lastListItemOptions.length > 1
            ? html`
                <details>
                  <summary>voir plus (${lastListItemOptions.length})</summary>
                  <ul>
                    ${lastListItemOptions.map((option) => this.renderListItemOption(choice, option)).join('\n') ?? ''}
                  </ul>
                </details>
              `
            : ''}
        </section>
      `
    }

    return ''
  }

  /**
   * @param {Choice} choice
   * @param {ChoiceOption} option
   * @returns {string}
   */
  renderListItemOption = (choice, option) => {
    if (option.value === FORM_SUMIT_OPTION_VALUE) {
      // TODO ACY gérer ce cas en s'inspirant de ce qui est fait sur les chip options (j'en ai pas eu besoin jusqu'à maintenant)
      return ''
    }

    const currentSelectedOption = this.userChoices.userAnswers.get(choice.choiceID) ?? undefined
    const isSelected = currentSelectedOption === option.value
    const currentExecutingOption = this.currentExecutingOption ?? undefined
    const isExecuting = currentExecutingOption === option.value
    return html`
      <li
        class="${isSelected ? ' selected' : ''}"
        onclick="${htmlAction(this).answerQuestion(choice.choiceID, option.value)}"
        ${option.value === NOOP_OPTION_VALUE ? 'disabled' : ''}
      >
        <span>${option.label} ${isExecuting ? spinner : ''}</span>
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

  /**
   * @param {string} choiceID
   * @param {string} userAnswer
   * @param {SubmittedFormValues} [submittedFormValues]
   */
  answerQuestion = async (choiceID, userAnswer, submittedFormValues) => {
    if (userAnswer === NOOP_OPTION_VALUE) {
      return
    }

    this.currentExecutingOption = userAnswer
    this.render()

    await this.userChoices.answer(choiceID, userAnswer, submittedFormValues)

    this.currentExecutingOption = null
    this.render()
  }

  stopPropagation = (/** @type {Event} */ event) => {
    event.stopPropagation()
  }
}
