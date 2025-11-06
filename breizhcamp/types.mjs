/**
 * @template {string} T
 * @typedef {import('../framework/engine/user-choices.mjs').CustomChoiceDefinitionRegistry<T>} CustomChoiceDefinitionRegistry<T>
 */

/**
 * @template {string} T
 * @typedef {import('../framework/engine/user-choices.mjs').CustomChoiceOption<T>} CustomChoiceOption<T>
 */

/**
 * @template {string} T
 * @typedef {import('../framework/engine/user-choices.mjs').CustomUserAnswers<T>} CustomUserAnswers<T>
 */

/** @typedef {'jour' | 'heure' | 'talks' | 'talk' } BreizhCampChoice */
/** @typedef {CustomChoiceOption<BreizhCampChoice>} BreizhCampChoiceOption */
/** @typedef {CustomChoiceDefinitionRegistry<BreizhCampChoice>} BreizhCampChoiceRegistry */
/** @typedef {CustomUserAnswers<BreizhCampChoice>} BreizhCampUserAnswers */

export const MERCREDI = 'MERCREDI'
export const JEUDI = 'JEUDI'
export const VENDREDI = 'VENDREDI'
/** @typedef {typeof MERCREDI | typeof JEUDI | typeof VENDREDI} Jour */
