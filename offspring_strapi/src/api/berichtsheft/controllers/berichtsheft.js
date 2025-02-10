// @ts-nocheck
"use strict";
const { parseMultipartData } = require('@strapi/utils');


const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::berichtsheft.berichtsheft", ({ strapi }) => ({
 
  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    // Fetch the berichtsheft
    const berichtsheft = await strapi.entityService.findOne("api::berichtsheft.berichtsheft", id, {
      populate: ["owner"],
    });

    if (!berichtsheft) {
      ctx.status = 404;
      ctx.body = { message: "berichtsheft not found" };
      return;
    }

    const hasFullAccess = ctx.state.hasFullAccess;

    // Check if the berichtsheft belongs to the user or if the user has full access
    if (berichtsheft.owner.id !== user.id && !hasFullAccess) {
      ctx.status = 403;
      ctx.body = { message: "You are not allowed to access this berichtsheft" };
      return;
    }

    return berichtsheft;
  },
  async find(ctx) {
    const user = ctx.state.user;
    const hasFullAccess = ctx.state.hasFullAccess;
    let berichtshefte;
  
    if (hasFullAccess) {
      berichtshefte = await strapi.entityService.findMany("api::berichtsheft.berichtsheft", {
        populate: ["owner", "pdf"],
      });
    } else {
      berichtshefte = await strapi.entityService.findMany("api::berichtsheft.berichtsheft", {
        filters: { owner: user.id },
        populate: ["owner", "pdf"],
      });
    }
  
    return { data: berichtshefte };
  },
  
  async create(ctx) {
    const user = ctx.state.user;
    let data, files;

    if (ctx.is('multipart')) {
      ({ data, files } = parseMultipartData(ctx));
    } else {
      data = ctx.request.body;
    }

    if (!data || !data.woche_vom) {
      ctx.throw(400, "'woche_vom' ist erforderlich.");
    }

    try {
      const berichtsheftData = {
        woche_vom: data.woche_vom,
        owner: user.id,
        publishedAt: new Date(), // Eintrag veröffentlichen
      };

      let berichtsheft;

      if (files && files.pdf) {
        berichtsheft = await strapi.entityService.create('api::berichtsheft.berichtsheft', {
          data: berichtsheftData,
          files: {
            pdf: files.pdf,
          },
        });
      } else {
        berichtsheft = await strapi.entityService.create('api::berichtsheft.berichtsheft', {
          data: berichtsheftData,
        });
      }

      // Berichtsheft mit PDF-Daten abrufen
      const populatedBerichtsheft = await strapi.entityService.findOne(
        'api::berichtsheft.berichtsheft',
        berichtsheft.id,
        {
          populate: ['pdf'],
        }
      );

      // Antwort bereinigen und formatieren
      const sanitizedEntity = await this.sanitizeOutput(populatedBerichtsheft, ctx);

      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      console.error('Fehler beim Erstellen des Berichtsheftes:', error);
      ctx.throw(500, 'Fehler beim Erstellen des Berichtsheftes');
    }
  },
  
  
}));
