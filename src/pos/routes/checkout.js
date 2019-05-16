import Generator from '../data/id-generator'
import ItemDatabase from '../data/item_database'
import MemberDatabase from '../data/member_database'

const checkouts = {}

const itemDatabase = new ItemDatabase()
const memberDatabase = new MemberDatabase()

export const clearAllCheckouts = (_, __) => {
  for (var member in checkouts) delete checkouts[member]
}

export const getCheckout = (request, response) => {
  const checkout = checkouts[request.params.id]
  return response.send(checkout)
}

export const getCheckouts = (_, response) => {
  return response.send(Object.values(checkouts))
}

export const postCheckout = (_, response) => {
  const newCheckout = { id: Generator.id(), items: [] }
  checkouts[newCheckout.id] = newCheckout
  response.status = 201
  response.send(newCheckout)
}

export const getItems = (request, response) => {
  const id = request.params.id
  const checkout = checkouts[id]
  response.send(checkout.items)
}

export const postMember = (request, response) => {
  const body = request.body
  const member = memberDatabase.retrieve(body.id)
  if (!member) {
    response.status = 400
    response.send({error: 'unrecognized member'})
    return
  }

  const checkoutId = request.params.id

  const checkout = checkouts[checkoutId]
  if (!checkout) {
    response.status = 400
    response.send({error: 'invalid checkout'})
    return
  }
  Object.assign(checkout, member)

  response.status = 200
  response.send(checkouts[checkoutId])
}

export const postItem = (request, response) => {
  const body = request.body
  const checkoutId = request.params.id
  const newCheckoutItem = { id: Generator.id() }
  const item = itemDatabase.retrieve(body.upc)
  if (!item) {
    response.status = 400
    response.send({error: 'unrecognized UPC code'})
    return
  }

  Object.assign(newCheckoutItem, item)

  const checkout = checkouts[checkoutId]
  if (!checkout) {
    response.status = 400
    response.send({error: 'nonexistent checkout'})
    return
  }

  checkout.items.push(newCheckoutItem)

  response.status = 201
  response.send(newCheckoutItem)
}

const pad = (s, length) => s + ' '.repeat(length - s.length)

const LineWidth = 45

const round2 = number => Math.round(number * 100) / 100

const lineItem = (dollarAmount, description) => {
  const formattedTotal = parseFloat(round2(dollarAmount)).toFixed(2)
  const formattedTotalWidth = formattedTotal.length
  const textWidth = LineWidth - formattedTotalWidth
  return pad(description, textWidth) + formattedTotal
}

let memberDiscountPercent = function (checkout) {
  return checkout.member ? checkout.discount : 0
}
let discountedPrice = function (price, checkout) {
  return price * (1.0 - memberDiscountPercent(checkout))
}

const errorResponse = (response, message) => {
  response.status = 400
  response.send({error: message})
}

let successResponse = function (response, responseBody) {
  response.status = 200
  response.send(responseBody)
}

const totalForCheckout = (checkout) => {
  let totalForCheckout = 0
  checkout.items.forEach(item => {
    if (isDiscountable(item, checkout))
      totalForCheckout += discountedPrice(item.price, checkout)
    else
      totalForCheckout += item.price
  })
  return totalForCheckout
}

const isDiscountable = (item, checkout) => !item.exempt && memberDiscountPercent(checkout) > 0

const totalSaved = checkout =>
  discountableItems(checkout).reduce(
    (totalSaved, item) => totalSaved + memberDiscountPercent(checkout) * item.price, 0)

const discountableItems = checkout =>
  checkout.items.filter(item => isDiscountable(item, checkout))

const totalOfDiscountedItems = checkout =>
  discountableItems(checkout).reduce((total, item) =>
    total + discountedPrice(item.price, checkout), 0)

const collectMessages = checkout => {
  const messages = []

  checkout.items.forEach(item => {
    messages.push(lineItem(item.price, item.description))
    if (isDiscountable(item, checkout))
      messages.push(lineItem(-1 * memberDiscountPercent(checkout) * item.price, `   ${memberDiscountPercent(checkout) * 100}% mbr disc`))
  })

  messages.push(lineItem(round2(totalForCheckout(checkout)), 'TOTAL'))
  if (totalSaved(checkout) > 0)
    messages.push(lineItem(totalSaved(checkout), '*** You saved:'))

  return messages
}

export const postCheckoutTotal = (request, response) => {
  const checkoutId = request.params.id
  const checkout = checkouts[checkoutId]
  if (!checkout) {
    errorResponse(response, 'nonexistent checkout')
    return
  }

  successResponse(response, {
    id: checkoutId,
    total: round2(totalForCheckout(checkout)),
    totalOfDiscountedItems: round2(totalOfDiscountedItems(checkout)),
    messages: collectMessages(checkout),
    totalSaved: round2(totalSaved(checkout))
  })
}
