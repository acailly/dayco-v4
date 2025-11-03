/** @typedef {URLSearchParams} UserAnswers */

/**
 * Custom user answers that enable IDE autocompletion
 *
 * @template {string} T
 * @typedef {UserAnswers & {get(name: T): string | null; getAll(name: T): string[];has(name: T, value?: string): boolean;set(name: T, value: string): void;delete(name: T, value?: string): void;append(name: T, value: string): void;}} CustomUserAnswers<T>
 * */

import MutableListenableData from '../../shared/listenable-data/listenableData.mjs'

/**
 * @template {string} T
 * @typedef {object} CustomChoiceOption<T>
 * @property {string} value
 * @property {string} label
 * @property {string} [url]
 * @property {string[]} [tags]
 * @property {boolean} [selectedByDefault]
 * @property {(userAnswers: UserAnswers) => Promise<void>} [execute]
 * @property {(userAnswers: UserAnswers) => Promise<void>} [updateUserAnswers]
 * @property {T} [goto]
 * */

/**
 * @typedef {CustomChoiceOption<string>} ChoiceOption
 * */

/**
 * @template {string} T
 * @typedef {object} CustomChoiceDefinition<T>
 * @property {string} [staticTitle]
 * @property {(userAnswers: UserAnswers) => Promise<string>} [dynamicTitle]
 * @property {string} [staticContent]
 * @property {(userAnswers: UserAnswers) => Promise<string>} [dynamicContent]
 * @property {string} [staticForm]
 * @property {(userAnswers: UserAnswers) => Promise<string>} [dynamicForm]
 * @property {CustomChoiceOption<T>[]} [staticOptions]
 * @property {(userAnswers: UserAnswers) => Promise<CustomChoiceOption<T>[]>} [dynamicOptions]
 * @property {boolean} [rememberOptions]
 * */

/**
 * @typedef {CustomChoiceDefinition<string>} ChoiceDefinition
 * */

/**
 * @template {string} T
 * @typedef {object} CustomChoiceDefinitionRegistry<T>
 * @property {string} title
 * @property {string} start
 * @property {Record<T,CustomChoiceDefinition<T>>} definitions
 * */

/**
 * @typedef {CustomChoiceDefinitionRegistry<string>} ChoiceDefinitionRegistry
 * */

/**
 * @typedef {object} ChoiceProps
 * @property {string} choiceID
 * @property {ChoiceOption[]} [options]
 * @property {string} [userAnswer]
 * */
/** @typedef {ChoiceDefinition & ChoiceProps} Choice */

/**
 * @typedef {object} ChoicesFromAnswers
 * @property {Choice[]} choices
 * @property {UserAnswers} updatedUserAnswers
 * */

/**
 * @typedef {Record<string, string | string[]>} SubmittedFormValues
 * */

/**
 * @template T
 * @typedef {import('../../shared/listenable-data/listenableData.mjs').ListenableData<T>} ListenableData<T>
 */

export const FORM_SUMIT_OPTION_VALUE = '_FORM_SUBMIT_'
export const NOOP_OPTION_VALUE = '_NO_OP_'

export class UserChoices {
  // TODO ACY empecher la modification de l'extérieur
  /** @type {UserAnswers} */
  userAnswers = new URLSearchParams()

  // TODO ACY empecher la modification de l'extérieur
  /** @type {Choice[]} */
  choices = []

  _changed = new MutableListenableData(/** @type {Choice[]} */ ([]))
  $changed = this._changed.asReadonly()

  /**
   * @param {ChoiceDefinitionRegistry} choiceDefinitionRegistry
   */
  initialize = async (choiceDefinitionRegistry) => {
    this.choiceDefinitionRegistry = choiceDefinitionRegistry
    this.userAnswers = new URLSearchParams()
    await this.processUserAnswers()
  }

