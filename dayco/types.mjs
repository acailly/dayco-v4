// TODO ACY si on mettait ca dans un .d.ts et que ca marchait pareil, est ce que ce ne serait pas un gap un peu moins dur à franchir par les non habitués ?

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

/** @typedef {'header' | 'nouveautesParAbonnement' | 'nouveautesDeAbonnement' | 'nouveaute' | 'abonnements' | 'abonnement' | 'nomNouvelAbonnement' | 'urlNouvelAbonnement' | 'sauvegarde' | 'importerAbonnements' | 'recupererNouveautes'} DaycoChoice */
/** @typedef {CustomChoiceOption<DaycoChoice>} DaycoChoiceOption */
/** @typedef {CustomChoiceDefinitionRegistry<DaycoChoice>} DaycoChoiceRegistry */
/** @typedef {CustomUserAnswers<DaycoChoice>} DaycoUserAnswers */

/** @typedef {typeof FEED} FEED */
export const FEED = 'FEED'
/** @typedef {typeof POST} POST */
export const POST = 'POST'

/**
 * @typedef {FEED | POST} Type
 */

/**
 * @typedef {Object} Thing
 * @property {Type} type
 * @property {string} id
 */

/**
 * @typedef {Thing & PostProps} Post
 * @typedef {Object} PostProps
 * @property {POST} type
 * @property {string} title
 * @property {string} url
 * @property {number} timestamp
 * @property {string} feedId
 */

/**@typedef {Omit<Post, 'type' | 'id' | 'feedId'>} PostWithoutFeed */

/**
 * @typedef {Thing & FeedProps} Feed
 * @typedef FeedProps
 * @property {FEED} type
 * @property {string} title
 * @property {string} url
 * @property {number} [lastFetchTimestamp]
 */
