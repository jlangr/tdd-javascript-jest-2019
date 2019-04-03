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

const formatDollarAmount = amount =>
  parseFloat(Math.round(amount * 100) / 100).toFixed(2)

const round2 = amount => Math.round(amount * 100) / 100

const message = (amount, tag) => {
  const formattedTotal = formatDollarAmount(amount)
  const formattedTotalWidth = formattedTotal.length
  const textWidth = LineWidth - formattedTotalWidth
  return pad(tag, textWidth) + formattedTotal
}

// RESPONSIBILITY?
const discountPercent = checkout => checkout.member ? checkout.discount : 0

const doesDiscountApply = (item, checkout) =>
  !item.exempt && discountPercent(checkout) > 0

const errorResponse = function (response, error) {
  response.status = 400
  response.send({error})
}

const discountAmt = (checkout, item) => discountPercent(checkout) * item.price

const addMessage = (messages, amount, tag) =>
  messages.push(message(round2(amount), tag))

let getDiscountedPrice = function (item, checkout) {
  return item.price * (1.0 - discountPercent(checkout))
}

let messages = function (checkout, responseData) {
  const messages = []
  checkout.items.forEach(item => {
    addMessage(messages, item.price, item.description)
    if (doesDiscountApply(item, checkout)) {
      addMessage(messages,
        -1 * discountAmt(checkout, item),
        `   ${discountPercent(checkout) * 100}% mbr disc`)
    }
  })
  addMessage(messages, responseData.total, 'TOTAL')
  if (responseData.totalSaved > 0)
    addMessage(messages, responseData.totalSaved, '*** You saved:')
  return messages
}

let createResponse = function (request, checkout) {
  const responseData = {
    id: request.params.id,
  }
  const discountedItems = checkout.items.filter(item => doesDiscountApply(item, checkout))
  const nonDiscountedItems = checkout.items.filter(item => !doesDiscountApply(item, checkout))
  const totalOfNonDiscountedItems = nonDiscountedItems.reduce((total, item) => total + item.price, 0)

  responseData.totalOfDiscountedItems = discountedItems.reduce((total, item) => total + getDiscountedPrice(item, checkout), 0)
  responseData.total = totalOfNonDiscountedItems + responseData.totalOfDiscountedItems
  responseData.totalSaved = discountedItems.reduce((total, item) => total + discountAmt(checkout, item), 0)
  responseData.messages = messages(checkout, responseData)

  return responseData
}

const send = (response, responseData) => {
  response.status = 200
  response.send({
    id: responseData.id,
    total: round2(responseData.total),
    totalOfDiscountedItems: round2(responseData.totalOfDiscountedItems),
    messages: responseData.messages,
    totalSaved: round2(responseData.totalSaved)
  })
}

export const postCheckoutTotal = (request, response) => {
  const checkout = checkouts[request.params.id]
  if (!checkout) {
    errorResponse(response, 'nonexistent checkout')
    return
  }
  send(response, createResponse(request, checkout))
}
