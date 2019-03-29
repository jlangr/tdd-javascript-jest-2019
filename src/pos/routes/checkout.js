import Generator from '../data/id-generator'
import ItemDatabase from '../data/item_database'
import MemberDatabase from '../data/member_database'

const checkouts = {};

const itemDatabase = new ItemDatabase();
const memberDatabase = new MemberDatabase();

export const clearAllCheckouts = (_, __) => {
  for (var member in checkouts) delete checkouts[member];
};

export const getCheckout = (request, response) => {
  const checkout = checkouts[request.params.id];
  return response.send(checkout);
};

export const getCheckouts = (_, response) => {
  return response.send(Object.values(checkouts));
};

export const postCheckout = (_, response) => {
  const newCheckout = { id: Generator.id(), items: [] };
  checkouts[newCheckout.id] = newCheckout;
  response.status = 201;
  response.send(newCheckout);
};

export const getItems = (request, response) => {
  const id = request.params.id;
  const checkout = checkouts[id];
  response.send(checkout.items);
};

export const postMember = (request, response) => {
  const body = request.body;
  const member = memberDatabase.retrieve(body.id);
  if (!member) {
    response.status = 400;
    response.send({error: 'unrecognized member'});
    return;
  }

  const checkoutId = request.params.id;

  const checkout = checkouts[checkoutId];
  if (!checkout) {
    response.status = 400;
    response.send({error: 'invalid checkout'});
    return;
  }
  Object.assign(checkout, member);

  response.status = 200;
  response.send(checkouts[checkoutId]);
};

export const postItem = (request, response) => {
  const body = request.body;
  const checkoutId = request.params.id;
  const newCheckoutItem = { id: Generator.id() };
  const item = itemDatabase.retrieve(body.upc);
  if (!item) {
    response.status = 400;
    response.send({error: 'unrecognized UPC code'});
    return;
  }

  Object.assign(newCheckoutItem, item);

  const checkout = checkouts[checkoutId];
  if (!checkout) {
    response.status = 400;
    response.send({error: 'nonexistent checkout'});
    return;
  }

  checkout.items.push(newCheckoutItem);

  response.status = 201;
  response.send(newCheckoutItem);
};

const pad = (s, length) => s + ' '.repeat(length - s.length);

const LineWidth = 45;

let round2 = function (totalOfDiscountedItems) {
  return Math.round(totalOfDiscountedItems * 100) / 100
}
let formatDollars = function (totalSaved) {
  return parseFloat(Math.round(totalSaved * 100) / 100).toFixed(2)
}

const canBeDiscounted = (item, discount) => !item.exempt && discount > 0

let message = function (tag, amountToFormat) {
  const formattedTotal = formatDollars(amountToFormat)
  const formattedTotalWidth = formattedTotal.length
  const textWidth = LineWidth - formattedTotalWidth
  const message = pad(tag, textWidth) + formattedTotal
  return message
}

let sendErrorResponse = function (response, errorMessage) {
  response.status = 400
  response.send({error: errorMessage})
}

const leftPad3 = text => `   ${text}`

export const postCheckoutTotal = (request, response) => {
  const checkoutId = request.params.id;
  const checkout = checkouts[checkoutId];
  if (!checkout) {
    sendErrorResponse(response, 'nonexistent checkout')
    return;
  }

  const messages = []
  const discountPercent = checkout.member ? checkout.discount : 0

  let totalOfDiscountedItems = 0
  let total = 0
  let totalSaved = 0

  checkout.items.forEach(item => {
    let price = item.price
    messages.push(message(item.description, price))
    if (canBeDiscounted(item, discountPercent)) {
      const discountAmount = discountPercent * price
      const discountedPrice = price * (1.0 - discountPercent)

      messages.push(
        message(`${leftPad3(`${discountPercent * 100}% mbr disc`)}`,
          -1 * discountAmount))

      totalOfDiscountedItems += discountedPrice
      total += discountedPrice
      totalSaved += discountAmount
    }
    else {
      total += price
    }
  })

  messages.push(message('TOTAL', round2(total)))

  if (totalSaved > 0)
    messages.push(message('*** You saved:', totalSaved))

  totalOfDiscountedItems = round2(totalOfDiscountedItems)
  totalSaved = round2(totalSaved)

  response.status = 200
  response.send({ id: checkoutId, total: round2(total), totalOfDiscountedItems, messages, totalSaved })
};
