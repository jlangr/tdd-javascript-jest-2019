import Generator from '../data/id-generator'
import ItemDatabase from '../data/item_database'
import MemberDatabase from '../data/member_database'

const checkouts = {}

const itemDatabase = new ItemDatabase()
const memberDatabase = new MemberDatabase()

export const clearAllCheckouts = (_, __) => {
  for (var member in checkouts) delete checkouts[member]
}

const LineWidth = 45

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

const round2 = dollarAmount => Math.round(dollarAmount * 100) / 100

const formatAmount = dollarAmount => parseFloat(round2(dollarAmount)).toFixed(2)

const lineItem = (dollarAmount, text) => {
  const amount = formatAmount(dollarAmount)
  return pad(text, LineWidth - amount.length) + amount
}

const getMemberDiscountPercent = checkout => checkout.member ? checkout.discount : 0

const sendErrorResponse = (response, error) => {
  response.status = 400
  response.send({error})
}

const amountOfDiscount = (item, discountPercent) => discountPercent * item.price

const discountedPrice = (item, discountPercent) =>
  item.price * (1.0 - discountPercent)

const calculateTotalOfDiscountedItems = checkout =>
  discountableItems(checkout)
    .reduce((total, item) => total + discountedPrice(item, checkout.memberDiscount), 0)

const shouldDiscountItem = (item, discountPercent) =>
  !item.exempt && discountPercent > 0

const discountableItems = checkout =>
  checkout.items.filter(item => shouldDiscountItem(item, getMemberDiscountPercent(checkout)))

const nonDiscountableItems = checkout =>
  checkout.items.filter(item => !shouldDiscountItem(item, getMemberDiscountPercent(checkout)))

const calculateTotalSaved = checkout =>
  discountableItems(checkout)
    .reduce((total, item) => total + amountOfDiscount(item, checkout.memberDiscount), 0)

const checkoutTotal = checkout =>
  nonDiscountableItems(checkout).reduce((total, item) => total + item.price, 0)
  + discountableItems(checkout).reduce((total, item) => total + discountedPrice(item, checkout.memberDiscount), 0)

const discountLineItem = (checkout, item) => {
  return lineItem(-1 * formatAmount(amountOfDiscount(item, checkout.memberDiscount)),
    `   ${checkout.memberDiscount * 100}% mbr disc`)
}

const itemLines = checkout =>
  checkout.items.reduce((messages, item) => {
    messages.push(lineItem(item.price, item.description))
    if (!item.exempt && checkout.memberDiscount > 0)
      messages.push(discountLineItem(checkout, item))
    return messages
  }, [])

const totalLines = totals => {
  const messages = [ lineItem(formatAmount(totals.total), 'TOTAL') ]
  if (totals.totalSaved > 0)
    messages.push(lineItem(formatAmount(totals.totalSaved), '*** You saved:'))
  return messages
}

const gatherMessages = (checkout, totals) => itemLines(checkout).concat(totalLines(totals))

const sendSuccessResponse = (response, responseBody) => {
  response.status = 200
  response.send(responseBody)
}

const checkoutWithId = checkoutId => checkouts[checkoutId]

const calculateTotals = checkout => ({
  total: round2(checkoutTotal(checkout)),
  totalSaved: round2(calculateTotalSaved(checkout)),
  totalOfDiscountedItems: round2(calculateTotalOfDiscountedItems(checkout))
})

const attachMemberDiscount = checkout => ({
  ...checkout,
  memberDiscount: getMemberDiscountPercent(checkout) // TODO move to checkout?
})

export const postCheckoutTotal = (request, response) => {
  const checkout = checkoutWithId(request.params.id)
  if (!checkout) return sendErrorResponse(response, 'nonexistent checkout')

  const checkoutWithDiscount = attachMemberDiscount(checkout)
  const totals = calculateTotals(checkoutWithDiscount)

  sendSuccessResponse(response, {
    ...totals,
    messages: gatherMessages(checkoutWithDiscount, totals),
    id: request.params.id,
  })
}
