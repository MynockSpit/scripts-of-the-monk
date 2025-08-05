/**
 * To use these helpers, you must add the following entries to your user script:
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @require      https://raw.githubusercontent.com/MynockSpit/scripts-of-the-monk/refs/heads/master/utilities/register-command.js
 */

const registerCommand = (function () {
  return async function (
    optionName,
    possibleStatesOrRunFunction,
    maybeRunFunction,
  ) {
    let runFunction
    let possibleStates = ["on", "off"]
    if (typeof possibleStatesOrRunFunction === 'function') {
      runFunction = possibleStatesOrRunFunction
    } else {
      possibleStates = possibleStatesOrRunFunction
      runFunction = maybeRunFunction
    }

    let optionKey = `Option(${optionName})`
    let optionStateIndex = await GM.getValue(optionKey, 0)
    let optionState = possibleStates[optionStateIndex] || possibleStates[0]

    runFunction(optionState)

    let commandName = `[${optionState}] ${optionName}`
    GM.registerMenuCommand(commandName, async function () {
      // if we ever allow toggles without reloads, we'll need to unregister
      // GM.unregisterMenuCommand(commandName)
      let nextOptionStateIndex = optionStateIndex >= (possibleStates.length - 1) ? 0 : optionStateIndex + 1
      GM.setValue(optionKey, nextOptionStateIndex)
      window.location.reload()
    })
  }
}());