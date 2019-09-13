import {
  clearAllCheckouts,
  getCheckout,
  getCheckouts,
  postCheckout,
  postCheckoutTotal,
  postItem,
  postMember
} from './checkout'

import IncrementingIdGenerator from '../data/incrementing-id-generator'
import { overrideRetrieveItem } from '../data/item_databasef'
import { overrideRetrieveMember } from '../data/member_database'

const createEmptyResponse = () => ({
  send: jest.fn(),
  status: undefined
})

const expectResponseSentToEqual = (response, expected) =>
  expect(response.send).toHaveBeenCalledWith(expected)

const expectResponseSentToMatch = (response, expected) => {
  const firstCallFirstArg = response.send.mock.calls[0][0]
  expect(firstCallFirstArg).toMatchObject(expected)
}

const postNewCheckoutWithId = (id, response) => {
  IncrementingIdGenerator.reset(id)
  postCheckout({}, response)
}

// TODO: add item before checkout initiated--creates checkout
// TODO: identify member before checkout initiated creates checkout

describe('checkout routes', () => {
  let response
  const checkoutId = 1001

  beforeEach(() => {
    clearAllCheckouts()
    response = createEmptyResponse()
    postNewCheckoutWithId(checkoutId, response)
  })

  describe('checkouts', () => {
    it('returns created checkout on post', () => {
      expectResponseSentToEqual(response, { id: checkoutId, items: [] })
      expect(response.status).toEqual(201)
    })

    it('returns persisted checkout on get', () => {
      getCheckout({ params: { id: checkoutId }}, response)

      expectResponseSentToEqual(response, { id: checkoutId, items: [] })
    })

    it('returns additionally created checkouts on get all', () => {
      postCheckout({}, response)

      getCheckouts({}, response)

      expectResponseSentToEqual(response,
        [{ id: checkoutId, items: [] }, { id: checkoutId + 1, items: [] }])
    })
  })

  describe('items', () => {
    it('returns created item on post', () => {
      overrideRetrieveItem(() => ({ upc: '333', description: 'Milk', price: 3.33 }))
      IncrementingIdGenerator.reset(1002)

      postItem({ params: { id: checkoutId }, body: { upc: '333' } }, response)

      expect(response.status).toEqual(201)
      expectResponseSentToEqual(response, { id: 1002, upc: '333', description: 'Milk', price: 3.33 })
    })

    it('returns error when item UPC not found', () => {
      overrideRetrieveItem(() => undefined)

      postItem({ params: { id: checkoutId }, body: { upc: '333' } }, response)

      expect(response.status).toEqual(400)
      expectResponseSentToEqual(response, { error: 'unrecognized UPC code' })
    })

    it('returns error when checkout not found', () => {
      overrideRetrieveItem(() => ({ upc: '333', description: '', price: 0.00 }))

      postItem({ params: { id: -1 }, body: { upc: '333' } }, response)

      expect(response.status).toEqual(400)
      expectResponseSentToEqual(response, { error: 'nonexistent checkout' })
    })
  })

  describe('scanning a member ID', () => {
    it('updates checkout with member data', () => {
      overrideRetrieveMember(() => ({ member: '719-287-4335', discount: 0.01, name: 'Jeff Languid' }))
      postMember({ params: { id: checkoutId }, body: { id: '719-287-4335' }}, response)

      getCheckout({params: { id: checkoutId }}, response)

      expectResponseSentToMatch(response, { member: '719-287-4335', discount: 0.01, name: 'Jeff Languid' })
    })

    it('returns error when checkout not found', () => {
      postMember({ params: { id: 999 }, body: { id: 'unknown' }}, response)

      expect(response.status).toEqual(400)
      expectResponseSentToEqual(response, { error: 'invalid checkout' })
    })

    it('returns error when member not found', () => {
      overrideRetrieveMember(() => undefined)

      postMember({ params: { id: checkoutId }, body: { id: 'anything' }}, response)

      expect(response.status).toEqual(400)
      expectResponseSentToEqual(response, { error: 'unrecognized member' })
    })
  })

  // In Progress
  describe('checkout total', () => {
    // it('does stuff', () => {
    //   IncrementingIdGenerator.reset(checkoutId)
    //   postCheckout({}, response)
    //   sendSpy.resetHistory()
    //   // set up for discountng
    //   itemDatabaseRetrieveStub.callsFake(_ => ({ upc: '333', price: 3.33, description: '', exempt: false }))
    //   postItem({ params: { id: checkoutId }, body: { upc: '333' } }, response)
    //   sendSpy.resetHistory()
    //   console.log('req id', checkoutId )
    //   itemDatabaseRetrieveStub.callsFake(_ => ({ upc: '444', price: 4.44, description: '', exempt: false }))
    //   postItem({ params: { id: checkoutId }, body: { upc: '444' } }, response)
    //   sendSpy.resetHistory()
    //   const request = { params: { id: checkoutId }}
    //   postCheckoutTotal(request, response)
    //   expect(response.status).toEqual(200)
    //   console.log('reseponse status', response.status)
    //   expect(sinon.assert.calledWith(response.send, sinon.match({ total: 7.77 })))
    //
    //   //  not found
    //   postCheckoutTotal({ params: { id: 'unknown' }}, response)
    //   expect(response.status).toEqual(400)
    //   sinon.assert.calledWith(response.send, { error: 'nonexistent checkout' })
    // })
    //
    // it('applies any member discount', () => {
    //   IncrementingIdGenerator.reset(checkoutId)
    //   postCheckout({}, response)
    //   sendSpy.resetHistory()
    //   scanMember('719-287-4335', 0.25)
    //   purchase('333', 3.33)
    //   purchase('444', 4.44)
    //   postCheckoutTotal({ params: { id: checkoutId }}, response)
    //   expect(sinon.assert.calledWith(response.send, sinon.match({ total: 5.83 })))
    // })
    //
    // it('3rd disc test', () => {
    //   IncrementingIdGenerator.reset(1001)
    //   postCheckout({}, response)
    //   sendSpy.resetHistory()
    //   scanMember('719-287-4335', 0.085)
    //   purchase('333', 4.40)
    //   purchaseExemptItem('444', 5.50)
    //   postCheckoutTotal({ params: { id: checkoutId }}, response)
    //   expect(sinon.assert.calledWith(response.send, sinon.match({ total: 9.53 })))
    // })
    //
    // it('discd tots', () => {
    //   IncrementingIdGenerator.reset(1001)
    //   postCheckout({}, response)
    //   sendSpy.resetHistory()
    //   purchaseExemptItem('444', 6.00)
    //   scanMember('719-287-4335', 0.10)
    //   purchase('333', 4.00)
    //   postCheckoutTotal({ params: { id: checkoutId }}, response)
    //   expect(sinon.assert.calledWith(response.send, sinon.match({ totalOfDiscountedItems:  3.60 })))
    //   sendSpy.resetHistory()
    //
    //   // amount saved
    //   IncrementingIdGenerator.reset(1001)
    //   postCheckout({}, response)
    //   sendSpy.resetHistory()
    //   scanMember('719-287-4335', 0.10)
    //   purchase('333', 4.00)
    //   purchase('444', 6.00)
    //   postCheckoutTotal({ params: { id: checkoutId }}, response)
    //   expect(sinon.assert.calledWith(response.send, sinon.match({ /* totalOfDiscountedItems*/totalSaved:  1.00 })))
    // })
    //
    // it('provides 0 total for discounted items when no member scanned', () => {
    //   IncrementingIdGenerator.reset(1001)
    //   postCheckout({}, response)
    //   sendSpy.resetHistory()
    //   purchase('333', 4.00)
    //   postCheckoutTotal({ params: { id: checkoutId }}, response)
    //   expect(sinon.assert.calledWith(response.send, sinon.match({ totalOfDiscountedItems :   0.00 })))
    // })
    //
    // it('provides 0 total for discounted items when member discount is 0', () => {
    //   IncrementingIdGenerator.reset(1001)
    //   postCheckout({}, response)
    //   sendSpy.resetHistory()
    //   scanMember('719-287-4335', 0.00)
    //   // addCheckout(checkoutId)
    //
    //   purchase('333', 4.00)
    //
    //   postCheckoutTotal({ params: { id: checkoutId }}, response)
    //   expect(sinon.assert.calledWith(response.send, sinon.match({ totalOfDiscountedItems :   0.00 })))
    // })
  })

})

