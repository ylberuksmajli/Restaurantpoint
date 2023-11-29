
const jsonServer = require("json-server");
const jsonServerPort = 8091;

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
server.use(jsonServer.bodyParser);
server.use(middlewares);

// I kam komentu per shkak se me u ba run Serveri .

//const menuItemsRoutes = require("./routes/menu-items");
//const menusRoutes = require("./routes/menus");
const restaurantsRoutes = require('./routes/restaurants');

//menuItemsRoutes(server);
//menusRoutes(server);
restaurantsRoutes(server); 

server.listen(jsonServerPort,() => {
  console.log(`JSon server running on port ${jsonServerPort}`);
});