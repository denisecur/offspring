// offspring_strapi/src/api/order/routes/order.js
module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/orders/confirm/:id',
        handler: 'order.confirmOrder',
        config: {
          policies: ['api::order.is-owner'],
        },
      },
      {
        method: 'GET',
        path: '/orders/:id',
        handler: 'order.findOne',
        config: {
          policies: ['api::order.is-owner'],
        },
      },
      {
        method: 'GET',
        path: '/orders',
        handler: 'order.find',
        config: {
          policies: ['api::order.is-owner'],
        },
      },
      {
        method: 'POST',
        path: '/orders',
        handler: 'order.create',
        config: {
          policies: ['api::order.is-owner'],
        },
      },
    ],
  };
  