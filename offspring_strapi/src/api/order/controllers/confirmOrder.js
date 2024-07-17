'use strict';

/**
 * A set of functions called "actions" for `confirmOrder`
 */

module.exports = {
  // exampleAction: async (ctx, next) => {
  //   try {
  //     ctx.body = 'ok';
  //   } catch (err) {
  //     ctx.body = err;
  //   }
  // }

  /** 
   * bei Minute 21 fing er an, das in den CoreController zu schreiben, damit der Code ausführt... aber statt confirm nannte er die Funktion confirmOrder: async......in dem Zuge wurde auch der handler in confirm-order umgeändert von order.confirmOrder.confirm zu order.confirmOrder
   * 
   * also keine Ahnung ob das hier überflüssig ist oder später nochmal sinn macht.. //TODO 
  */
  confirm: async (ctx, next) => {  // das ist die handler-Methode
    ctx.body = "ok";
  }
};
