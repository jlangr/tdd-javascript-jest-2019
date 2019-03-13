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

const format = total =>
  parseFloat(Math.round(total * 100) / 100).toFixed(2)

const round = amount => Math.round(amount * 100) / 100

const applyDiscount = function (discount, price) {
  return discount * price
}

const createFailureResponse = (response, error) => {
  response.status = 400;
  response.send({error});
}

const retrieveCheckout = checkoutId => checkouts[checkoutId]

let discountForCheckout = function (checkout) {
  return checkout.member ? checkout.discount : 0
}
let shouldApplyDiscount = function (item, checkout) {
  return !item.exempt && discountForCheckout(checkout) > 0
}
let discountedPrice = function (item, checkout) {
  return item.price * (1.0 - discountForCheckout(checkout))
}
let createSuccessResponse = function (response, checkoutId, checkoutTotal, totalOfDiscountedItems, messages, totalSaved) {
  response.status = 200
  response.send({
    id: checkoutId,
    total: round(checkoutTotal),
    totalOfDiscountedItems: round(totalOfDiscountedItems),
    messages,
    totalSaved: round(totalSaved)
  })
}
export const postCheckoutTotal = (request, response) => {
  const checkoutId = request.params.id
  const checkout = retrieveCheckout(checkoutId)
  if (!checkout) {
    createFailureResponse(response, 'nonexistent checkout')
    return;
  }

  const messages = []
  let totalOfDiscountedItems = 0;
  let checkoutTotal = 0;
  let totalSaved = 0;

  checkout.items.forEach(item => {
    addMessage(item.price, messages, item.description)

    if (shouldApplyDiscount(item, checkout)) {
      totalOfDiscountedItems += discountedPrice(item, checkout)
      checkoutTotal += discountedPrice(item, checkout)

      addMessage(-applyDiscount(discountForCheckout(checkout), item.price),
        messages,
        `   ${discountForCheckout(checkout) * 100}% mbr disc`)

      totalSaved += applyDiscount(discountForCheckout(checkout), item.price);
    }
    else {
      checkoutTotal += item.price
    }
  })

  addMessage(round(checkoutTotal), messages, 'TOTAL')
  if (totalSaved > 0)
    addMessage(totalSaved, messages, '*** You saved:')

  createSuccessResponse(response,
    checkoutId,
    checkoutTotal,
    totalOfDiscountedItems,
    messages,
    totalSaved)
}

let addMessage = function (amount, messages, message) {
  const formattedAmount = format(amount)
  const formattedTotalWidth = formattedAmount.length
  const textWidth = LineWidth - formattedTotalWidth
  messages.push(pad(message, textWidth) + formattedAmount)
}

