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
      "Stegreifaufgabe": 1,
      "Mündliche Leistung": 1
    };
  
    const user = ctx.state.user;
    const data = ctx.request.body.data;
  
    // Bestimme Gewichtung und prüfe, ob ein sicherer Wert existiert
    const gewichtung = gewichtungMap[data.art] || null;
  
    // Bestimme, ob die Note vollständig ist
    const isIncomplete = gewichtung === null;
  
    // TODO: Setze eine Logik für den Fall, dass eine Note unvollständig sein soll (z.B. keine Gewichtung festgelegt)
    if (isIncomplete) {
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
  
      // Erfolgreiches Logging der erstellten Note
      console.log("Note erfolgreich erstellt:", note);
  
      return { note };
    } catch (error) {
      // Füge eine Fehlerbehandlung hinzu
      console.error("Fehler beim Erstellen der Note:", error);
      ctx.throw(500, "Fehler beim Erstellen der Note");
    }
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
