import { setupCounter } from '.'

describe('counter', () => {
  it('shold do somethiing', () => {
    const button = document.createElement('button')
    setupCounter(button)
    expect(button.innerHTML).toBe('count is 0')
    button.click()
    expect(button.innerHTML).toBe('count is 1')
  })
})
