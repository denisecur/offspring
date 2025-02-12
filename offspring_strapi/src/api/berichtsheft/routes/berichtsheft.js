module.exports = {
    routes: [
    
      {
        method: 'GET',
        path: '/berichtshefte/:id',
        handler: 'berichtsheft.findOne',
        config: {
          policies: ['api::berichtsheft.is-owner'],
        },
      },
      {
        method: 'GET',
        path: '/berichtshefte',
        handler: 'berichtsheft.find',
        config: {
          policies: ['api::berichtsheft.is-owner'],
        },
      },
      {
        method: 'POST',
        path: '/berichtshefte',
        handler: 'berichtsheft.create',
        config: {
          policies: ['api::berichtsheft.is-owner'],
        },
      },

          {
            method: 'PUT',
            path: '/berichtshefte/:id',
            handler: 'berichtsheft.update',
            config: {
              policies: ['api::berichtsheft.is-owner'],
            },
          },
          {
            method: 'DELETE',
            path: '/berichtshefte/:id',
            handler: 'berichtsheft.delete',
            config: {
              policies: ['api::berichtsheft.is-owner'],
            },
          },
    ],
  };