  /**
   * @param {string} choiceID
   * @param {string} userAnswer
   * @param {SubmittedFormValues} [submittedFormValues]
   */
  answer = async (choiceID, userAnswer, submittedFormValues) => {
    this.userAnswers = this.cloneUserAnswers(this.userAnswers)
    this.userAnswers.set(choiceID, userAnswer)
    if (submittedFormValues) {
      for (const [key, value] of Object.entries(submittedFormValues)) {
        const userAnswerKey = `${choiceID}.${key}`
        if (Array.isArray(value)) {
          for (const arrayValue of value) {
            this.userAnswers.set(userAnswerKey, arrayValue)
          }
        } else {
          this.userAnswers.set(userAnswerKey, value)
        }
      }
    }

    // Process the choice answer
    this.choices = await this.processUserAnswer(choiceID, this.choices, this.choices, true)

    // Process again from start to refresh options that need to be refreshed
    await this.processUserAnswers()
  }

  processUserAnswers = async () => {
    if (!this.choiceDefinitionRegistry) {
      throw new Error('UserChoices has not been initialized with a ChoiceDefinitionRegistry')
    }

    this.choices = await this.processUserAnswer(this.choiceDefinitionRegistry.start, [], this.choices, false)
    this._changed.set(this.choices)
  }

  /**
   * @param {string} currentChoiceID
   * @param {Choice[]} currentChoices
   * @param {Choice[]} previousChoices
   * @param {boolean} executeSideEffects
   * @returns {Promise<Choice[]>}
   */
  processUserAnswer = async (currentChoiceID, currentChoices, previousChoices, executeSideEffects) => {
    if (!this.choiceDefinitionRegistry) {
      throw new Error('UserChoices has not been initialized with a ChoiceDefinitionRegistry')
    }

    let choices = [...currentChoices]

    //////////////////////////
    // WHAT IS THE CHOICE? //
    //////////////////////////

    // Get the current choice definition
    const currentChoiceDefinition = this.choiceDefinitionRegistry.definitions[currentChoiceID]

    if (!currentChoiceDefinition) {
      throw new Error(`no choice definition for ID "${currentChoiceID}"`)
    }

    // Find the corresponding previous choice
    const previousCurrentChoice = previousChoices.find((previousChoice) => previousChoice.choiceID === currentChoiceID)

    ////////////////////////////
    // WHAT ARE THE OPTIONS? //
    ////////////////////////////

    // Compute the options
    let currentChoiceOptions = /** @type {ChoiceOption[]} */ ([])
    if (previousCurrentChoice && currentChoiceDefinition.rememberOptions && previousCurrentChoice.options) {
      // If we can use past options, we do it
      currentChoiceOptions = [...previousCurrentChoice.options]
    } else {
      // else, recompute the options
      if (currentChoiceDefinition.staticOptions) {
        currentChoiceOptions.push(...currentChoiceDefinition.staticOptions)
      }
      if (currentChoiceDefinition.dynamicOptions) {
        const currentChoiceDynamicOptions = await currentChoiceDefinition.dynamicOptions(this.userAnswers)
        currentChoiceOptions.push(...currentChoiceDynamicOptions)
      }
    }

    ///////////////////////////
    // WHAT IS THE ANSWER? //
    ///////////////////////////

    // Select the default option if it exists and if no user answer has been given yet
    const defaultChoiceOption = this.userAnswers.get(currentChoiceID)
      ? null
      : currentChoiceOptions?.find((option) => option.selectedByDefault)
    if (defaultChoiceOption) {
      this.userAnswers.set(currentChoiceID, defaultChoiceOption.value)
    }

    /////////////////////////
    // MAKE THE NEW CHOICE //
    /////////////////////////

    /** @type {Choice} */
    const currentChoice = {
      ...currentChoiceDefinition,
      choiceID: currentChoiceID,
      options: currentChoiceOptions,
      userAnswer: this.userAnswers.get(currentChoiceID) ?? undefined,
    }
    choices.push(currentChoice)

    //////////////////
    // WHAT'S NEXT? //
    //////////////////

    if (currentChoice.userAnswer) {
      let selectedChoiceOption =
        // Option from value (first attempt)
        currentChoiceOptions.find(
          (currentChoiceOption) =>
            currentChoiceOption.value === currentChoice.userAnswer &&
            currentChoiceOption.value !== FORM_SUMIT_OPTION_VALUE
        ) ??
        // or form submit option (second attempt)
        currentChoiceOptions.find((currentChoiceOption) => currentChoiceOption.value === FORM_SUMIT_OPTION_VALUE)

      if (selectedChoiceOption) {
        ///////////////////////////////////////
        // APPLY THE SELECTED OPTION EFFECTS //
        ///////////////////////////////////////

        if (executeSideEffects && selectedChoiceOption.execute) {
          // TODO ACY gérer l'erreur :
          // - ne pas appliquer le goto
          // - afficher un message d'erreur
          await selectedChoiceOption.execute(this.userAnswers)
        }

        if (executeSideEffects && selectedChoiceOption.updateUserAnswers) {
          // TODO ACY gérer l'erreur :
          // - ne pas appliquer le goto
          // - afficher un message d'erreur
          const newUserAnswers = this.cloneUserAnswers(this.userAnswers)
          await selectedChoiceOption.updateUserAnswers(newUserAnswers)
          this.userAnswers = newUserAnswers
        }

        /////////////////////////////////
        // NAVIGATE TO THE NEXT CHOICE //
        /////////////////////////////////

        if (selectedChoiceOption.goto) {
          const alreadyAnsweredChoiceIndex = choices.findIndex(
            (choice) => choice.choiceID === selectedChoiceOption.goto
          )
          if (alreadyAnsweredChoiceIndex >= 0) {
            // Remove already answered choice and choices after
            const deletedChoices = choices.splice(alreadyAnsweredChoiceIndex)

            // ... and remove associated user answers if they are not used in non-deleted choices
            this.deleteAnswer(selectedChoiceOption.goto)
            deletedChoices.forEach((deletedChoice) => {
              const isOutdatedAnswer = choices.every((choice) => choice.choiceID !== deletedChoice.choiceID)
              if (isOutdatedAnswer) {
                this.deleteAnswer(deletedChoice.choiceID)
              }
            })
          }

          return await this.processUserAnswer(selectedChoiceOption.goto, choices, previousChoices, executeSideEffects)
        }
      }
    }

    return choices
  }