/*


 */

xdescribe('checkout functionality', () => {
  let response
  let sendSpy
  let itemDatabaseRetrieveStub
  let memberDatabaseRetrieveStub

  const checkoutId = 1001

  beforeEach(() => {
    sendSpy = sinon.spy()
    sendSpy.resetHistory()
    response = emptyResponse()
    clearAllCheckouts()
  })

  beforeEach(() => itemDatabaseRetrieveStub = sinon.stub(ItemDatabase.prototype, 'retrieve'))
  beforeEach(() => memberDatabaseRetrieveStub = sinon.stub(MemberDatabase.prototype, 'retrieve'))

  afterEach(() => itemDatabaseRetrieveStub.restore())
  afterEach(() => memberDatabaseRetrieveStub.restore())

  const purchaseItem = (upc, price, description, exempt = false) => { 
    itemDatabaseRetrieveStub.callsFake(upc => ({ upc, price, description, exempt }))
    postItem({ params: { id: checkoutId }, body: { upc } }, response)
    sendSpy.resetHistory()
  }

  const purchaseExemptItem = (upc, price, description='') => { 
    purchaseItem(upc, price, description, true)
  }

  const purchase = (upc, price, description='') => { 
    purchaseItem(upc, price, description, false)
  }

  const scanMember = (id, discount, name = 'Jeff Languid') => {
    memberDatabaseRetrieveStub.callsFake(_ => ({ member: id, discount, name }))
    postMember({ params: { id: checkoutId }, body: { id }}, response)
    sendSpy.resetHistory()
  }

  const emptyResponse = () => ({ 
    send: sendSpy,
    status: undefined 
  })

  const expectResponseMatches = expected =>
    sinon.assert.calledWith(response.send, sinon.match(expected))

  const expectResponseEquals = expected => 
    sinon.assert.calledWith(response.send, expected)

  const addCheckout = id => {
    IncrementingIdGenerator.reset(id)
    postCheckout({}, response)
    sendSpy.resetHistory()
  }

  describe('checkout total', () => {
    it('does stuff', () => {
      IncrementingIdGenerator.reset(checkoutId)
      postCheckout({}, response)
      sendSpy.resetHistory()
      // set up for discountng
      itemDatabaseRetrieveStub.callsFake(_ => ({ upc: '333', price: 3.33, description: '', exempt: false }))
      postItem({ params: { id: checkoutId }, body: { upc: '333' } }, response)
      sendSpy.resetHistory()
      console.log('req id', checkoutId )
      itemDatabaseRetrieveStub.callsFake(_ => ({ upc: '444', price: 4.44, description: '', exempt: false }))
      postItem({ params: { id: checkoutId }, body: { upc: '444' } }, response)
      sendSpy.resetHistory()
      const request = { params: { id: checkoutId }}
      postCheckoutTotal(request, response)
      expect(response.status).toEqual(200)
      console.log('reseponse status', response.status)
      expect(sinon.assert.calledWith(response.send, sinon.match({ total: 7.77 })))

      //  not found
      postCheckoutTotal({ params: { id: 'unknown' }}, response)
      expect(response.status).toEqual(400)
      sinon.assert.calledWith(response.send, { error: 'nonexistent checkout' })
    })

    it('applies any member discount', () => {
      IncrementingIdGenerator.reset(checkoutId)
      postCheckout({}, response)
      sendSpy.resetHistory()
      scanMember('719-287-4335', 0.25)
      purchase('333', 3.33)
      purchase('444', 4.44)
      postCheckoutTotal({ params: { id: checkoutId }}, response)
      expect(sinon.assert.calledWith(response.send, sinon.match({ total: 5.83 })))
    })

    it('3rd disc test', () => {
      IncrementingIdGenerator.reset(1001)
      postCheckout({}, response)
      sendSpy.resetHistory()
      scanMember('719-287-4335', 0.085)
      purchase('333', 4.40)
      purchaseExemptItem('444', 5.50)
      postCheckoutTotal({ params: { id: checkoutId }}, response)
      expect(sinon.assert.calledWith(response.send, sinon.match({ total: 9.53 })))
    })

    it('discd tots', () => {
      IncrementingIdGenerator.reset(1001)
      postCheckout({}, response)
      sendSpy.resetHistory()
      purchaseExemptItem('444', 6.00)
      scanMember('719-287-4335', 0.10)
      purchase('333', 4.00)
      postCheckoutTotal({ params: { id: checkoutId }}, response)
      expect(sinon.assert.calledWith(response.send, sinon.match({ totalOfDiscountedItems:  3.60 })))
      sendSpy.resetHistory()

      // amount saved
      IncrementingIdGenerator.reset(1001)
      postCheckout({}, response)
      sendSpy.resetHistory()
      scanMember('719-287-4335', 0.10)
      purchase('333', 4.00)
      purchase('444', 6.00)
      postCheckoutTotal({ params: { id: checkoutId }}, response)
      expect(sinon.assert.calledWith(response.send, sinon.match({ /* totalOfDiscountedItems*/totalSaved:  1.00 })))
    })

    it('provides 0 total for discounted items when no member scanned', () => {
      IncrementingIdGenerator.reset(1001)
      postCheckout({}, response)
      sendSpy.resetHistory()
      purchase('333', 4.00)
      postCheckoutTotal({ params: { id: checkoutId }}, response)
      expect(sinon.assert.calledWith(response.send, sinon.match({ totalOfDiscountedItems :   0.00 })))
    })

    it('provides 0 total for discounted items when member discount is 0', () => {
      IncrementingIdGenerator.reset(1001)
      postCheckout({}, response)
      sendSpy.resetHistory()
      scanMember('719-287-4335', 0.00)
      // addCheckout(checkoutId)

      purchase('333', 4.00)

      postCheckoutTotal({ params: { id: checkoutId }}, response)
      expect(sinon.assert.calledWith(response.send, sinon.match({ totalOfDiscountedItems :   0.00 })))
    })
  })

  describe('message lines', () => {
    beforeEach(() => addCheckout(checkoutId))

    it('includes items and total', () => {
      purchase('123', 5.00, 'Milk')
      purchase('555', 12.00, 'Fancy eggs')

      postCheckoutTotal({ params: { id: checkoutId } }, response)

      expectResponseMatches(
        { messages: ['Milk                                     5.00',
          'Fancy eggs                              12.00',
          'TOTAL                                   17.00' ]})
    })

    it('includes discounts and total saved', () => {
      scanMember('719-287-4335', 0.10)
      purchase('123', 5.00, 'Milk')
      purchase('555', 2.79, 'Eggs')

      postCheckoutTotal({ params: { id: checkoutId } }, response)

      expectResponseMatches(
        { messages: ['Milk                                     5.00',
          '   10% mbr disc                         -0.50',
          'Eggs                                     2.79',
          '   10% mbr disc                         -0.28',
          'TOTAL                                    7.01',
          '*** You saved:                           0.78' ] })
    })
  })
})