// @ts-nocheck
'use strict';

/**
 * `is-owner` policy
 * existiert nur im order controller 
 * delta controller policy; controller interagiert mit data, custom control flow
 * whereas wohingegen policies kümmern sich um requests die in die - und aus der App - kommen
 * 
 * Es soll jede Anfrage/Aktion aufgehalten werden, die nicht zum jeweiligen Requester (!) gehört. nicht nicht zum jeweiligen user, sondern zum jeweiligen requester
 * -> stop confirmation if you dont own the order youre trying to confirm
 */

/**
 * connecten in routes (confirm-order)
 */

module.exports = async  (policyContext, config, { strapi }) => {
  const { PolicyError } = require("@strapi/utils").errors;

    // we want to make sure that the order being confirmed is owned by the requester and not by anyone who is authenticcated and has the users order id
    const {id} = policyContext.request.params;
    const user = policyContext.state.user;

    const order = await strapi.entityService.findOne("api::order.order", id, {
      populate: ["owner"],
    });

    if(order.owner.id === user.id) {
      return true;
    }  else {
      throw new PolicyError('You are not allowed to perform this action', { // die scheiße soll in v5 dann gehen https://github.com/strapi/strapi/issues/18566 "in Strapi v4 we've updated the documentation to reflect this" ne hat er nicht
        policy: 'is-owner',
      });

  }};

  //TODO
  /**
   * http: POST /api/orders/confirm/15 (31 ms) 200
[2024-07-17 17:56:50.475] error: Cannot read properties of null (reading 'owner')
TypeError: Cannot read properties of null (reading 'owner')


es soll nicht ein 500er geworfen werden, wenn es den owner, also die order, nicht gibt, sondern genau der gleiche Fehler, wie wenn man nicht authorisiert ist: ForbiddenError oder eben der custom policy Error, wenn er in v5 dann geht.
Ich will nicht, dass hervorgeht, ob es nicht geht, weil die Bestellung nicht exisiert oder weil man nicht darf.

   */

  //  strapi.log.info(`WARNING: User ${currentUserId} tried to edit user ${userToUpdate}`);