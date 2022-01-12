export const clickedPlusAdjacent = clickedId => {
  const idsToToggle = [clickedId]
  // values of id's that don't require left check
  const idsNotRequiringRightCheck = [1, 6, 11, 16, 21]
  // check below
  clickedId > 5 ? idsToToggle.push(clickedId - 5) : null
  // check above
  clickedId < 21 ? idsToToggle.push(clickedId + 5) : null
  // check right
  clickedId % 5 != 0 ? idsToToggle.push(clickedId + 1) : null
  // check left
  idsNotRequiringRightCheck.includes(clickedId)
    ? null
    : idsToToggle.push(clickedId - 1)

  return idsToToggle
}

export const alertMessage = status => {
  return (time) => {
    return (elem) => {
      return (message) => {
        // displays message in UI
        elem.innerHTML = message
        elem.classList.add(`alert-${status}`)
        elem.style.left = `calc(50vw - ${elem.clientWidth / 2}px)`
        // after set time, removes message from UI
        setTimeout(function() {
          elem.innerHTML = ''
          elem.classList.remove(`alert-${status}`)
        }, time)
      }
    }
  }
}
