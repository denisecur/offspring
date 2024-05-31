module.exports = (plugin) => {
    plugin.controllers.user.addNote = async (ctx) => {
        if (!ctx.state.user || !ctx.state.user.id) {
            return ctx.response.status = 401;
        }

        const userId = ctx.state.user.id;
        const newNote = ctx.request.body.note;

        if (!newNote) {
            return ctx.response.status = 400;
        }

        // Hole den aktuellen Benutzer mit den verschachtelten Komponenten
        const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
            populate: { ausbildung: { populate: { noten: true } } }
        });

        if (!user.ausbildung) {
            return ctx.response.status = 400;
        }

        // Füge die neue Note hinzu
        if (!user.ausbildung.noten) {
            user.ausbildung.noten = [];
        }
        user.ausbildung.noten.push(newNote);

        // Aktualisiere den Benutzer mit der neuen Note
        const updatedUser = await strapi.entityService.update('plugin::users-permissions.user', userId, {
            data: {
                ausbildung: user.ausbildung
            }
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
