const formatter = new Intl.DateTimeFormat('fr-FR', {
  hour: 'numeric',
  minute: 'numeric',
})

/**
 * @param {string} horaire
 * @return {string}
 */
export const formatHoraire = (horaire) => {
  const date = new Date(horaire)
  return formatter.format(date)
}
