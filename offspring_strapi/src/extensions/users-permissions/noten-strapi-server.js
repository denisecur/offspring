// src/extensions/users-permissions/strapi-server.js
module.exports = (plugin) => {
  plugin.controllers.user.addNote = async (ctx) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      return (ctx.response.status = 401);
    }

    const userId = ctx.state.user.id;
    const newNote = ctx.request.body.note;

    // Hole den aktuellen Benutzer mit den verschachtelten Komponenten
    const user = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      userId,
      {
        populate: {
          ausbildung: {
            populate: {
              noten: {
                populate: { ausbildungsfach: { populate: { lernfeld: true } } },
              },
            },
          },
        },
      }
    );

    // Füge die neue Note hinzu
    user.ausbildung.noten.push(newNote);

    // Aktualisiere den Benutzer mit der neuen Note
    const updatedUser = await strapi.entityService.update(
      "plugin::users-permissions.user",
      userId,
      {
        populate: {
          ausbildung: {
            populate: {
              noten: {
                populate: { ausbildungsfach: true, lernfeld: true },
              },
            },
          },
        },
        data: {
          ausbildung: user.ausbildung,
        },
      }
    );

    ctx.response.status = 200;
    ctx.response.body = updatedUser;
  };

  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/user/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: [],
    },
  });

  return plugin;
};
