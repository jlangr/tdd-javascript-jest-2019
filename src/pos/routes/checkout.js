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

const round2 = amount => Math.round(amount * 100) / 100

const formatPrice = amount => parseFloat(round2(amount)).toFixed(2)

const createLineItem = (amount, message) => {
  const formattedTotal = formatPrice(amount)
  const formattedTotalWidth = formattedTotal.length
  const textWidth = LineWidth - formattedTotalWidth
  return pad(message, textWidth) + formattedTotal
}

const discountPercent = checkout => checkout.member ? checkout.discount : 0

const sendSuccess = (response, responseData) => {
  response.status = 200
  response.send(responseData)
}

const sendErrorResponse = (response, message) => {
  response.status = 400
  response.send({error: message})
}

const isValidCheckout = (request) => {
  const checkoutId = request.params.id
  return checkouts[checkoutId]
}

let calculateTotalsAndGatherMessages = function (checkout) {
  const responseData = {
    messages: [], totalOfDiscountedItems: 0, total: 0, totalSaved: 0
  }

  checkout.items.forEach(item => {
    responseData.messages.push(createLineItem(item.price, item.description))
    if (!item.exempt && discountPercent(checkout) > 0) {
      const discountAmount = discountPercent(checkout) * item.price
      const discountedPrice = item.price * (1.0 - discountPercent(checkout))

      responseData.totalOfDiscountedItems += discountedPrice
      responseData.total += discountedPrice
      responseData.totalSaved += discountAmount

      responseData.messages.push(
        createLineItem(formatPrice(-1 * discountAmount),
          `   ${discountPercent(checkout) * 100}% mbr disc`))
    } else {
      responseData.total += item.price
    }
  })

  responseData.total = round2(responseData.total)

  responseData.messages.push(createLineItem(responseData.total, 'TOTAL'))
  if (responseData.totalSaved > 0)
    responseData.messages.push(createLineItem(responseData.totalSaved, '*** You saved:'))

  responseData.totalOfDiscountedItems = round2(responseData.totalOfDiscountedItems)
  responseData.totalSaved = round2(responseData.totalSaved)
  return responseData
}

const loadCheckout = request => checkouts[request.params.id]

export const postCheckoutTotal = (request, response) => {
  if (!isValidCheckout(request)) {
    sendErrorResponse(response, 'nonexistent checkout')
    return
  }

  const checkout = loadCheckout(request)

  const responseData = calculateTotalsAndGatherMessages(checkout)

  sendSuccess(response,
    Object.assign({ id: request.params.id}, responseData))
}
