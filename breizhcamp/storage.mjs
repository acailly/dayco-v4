/**
 * @typedef {import('./types.mjs').Talk} Talk
 */

const STORAGE_KEY_FAVORITE_TALKS = 'BREIZHCAMP_FAVORITE_TALKS'

/**
 * @returns {string[]}
 */
const getFavoritTalkIds = () => {
  const rawFavoriteTalks = globalThis.localStorage.getItem(STORAGE_KEY_FAVORITE_TALKS)
  const favoriteTalks = rawFavoriteTalks ? /** @type {string[]}*/ (JSON.parse(rawFavoriteTalks)) : []
  return favoriteTalks
}

/**
 * @param {string} talkId
 * @returns {boolean}
 */
export const isFavoriteTalk = (talkId) => {
  const favoriteTalks = getFavoritTalkIds()
  return favoriteTalks.includes(talkId)
}

/**
 * @param {string} talkId
 */
export const removeFavoriteTalk = (talkId) => {
  const favoriteTalks = getFavoritTalkIds()
  const newFavoriteTalks = favoriteTalks.filter((id) => id !== talkId)
  globalThis.localStorage.setItem(STORAGE_KEY_FAVORITE_TALKS, JSON.stringify(newFavoriteTalks))
}

/**
 * @param {string} talkId
 */
export const addFavoriteTalk = (talkId) => {
  const favoriteTalks = getFavoritTalkIds()
  const newFavoriteTalks = [...favoriteTalks, talkId]
  globalThis.localStorage.setItem(STORAGE_KEY_FAVORITE_TALKS, JSON.stringify(newFavoriteTalks))
}
