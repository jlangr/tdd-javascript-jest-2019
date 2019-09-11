import Generator from '../data/id-generator'
import ItemDatabase from '../data/item_database'
import MemberDatabase from '../data/member_database'

const checkouts = {}

const itemDatabase = new ItemDatabase()
const memberDatabase = new MemberDatabase()

const retrieveCheckoutById = checkoutId => checkouts[checkoutId]

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

const sendError = function (response, errorMessage) {
  response.status = 400
  response.send({error: errorMessage})
}

const round2 = function (totalOfDiscountedItems) {
  return Math.round(totalOfDiscountedItems * 100) / 100
}

const discountForCheckout = checkout => checkout.member ? checkout.discount : 0

const createLineItem = function (lineAmount, lineText) {
  const amount = parseFloat(round2(lineAmount)).toFixed(2)
  const amountWidth = amount.length
  const textWidth = LineWidth - amountWidth
  return pad(lineText, textWidth) + amount
}

const shouldBeDiscounted = (checkout, item) =>
  !item.exempt && discountForCheckout(checkout) > 0

const sendSuccessResponse = (response, responseBody) => {
  response.status = 200
  response.send(responseBody)
}

const discountAmount = (checkout, item) => discountForCheckout(checkout) * item.price

const discountedPrice = (checkout, item) => item.price * (1.0 - discountForCheckout(checkout))

const calculateTotal = checkout => {
  let total = 0
  checkout.items.forEach(item => {
    if (shouldBeDiscounted(checkout, item))
      total += discountedPrice(checkout, item)
    else
      total += item.price
  })
  return total
}

const calculateTotalSaved = checkout =>
  checkout.items
    .filter(item => shouldBeDiscounted(checkout, item))
    .reduce((total, item) => total + discountAmount(checkout, item), 0)

const calculateTotalOfDiscountedItems = checkout =>
  checkout.items
    .filter(item => shouldBeDiscounted(checkout, item))
    .reduce((total, item) => total + discountedPrice(checkout, item), 0)

const createReceiptMessages = (checkout, totals) => {
  const messages = []

  checkout.items.forEach(item => {
    messages.push(createLineItem(item.price, item.description))
    if (shouldBeDiscounted(checkout, item)) {
      messages.push(createLineItem(-discountAmount(checkout, item), `   ${discountForCheckout(checkout) * 100}% mbr disc`))
    }
  })

  messages.push(createLineItem(totals.total, 'TOTAL'))
  if (calculateTotalSaved(checkout) > 0)
    messages.push(createLineItem(totals.totalSaved, '*** You saved:'))

  return messages
}

const createResponseBody = checkout => {
  const totals = {
    total: round2(calculateTotal(checkout)),
    totalOfDiscountedItems: round2(calculateTotalOfDiscountedItems(checkout)),
    totalSaved: round2(calculateTotalSaved(checkout))
  }

  const messages = createReceiptMessages(checkout, totals)

  return Object.assign({id: checkout.id, messages}, totals)
}


export const postCheckoutTotal = (request, response) => {
  const checkout = retrieveCheckoutById(request.params.id)
  if (!checkout)
    return sendError(response, 'nonexistent checkout')

  sendSuccessResponse(response, createResponseBody(checkout))
}
