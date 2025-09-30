/** @typedef {{[x: string]: string}} UserAnswers */

import MutableListenableData from '../shared/listenable-data/listenableData.mjs'

/**
 * @typedef {object} ChoiceOption
 * @property {string} value
 * @property {string} label
 * @property {string} [url]
 * @property {string[]} [tags]
 * @property {boolean} [selectedByDefault]
 * @property {(userAnswers: UserAnswers) => Promise<void>} [execute]
 * @property {(userAnswers: UserAnswers) => Promise<UserAnswers>} [updateUserAnswers]
 * @property {string} [goto]
 * */

/**
 * @typedef {object} ChoiceDefinition
 * @property {string} choiceType
 * @property {string} [prompt]
 * @property {Record<string, any>} [extra]
 * @property {ChoiceOption[]} [staticOptions]
 * @property {(userAnswers: UserAnswers) => Promise<ChoiceOption[]>} [dynamicOptions]
 * @property {boolean} [rememberOptions]
 * */

/**
 * @typedef {object} ChoiceDefinitionRegistry
 * @property {string} start
 * @property {Record<string,ChoiceDefinition>} definitions
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
 * @template T
 * @typedef {import('../shared/listenable-data/listenableData.mjs').ListenableData<T>} ListenableData<T>
 */

export const WILDCARD_OPTION_VALUE = '*'

export class UserChoices {
  // TODO ACY empecher la modification de l'extérieur
  /** @type {UserAnswers} */
  userAnswers = {}

  // TODO ACY empecher la modification de l'extérieur
  /** @type {Choice[]} */
  choices = []

  _changed = new MutableListenableData(/** @type {Choice[]} */ ([]))
  $changed = this._changed.asReadonly()

  /**
   * @param {ChoiceDefinitionRegistry} choiceDefinitionRegistry
   */
  constructor(choiceDefinitionRegistry) {
    this.choiceDefinitionRegistry = choiceDefinitionRegistry
  }

  /**
   * @param {UserAnswers} userAnswers
   */
  initialize = async (userAnswers) => {
    this.userAnswers = userAnswers
    await this.processUserAnswers()
  }

  /**
   *
   * @param {string} choiceID
   * @param {string} userAnswer
   */
  answer = async (choiceID, userAnswer) => {
    this.userAnswers = { ...this.userAnswers, [choiceID]: userAnswer }

    // Process the choice answer
    this.choices = await this.processUserAnswer(choiceID, this.choices, this.choices, true)

    // Process again from start to refresh options that need to be refreshed
    await this.processUserAnswers()
  }

  processUserAnswers = async () => {
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
    const defaultChoiceOption = this.userAnswers[currentChoiceID]
      ? null
      : currentChoiceOptions?.find((option) => option.selectedByDefault)
    if (defaultChoiceOption) {
      this.userAnswers[currentChoiceID] = defaultChoiceOption.value
    }

    /////////////////////////
    // MAKE THE NEW CHOICE //
    /////////////////////////

    /** @type {Choice} */
    const currentChoice = {
      ...currentChoiceDefinition,
      choiceID: currentChoiceID,
      options: currentChoiceOptions,
      userAnswer: this.userAnswers[currentChoiceID],
    }
    choices.push(currentChoice)

    //////////////////
    // WHAT'S NEXT? //
    //////////////////

    if (currentChoice.userAnswer) {
      const selectedChoiceOption = currentChoiceOptions.find(
        (currentChoiceOption) =>
          currentChoiceOption.value === currentChoice.userAnswer || currentChoiceOption.value === WILDCARD_OPTION_VALUE
      )
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
          const newUserAnswers = await selectedChoiceOption.updateUserAnswers(this.userAnswers)
          if (newUserAnswers) {
            this.userAnswers = newUserAnswers
          }
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
            delete this.userAnswers[selectedChoiceOption.goto]
            deletedChoices.forEach((deletedChoice) => {
              const isOutdatedAnswer = choices.every((choice) => choice.choiceID !== deletedChoice.choiceID)
              if (isOutdatedAnswer) {
                delete this.userAnswers[deletedChoice.choiceID]
              }
            })
          }

          return await this.processUserAnswer(selectedChoiceOption.goto, choices, previousChoices, executeSideEffects)
        }
      }
    }

    return choices
  }
}
