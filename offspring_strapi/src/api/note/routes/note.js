module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/noten',
        handler: 'note.create',
        config: {
          policies: ['api::note.is-owner'],
        },
      },
      {
        method: 'DELETE',
        path: '/noten/:id',
        handler: 'note.delete',
        config: {
          policies: ['api::note.is-owner'],
        },
      },
      {
        method: 'GET',
        path: '/noten',
        handler: 'note.find',
        config: {
          policies: ['api::note.is-owner'],
        },
      },
      {
        method: 'GET',
        path: '/noten/:id',
        handler: 'note.findOne',
        config: {
          policies: ['api::note.is-owner'],
        },
      },
      {
        method: 'PUT',
        path: '/noten/:id',
        handler: 'note.update',
        config: {
          policies: ['api::note.is-owner'],
        },
      },
    ],
  };
  