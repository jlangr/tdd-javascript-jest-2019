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
export const postCheckoutTotal = (request, response) => {
  const checkoutId = request.params.id
  const checkout = checkouts[checkoutId]
  if (!checkout) {
    errorResponse(response, 'nonexistent checkout')
    return
  }

  const messages = []

  let totalOfDiscountedItems = 0
  let totalForCheckout = 0
  let totalSaved = 0

  checkout.items.forEach(item => {
    let price = item.price
    messages.push(lineItem(price, item.description))
    if (!item.exempt && memberDiscountPercent(checkout) > 0) {
      messages.push(lineItem(-1 * memberDiscountPercent(checkout) * price, `   ${memberDiscountPercent(checkout) * 100}% mbr disc`))

      totalOfDiscountedItems += discountedPrice(price, checkout)
      totalForCheckout += discountedPrice(price, checkout)
      totalSaved += memberDiscountPercent(checkout) * price
    }
    else
      totalForCheckout += price
  })

  messages.push(lineItem(round2(totalForCheckout), 'TOTAL'))
  if (totalSaved > 0)
    messages.push(lineItem(totalSaved, '*** You saved:'))

  successResponse(response, {
    id: checkoutId,
    total: round2(totalForCheckout),
    totalOfDiscountedItems: round2(totalOfDiscountedItems),
    messages,
    totalSaved: round2(totalSaved)
  })
}
