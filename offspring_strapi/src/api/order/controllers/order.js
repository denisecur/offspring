// @ts-nocheck
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({strapi}) => ({
    // Logik
    confirmOrder: async (ctx, next) => {  // das ist die handler-Methode
            // Welche Bestellung? id parameter holen
            const { id } = ctx.request.params;

            // bestellung holen mit EntityServieApi, bearbeiten
            await strapi.entityService.update("api::order.order", id, {
                data: {
                    confirmed: true,
                    date_confirmed: new Date(),
                },
            });

            // E-Mail-Bestätigung als Folge der order confirmation
            // owner soll nicht per id zugeordnet werden, sondern aus der request gefolgert werden 
            return {
                message: "confirmed",
            };
      },

    // nun folgt customizing des create-controllers
      async create(ctx, next) {
        const user = ctx.state.user;
       const order = await strapi.entityService.create("api::order.order", {
        data: {
            products: ctx.request.body.data.products,
            owner: user.id,
        },
       });
        return {order};
      }
}));



// so würde man die core controllers komplett überschreiben:

// find: async(ctx, next) => {
//     {/* 
//         // @ts-ignore */}
//     const {data, meta} = await super.find(ctx); // data und meta - struktur strapi content type response
//     // do sth mit data/meta
//     return {data, meta};
//   }