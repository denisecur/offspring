// @ts-nocheck
"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::note.note", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    // Fetch the note
    const note = await strapi.entityService.findOne("api::note.note", id, {
      populate: ["owner"],
    });

    if (!note) {
      ctx.status = 404;
      ctx.body = { message: "note not found" };
      return;
    }

    const hasFullAccess = ctx.state.hasFullAccess;

    // Check if the note belongs to the user or if the user has full access
    if (note.owner.id !== user.id && !hasFullAccess) {
      ctx.status = 403;
      ctx.body = { message: "You are not allowed to access this note" };
      return;
    }

    return note;
  },

  

  async create(ctx) {
    const user = ctx.state.user;
    const note = await strapi.entityService.create("api::note.note", {
      data: {
        owner: user.id,
        publishedAt: new Date(),
      },
    });
    return { note };
  },

  async find(ctx) {
    const user = ctx.state.user;
    const hasFullAccess = ctx.state.hasFullAccess;
  
    console.log('User:', user);
    console.log('Has Full Access:', hasFullAccess);
  
    let noten;
  
    if (hasFullAccess) {
      // Chef role: can see all noten
      noten = await strapi.entityService.findMany("api::note.note", {
        populate: ["owner"],
      });
    } else {
      // Azubi role: can see only their own noten
      noten = await strapi.entityService.findMany("api::note.note", {
        filters: { owner: user.id },
        populate: ["owner", "ausbildungsfach"], // wenn man hier etwas rausnimmt, kann man in Thunder/Insomnia populaten wie man will und es wird nicht in der API-Antwort erscheinen :-)
      });
    }
  
    console.log('Fetched Noten:', noten);
  
    return { data: noten };
  
  
  },
}));
