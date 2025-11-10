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

/**
 * @typedef {object} Talk
 *
 * @property {string} id
 * @property {string} name
 * @property {string?} description
 * @property {string} speakers
 * @property {string} format
 * @property {string} venue
 * @property {string} venue_id
 * @property {string} event_start
 * @property {string} event_end
 * @property {string} event_type
 * @property {string?} video_url
 * @property {string?} files_url
 * @property {string?} slides_url
 * @property {string?} level
 */
