// In browser, use a CORS proxy
// From https://github.com/draftbit/twitter-lite/issues/41#issuecomment-467403918
const corsProxyURL = 'https://acailly-cors-anywhere.onrender.com/'
// THOUGHT Why feedburner doesn't work ?
// for example : https://acailly-cors-anywhere.onrender.com/https://feeds2.feedburner.com/NoTechMagazine

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
export const fetchContent = (url) => {
  return fetch(`${corsProxyURL}${url}`).then((response) => {
    if (response.ok) {
      return response.text()
    }
    throw new Error(response.status + '' + response.statusText)
  })
}
