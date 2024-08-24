module.exports = {
    routes: [
    
      {
        method: 'GET',
        path: '/noten/:id',
        handler: 'note.findOne',
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
        method: 'POST',
        path: '/noten',
        handler: 'note.create',
        config: {
          policies: ['api::note.is-owner'],
        },
      },
    ],
  };
  