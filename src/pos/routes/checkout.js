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

const formatAmount = amount =>
  parseFloat(Math.round(amount * 100) / 100).toFixed(2)

const lineItem = (dollarAmount, text) => {
  const amount = formatAmount(dollarAmount)
  const amountWidth = amount.length
  const textWidth = LineWidth - amountWidth
  return pad(text, textWidth) + amount
}

const memberDiscountPercent = checkout => checkout.member ? checkout.discount : 0

const shouldBeDiscounted = (item, discount) => !item.exempt && discount > 0

let retrieveCheckout = function (checkoutId) {
  return checkouts[checkoutId]
}

const round2 = amount => Math.round(amount * 100) / 100

const calculateTotal = (checkout, discount) => {
  let total = 0
  checkout.items.forEach(item => {
    if (shouldBeDiscounted(item, discount)) {
      total += item.price * (1.0 - discount)
    } else {
      total += item.price
    }
  })
  return round2(total)
}

const calculateTotalOfDiscountedItems = (checkout, discount) => {
  let totalOfDiscountedItems = 0
  checkout.items.forEach(item => {
    if (shouldBeDiscounted(item, discount))
      totalOfDiscountedItems += item.price * (1.0 - discount)
  })
  return round2(totalOfDiscountedItems)
}

const calculateTotalSaved = (checkout, discount) => {
  let totalSaved = 0
  checkout.items.forEach(item => {
    if (shouldBeDiscounted(item, discount))
      totalSaved += discount * item.price
  })
  return round2(totalSaved)
}

let createReceiptMessages = function (checkout, discount, totals) {
  let messages = []

  checkout.items.forEach(item => {
    messages.push(lineItem(item.price, item.description))
    if (shouldBeDiscounted(item, discount)) {
      const discountAmount = discount * item.price
      messages.push(lineItem(-1 * discountAmount, `   ${discount * 100}% mbr disc`))
    }
  })

  messages.push(lineItem(totals.total, 'TOTAL'))
  if (totals.totalSaved > 0)
    messages.push(lineItem(totals.totalSaved, '*** You saved:'))
  return messages
}

const createReceiptResponse = checkoutId => {
  const checkout = retrieveCheckout(checkoutId)
  const discount = memberDiscountPercent(checkout)

  const totals = {
    id: checkoutId,
    total: calculateTotal(checkout, discount),
    totalOfDiscountedItems: calculateTotalOfDiscountedItems(checkout, discount),
    totalSaved: calculateTotalSaved(checkout, discount),
  }

  totals.messages = createReceiptMessages(checkout, discount, totals)

  return totals
}

const sendError = (response, errorMessage) => {
  response.status = 400
  response.send({error: errorMessage})
}

const sendSuccess = (response, responseBody) => {
  response.status = 200
  response.send(responseBody)
}

export const postCheckoutTotal = (request, response) => {
  const checkoutId = request.params.id
  if (!retrieveCheckout(checkoutId)) {
    sendError(response, 'nonexistent checkout')
    return
  }

  sendSuccess(response, createReceiptResponse(checkoutId))
}
