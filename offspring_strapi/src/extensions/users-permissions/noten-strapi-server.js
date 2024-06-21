module.exports = (plugin) => {
  plugin.controllers.user.addNote = async (ctx) => {
    console.log("noten-strapi-server");
      if (!ctx.state.user || !ctx.state.user.id) {
          return ctx.response.status = 401;
      }

      const userId = ctx.state.user.id;
      const newNote = ctx.request.body.note;

      // Hole den aktuellen Benutzer mit den verschachtelten Komponenten
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
          populate: { ausbildung: { populate: { noten: true } } }
      });

      if (!user.ausbildung || !user.ausbildung.noten) {
          return ctx.response.status = 400;
      }

      // Füge die neue Note hinzu
      user.ausbildung.noten.push(newNote);

      // Aktualisiere nur die Noten des Benutzers
      const updatedUser = await strapi.entityService.update('plugin::users-permissions.user', userId, {
          data: {
              ausbildung: {
                  ...user.ausbildung,
                  noten: user.ausbildung.noten
              }
          },
          populate: { ausbildung: { populate: { noten: true } } }
      });

      ctx.response.status = 200;
      ctx.response.body = updatedUser;
  };

  plugin.routes['content-api'].routes.push({
      method: 'POST',
      path: '/user/note',
      handler: 'user.addNote',
      config: {
          prefix: '',
          policies: []
      }
  });

  return plugin;
};
