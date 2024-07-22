// @ts-nocheck
// offspring_strapi/src/api/order/controllers/order.js
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    // Fetch the order
    const order = await strapi.entityService.findOne('api::order.order', id, {
      populate: ['owner'],
    });

    if (!order) {
      ctx.status = 404;
      ctx.body = { message: 'Order not found' };
      return;
    }

    const hasFullAccess = ctx.state.hasFullAccess;

    // Check if the order belongs to the user or if the user has full access
    if (order.owner.id !== user.id && !hasFullAccess) {
      ctx.status = 403;
      ctx.body = { message: 'You are not allowed to access this order' };
      return;
    }

    return order;
  },

  async confirmOrder(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    // Fetch the order
    const order = await strapi.entityService.findOne('api::order.order', id, {
      populate: ['owner'],
    });

    if (!order) {
      ctx.status = 404;
      ctx.body = { message: 'Order not found' };
      return;
    }

    const hasFullAccess = ctx.state.hasFullAccess;

    // Check if the order belongs to the user or if the user has full access
    if (order.owner.id !== user.id && !hasFullAccess) {
      ctx.status = 403;
      ctx.body = { message: 'You are not allowed to confirm this order' };
      return;
    }

    await strapi.entityService.update('api::order.order', id, {
      data: {
        confirmed: true,
        confirmation_date: new Date(),
      },
    });

    ctx.body = { message: 'confirmed' };
  },

  async create(ctx) {
    const user = ctx.state.user;
    const order = await strapi.entityService.create('api::order.order', {
      data: {
        products: ctx.request.body.data.products,
        owner: user.id,
        publishedAt: new Date(),
      },
    });
    return { order };
  },

  async find(ctx) {
    const user = ctx.state.user;
    const hasFullAccess = ctx.state.hasFullAccess;

    let orders;

    if (hasFullAccess) {
      // Chef role: can see all orders
      orders = await strapi.entityService.findMany('api::order.order', {
        populate: ['owner', 'products'],
      });
    } else {
      // Azubi role: can see only their own orders
      orders = await strapi.entityService.findMany('api::order.order', {
        filters: { owner: user.id },
        populate: ['owner', 'products'],
      });
    }

    return { data: orders };
  },
}));