  /**
   * @param {string} choiceID
   */
  deleteAnswer(choiceID) {
    this.userAnswers.delete(choiceID)

    // Delete submitted form values
    const userAnswerKeyPrefix = `${choiceID}.`
    const submittedFormValuesAnswerKeys = Array.from(this.userAnswers.entries())
      .filter(([key]) => key.startsWith(userAnswerKeyPrefix))
      .map(([key]) => key)
    for (const key of submittedFormValuesAnswerKeys) {
      this.userAnswers.delete(key)
    }
  }

  /**
   * @param {UserAnswers} userAnswers
   * @returns {UserAnswers}
   */
  cloneUserAnswers(userAnswers) {
    return new URLSearchParams(Array.from(userAnswers.entries()))
  }

  /**
   * Inspired by https://www.baldurbjarnason.com/coding/serialising-formdata/
   *
   * @param {FormData} formData
   * @returns {Promise<SubmittedFormValues>}
   */
  async formDataToSubmittedFormValues(formData) {
    /** @type {Record<string, string | string[]>} */
    const result = {}

    // @ts-ignore I don't understand why, but Typescript doesn't find all the FormData interface (see https://developer.mozilla.org/en-US/docs/Web/API/FormData)
    for (const [key, value] of formData) {
      // Handle multiple values
      if (result[key]) {
        result[key] = /** @type {string[]} */ ([]).concat(result[key], value.toString())
        continue
      }

      // Handle blob values
      if (value instanceof Blob) {
        result[key] = await value.text()
        continue
      }

      // Handle single values
      result[key] = value.toString()
    }

    return result
  }
}
