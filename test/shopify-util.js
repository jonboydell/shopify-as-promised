/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Shopify = require('../shopify')
const shopifyConfig = require('./config.json')

chai.use(chaiAsPromised)
chai.should()
const assert = chai.assert

let underTest = null

const SECRET = 'ABCDEF'
const SIGNATURE = 'cZbZ2VBfTwTMwN6CS6f5tEHboIre8DmedbLZqu0ljU8='
const PLAIN_TEXT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

before(function () {
  shopifyConfig.webhookKey = SECRET
  underTest = new Shopify(shopifyConfig)
  assert.isObject(underTest, 'shopify object was not created correctly')
  assert.isObject(shopifyConfig.test, 'no test vars set')
})

it('shopify : calculate webhook signature', function () {
  assert.equal(SIGNATURE, underTest.calculateWebhookSignature(PLAIN_TEXT))
})

it('shopify : check webhook signature', function () {
  assert.isTrue(underTest.checkWebhookSignature(PLAIN_TEXT, SIGNATURE))
})
