import IncrementingIdGenerator from '../data/incrementing-id-generator'
import { retrieveMember } from '../data/member_database'
import { retrieveItem } from '../data/item_databasef'

const checkouts = {}

const pad = (s, length) => s + ' '.repeat(length - s.length)

const sendRequestError = (response, message) => {
  response.status = 400
  response.send({error: message})
}

const sendResponse = (response, body, status = 200) => {
  response.status = status
  response.send(body)
}

export const clearAllCheckouts = (_, __) => {
  for (let member in checkouts) delete checkouts[member]
}

export const getCheckout = (request, response) => {
  const checkout = checkouts[request.params.id]
  return response.send(checkout)
}

export const getCheckouts = (_, response) => {
  return response.send(Object.values(checkouts))
}

export const postCheckout = (_, response) => {
  const newCheckout = { id: IncrementingIdGenerator.id(), items: [] }
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
  const member = retrieveMember(body.id)
  if (!member)
    return sendRequestError(response, 'unrecognized member')

  const checkoutId = request.params.id

  const checkout = checkouts[checkoutId]
  if (!checkout)
    return sendRequestError(response, 'invalid checkout')

  Object.assign(checkout, member)

  sendResponse(response, checkouts[checkoutId])
}

export const postItem = (request, response) => {
  const body = request.body
  const checkoutId = request.params.id
  const newCheckoutItem = { id: IncrementingIdGenerator.id() }
  const item = retrieveItem(body.upc)
  if (!item)
    return sendRequestError(response, 'unrecognized UPC code')

  Object.assign(newCheckoutItem, item)

  const checkout = checkouts[checkoutId]
  if (!checkout)
    return sendRequestError(response, 'nonexistent checkout')

  checkout.items.push(newCheckoutItem)

  sendResponse(response, newCheckoutItem, 201)
}

const LineWidth = 45

export const postCheckoutTotal = (request, response) => {
  const checkoutId = request.params.id
  const checkout = checkouts[checkoutId]
  if (!checkout) {
    response.status = 400
    response.send({error: 'nonexistent checkout'})
    return
  }

  const messages = []
  const discount = checkout.member ? checkout.discount : 0

  let totalOfDiscountedItems = 0
  let total = 0
  let totalSaved = 0

  checkout.items.forEach(item => {
    let price = item.price
    const isExempt = item.exempt
    if (!isExempt && discount > 0) {
      const discountAmount = discount * price
      const discountedPrice = price * (1.0 - discount)

      // add into total
      totalOfDiscountedItems += discountedPrice

      let text = item.description
      // format percent
      const amount = parseFloat(Math.round(price * 100) / 100).toFixed(2)
      const amountWidth = amount.length

      let textWidth = LineWidth - amountWidth
      messages.push(pad(text, textWidth) + amount)

      total += discountedPrice

      // discount line
      const discountFormatted = '-' + parseFloat(Math.round(discountAmount * 100) / 100).toFixed(2)
      textWidth = LineWidth - discountFormatted.length
      text = `   ${discount * 100}% mbr disc`
      messages.push(`${pad(text, textWidth)}${discountFormatted}`)

      totalSaved += discountAmount
    }
    else {
      total += price
      const text = item.description
      const amount = parseFloat(Math.round(price * 100) / 100).toFixed(2)
      const amountWidth = amount.length

      const textWidth = LineWidth - amountWidth
      messages.push(pad(text, textWidth) + amount)
    }
  })

  total = Math.round(total * 100) / 100

  // append total line
  const formattedTotal = parseFloat(Math.round(total * 100) / 100).toFixed(2)
  const formattedTotalWidth = formattedTotal.length
  const textWidth = LineWidth - formattedTotalWidth
  messages.push(pad('TOTAL', textWidth) + formattedTotal)

  if (totalSaved > 0) {
    const formattedTotal = parseFloat(Math.round(totalSaved * 100) / 100).toFixed(2)
    console.log(`formattedTotal: ${formattedTotal}`)
    const formattedTotalWidth = formattedTotal.length
    const textWidth = LineWidth - formattedTotalWidth
    messages.push(pad('*** You saved:', textWidth) + formattedTotal)
  }

  totalOfDiscountedItems = Math.round(totalOfDiscountedItems * 100) / 100

  totalSaved = Math.round(totalSaved * 100) / 100

  response.status = 200
  // send total saved instead
  response.send({ id: checkoutId, total, totalOfDiscountedItems, messages, totalSaved })
}
