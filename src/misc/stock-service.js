export let price = _symbol => {
  throw new Error('the system is down!')
}
export const injectPriceStub = stub => price = stub