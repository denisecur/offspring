// @ts-nocheck
'use strict';

/**
 * connecten in routes (confirm-order)
 */

module.exports = async (policyContext, config, { strapi }) => {
  const { PolicyError } = require("@strapi/utils").errors;

  const user = policyContext.state.user;

  // Fetch the user with their roles and permissions
  const fullUser = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
    populate: ['Rollen.permissions'],
  });

  // Check if the user has full access in their role permissions
  const hasFullAccess = fullUser.Rollen.some(role => 
    role.permissions.some(permission => permission.full_access)
  );

  // Attach hasFullAccess to state for use in the controller
  policyContext.state.hasFullAccess = hasFullAccess;

  // Always allow access to find method, further filtering will be done in the controller
  return true;
};
