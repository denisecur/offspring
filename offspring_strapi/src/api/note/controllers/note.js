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
    const gewichtungMap = {
      "Schulaufgabe": 2,
      "Kurzarbeit": 1.5,
      "Mündliche Note": 1,
    };
  
    const user = ctx.state.user;
    const data = ctx.request.body.data;
      const gewichtung = gewichtungMap[data.art] || null;
    const isIncomplete = gewichtung === null;
      if (isIncomplete) {
        // TODO Fehlerfall
      console.log("Note wird als unvollständig markiert.");
    }
  
    try {
      const note = await strapi.entityService.create("api::note.note", {
        data: {
          wert: data.wert,
          art: data.art,
          gewichtung: gewichtungMap[data.art],
          ausbildungsfach: data.ausbildungsfach.id,
          datum: data.datum,
          owner: user.id,
 
          publishedAt: isIncomplete ? null : new Date(), 
        },
      });
      return { note };
    } catch (error) {
      console.error("Fehler beim Erstellen der Note:", error);
      ctx.throw(500, "Fehler beim Erstellen der Note");
    }
  },
  

  async find(ctx) {
    const user = ctx.state.user;
    const hasFullAccess = ctx.state.hasFullAccess;
    let noten;
  
    if (hasFullAccess) {
      // Chef role: sieht alles von allen
      noten = await strapi.entityService.findMany("api::note.note", {
        populate: ["owner", "ausbildungsfach"],
      });
    } else {
      // Azubi role: sehen alles von sich selbst
      noten = await strapi.entityService.findMany("api::note.note", {
        filters: { owner: user.id },
        populate: ["owner", "ausbildungsfach"], // wenn man hier etwas rausnimmt, kann man in Thunder/Insomnia populaten wie man will und es wird nicht in der API-Antwort erscheinen :-), nimmt man es wiederum rein, dann braucht man nicht mal populaten
      });
    }
  
    console.log('Fetched Noten:', noten);
  
    return { data: noten };
  
  
  },
}));
