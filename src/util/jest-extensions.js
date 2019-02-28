expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return pass ?
      ({
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true
      })
      :
      ({
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false
      })
  }
})