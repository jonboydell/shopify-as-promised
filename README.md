# shopify-as-promised

NodeJS module for interacting with Shopify's web API

*Prerequisites*

1. You have created a Shopify account
2. You have created a private API in the Shopify dashboard (go Apps -> Manage Private Apps -> Generate API credentials)
3. The API you've generated has the right permissions - you'll need READ & WRITE for customers, draft orders, orders and READ for products at the very least
4. The webhook key can be in one of two places - if you create your webhooks using the Settings -> Notifications options in the Shopify dashboard then the webhook key will be shown here, if you create your webhooks using the API then the key will be the shared secret (go Apps -> Manage Private Apps -> <YOUR API> -> shared secret)

*Usage*

```
const Shopify = require('shopify')
const config = {
  store: STORE_NAME,
  username: STORE_PRIVATE_API_USERNAME,
  password: STORE_PRIVATE_API_PASSWORD,
  sharedSecret: STORE_PRIVATE_API_SHAREDSECRET,
  webhookKey: STORE_PRIVATE_API_PASSWORD || STORE_NOTIFICATION_WEBHOOK_KEY
}
const shopify = new Shopify(config)

shopify.products()
.then(
  (products) => {
    ... do something here...
  }
)
```

*Testing*

To test this module `mocha test` you'll need to create a config.json file in the /test directory in the following format.

```
{
    "store": "<STORE NAME>",
    "username": "<STORE PRIVATE API USERNAME>",
    "password": "<STORE PRIVATE API PASSWORD>",
    "webhookKey": "<WEBHOOK KEY>",
    "test": {
      "existingCustomerId": <ID OF AN EXISTING CUSTOMER>,
      "existingCustomerEmail": "<EMAIL OF AN EXISTING CUSTOMER>",
      "existingProductId": <ID OF AN EXISTING PRODUCT>,
      "existingProductVariant": <ID OF AN EXISTING PRODUCT VARIANT>
    }
}
```

*Reference*

> It's worth noting that Shopify API won't decrement stock if you just use the order API, you have to create a draft order and then convert it to a real order by completing it
