import * as Members from '../data/member_database'
import { retrieveItem } from '../data/item_database'
import * as Checkouts from '../data/checkouts'
import { pad } from '../../util/stringutil'

const sendRequestError = (response, message) => {
  response.status = 400
  response.send({error: message})
}

const sendResponse = (response, body, status = 200) => {
  response.status = status
  response.send(body)
}

export const clearAllCheckouts = (_, __) => Checkouts.deleteAll()

export const getCheckout = (request, response) =>
  response.send(Checkouts.retrieve(request.params.id))

export const getCheckouts = (_, response) =>
  response.send(Checkouts.retrieveAll())

export const postCheckout = (_, response) =>
  sendResponse(response, Checkouts.createNew(), 201)

export const getItems = (request, response) => {
  const checkout = Checkouts.retrieve(request.params.id)
  response.send(checkout.items)
}

const attachMemberToCheckout = (checkoutId, memberId) => {
  const member = Members.retrieveMember(memberId)
  if (!member) return 'unrecognized member'

  const checkout = Checkouts.retrieve(checkoutId)
  if (!checkout) return 'invalid checkout'

  Object.assign(checkout, member)

  Checkouts.updateCheckout(checkoutId, checkout)
}

export const postMember = (request, response) => {
  const memberId = request.body.id
  const checkoutId = request.params.id
  const errorMessage = attachMemberToCheckout(checkoutId, memberId)
  if (errorMessage)
    return sendRequestError(response, errorMessage)

  sendResponse(response, Checkouts.retrieve(checkoutId))
}

export const postItem = (request, response) => {
  const itemDetails = retrieveItem(request.body.upc)
  if (!itemDetails)
    return sendRequestError(response, 'unrecognized UPC code')

  const checkout = Checkouts.retrieve(request.params.id)
  if (!checkout)
    return sendRequestError(response, 'nonexistent checkout')

  const newCheckoutItem = Checkouts.addItem(checkout, itemDetails)

  sendResponse(response, newCheckoutItem, 201)
}

const LineWidth = 45

const round2 = amount => Math.round(amount * 100) / 100

const formatDollar = dollarAmount => parseFloat(round2(dollarAmount).toString()).toFixed(2)

const memberDiscount = checkout => checkout.member ? checkout.discount : 0

const createLineItem = (dollarAmount, description) => {
  const formattedTotal = formatDollar(dollarAmount)
  const formattedTotalWidth = formattedTotal.length
  const textWidth = LineWidth - formattedTotalWidth
  return pad(description, textWidth) + formattedTotal
}

const send400Response = (response, body) => {
  response.status = 400
  response.send(body)
}

const shouldApplyDiscount = (item, memberDiscountPercent) => !item.exempt && memberDiscountPercent > 0

const itemDiscount = (checkout, item) => memberDiscount(checkout) * item.price

const memberDiscountedPrice = (checkout, item) => item.price * (1.0 - memberDiscount(checkout))

const calculateTotals = checkout => {
  const messages = []
  let totalOfDiscountedItems = 0
  let totalChargedForItems = 0
  let totalSaved = 0

  checkout.items.forEach(item => {
    messages.push(createLineItem(item.price, item.description))
    if (shouldApplyDiscount(item, memberDiscount(checkout))) {
      messages.push(createLineItem(-itemDiscount(checkout, item), `   ${memberDiscount(checkout) * 100}% mbr disc`))

      totalOfDiscountedItems += memberDiscountedPrice(checkout, item)
      totalChargedForItems += memberDiscountedPrice(checkout, item)
      totalSaved += itemDiscount(checkout, item)
    } else
      totalChargedForItems += item.price
  })

  messages.push(createLineItem(totalChargedForItems, 'TOTAL'))
  if (totalSaved > 0)
    messages.push(createLineItem(totalSaved, '*** You saved:'))

  return { messages, totalOfDiscountedItems, totalChargedForItems, totalSaved }
}

const sendSuccessResponse = (response, body) => {
  response.status = 200
  response.send(body)
}

export const postCheckoutTotal = (request, response) => {
  const checkoutId = request.params.id
  const checkout = Checkouts.retrieve(checkoutId)
  if (!checkout)
    return send400Response(response, { error: 'nonexistent checkout' })

  const { messages, totalOfDiscountedItems, totalChargedForItems, totalSaved } = calculateTotals(checkout)

  sendSuccessResponse(response, {
    id: request.params.id,
    messages,
    total: round2(totalChargedForItems),
    totalOfDiscountedItems: round2(totalOfDiscountedItems),
    totalSaved: round2(totalSaved)
  })
}
