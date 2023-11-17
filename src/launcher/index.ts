import { DogePongGame } from '@/games/DogePong'

import './index.css'

const games: Record<string, (canvasId: string) => void> = { DogePong: DogePongGame }
const gameButtonsTemplate = Object.keys(games).map(gameId => `
  <button class="button" data-game-id="${gameId}">${gameId}</button>
`)
const launcherElem = launcherView()
const gameContainerElem = launcherElem.querySelector('#game-container')!

function launcherView(): HTMLElement {
  const elem = document.createElement('main')
  elem.innerHTML = `
    <div class="games-selector">
      <button id="back-button" class="button">Back</button>
      ${gameButtonsTemplate}
    </div>
    <div id="game-container" class="game-content"></div>
  `

  const gamesButtonsElems = elem.querySelectorAll('button[data-game-id]')
  gamesButtonsElems.forEach(button => {
    button.addEventListener('click', () => {
      const gameId = button.getAttribute('data-game-id')!
      launchGame(gameId)
      elem.querySelector('button[data-game-id].button--active')?.classList.remove('button--active')
      button.classList.add('button--active')
    })
  })

  elem.querySelector('#back-button')?.addEventListener('click', () => {
    gameContainerElem.innerHTML = ''
    elem.querySelector('button[data-game-id].button--active')?.classList.remove('button--active')
  })

  return elem
}

function launchGame(gameId: string) {
  const canvasId = `game-canvas-${gameId}`
  gameContainerElem.innerHTML = `
    <div class="game-canvas-wrapper">
      <canvas id="${canvasId}" class="game-canvas" width="1200" height="700"></canvas>
    </div>
  `
  games[gameId](canvasId)
}

document.querySelector<HTMLDivElement>('#app')?.appendChild(launcherElem)
