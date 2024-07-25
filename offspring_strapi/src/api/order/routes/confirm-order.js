// ROUTES DEFINITION
module.exports = {
   routes: [
        {
            method: "POST",
            path: "/orders/confirm/:id",
            handler: "order.confirmOrder", 
            // von der order api benutzen wir den erstellten custom controller (npm run strapi generate) confirmOrder. dessen methode confirm wird nicht hier sondern im core router  (routes/order.js) connected)
            config: {
                policies: [
                    "api::order.is-owner"
                ],
            }
        },
      

    ],
};
