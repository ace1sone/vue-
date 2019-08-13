import invariant from 'redux-immutable-state-invariant';

const middlewares = [];
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(invariant());
}

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
    // onAction: middlewares,
  },
};

let authRoutes = null;

function ergodicRoutes(routes, authKey, authority) {
  routes.forEach(element => {
    if (element.path === authKey) {
      Object.assign(element.authority, authority || []);
    } else if (element.routes) {
      ergodicRoutes(element.routes, authKey, authority);
    }
    return element;
  });
}

export function patchRoutes(routes) {
  Object.keys(authRoutes).map(authKey => ergodicRoutes(routes, authKey, authRoutes[authKey].authority));
  window.g_routes = routes;
}

export function render(oldRender) {
  authRoutes = {};
  oldRender();
}
