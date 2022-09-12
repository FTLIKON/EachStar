const requireAll = ctx => ctx.keys().map(ctx);
const req = require.context('./', false, /\.svg$/);
requireAll(req)