import { describe, it, expect } from 'vitest'

describe('App', () => {
  it('should be defined', () => {
    expect(true).toBe(true)
  })

  it('should pass basic test', () => {
    const result = 2 + 2
    expect(result).toBe(4)
  })
})