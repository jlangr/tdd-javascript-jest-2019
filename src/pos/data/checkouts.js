import IncrementingIdGenerator from '../data/incrementing-id-generator'

const checkouts = {}

export const retrieve = id => checkouts[id]

export const insert = checkout => checkouts[checkout.id] = {...checkout}

export const createNew = () => {
  const checkout = { id: IncrementingIdGenerator.id(), items: [] }
  insert(checkout)
  return checkout
}

export const updateCheckout = (checkoutId, checkout) =>
  checkouts[checkoutId] = {...checkout}

export const deleteAll = () => {
  for (let member in checkouts)
    delete checkouts[member]
}

export const retrieveAll = () => Object.values(checkouts)

export const addItem = (checkout, itemDetails) => {
  const newCheckoutItem = { id: IncrementingIdGenerator.id() }
  Object.assign(newCheckoutItem, itemDetails)
  checkout.items.push(newCheckoutItem)
  return newCheckoutItem
}
