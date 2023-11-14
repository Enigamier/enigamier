import { DogePongGame } from '@/games/DogePong'

import './index.css'

const appElement = document.querySelector<HTMLDivElement>('#app')
const games: Record<string, (canvasId: string) => void> = { dogepong: DogePongGame }

function updateAppContent(content: string) {
  if (appElement) {
    appElement.innerHTML = content
  }
}

function gameView(gameId: string) {
  updateAppContent(`
    <main class="">
      <button id="back-button" class="button">Back</button>
      <div>
        <canvas id="game-canvas" class="game-canvas" width="1200" height="700"></canvas>
      </div>
    </main>
  `)
  const canvas: null | HTMLCanvasElement = document.querySelector('#game-canvas')
  const game = games[gameId]

  document.querySelector('#back-button')?.addEventListener('click', homeView)
  canvas && game('game-canvas')
}

function homeView() {
  updateAppContent(`
    <main class="">
      <button class="button" data-game-id="dogepong">DogePong</button>
    </main>
  `)
  appElement?.querySelectorAll('button[data-game-id]').forEach(button => {
    button.addEventListener('click', () => {
      const gameId = button.getAttribute('data-game-id')
      gameId && gameView(gameId)
    })
  })
}

homeView()
