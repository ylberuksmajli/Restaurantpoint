const { read } = require("fs");

module.exports = function (server) {

    const { readLastUsedRestaurantsId } = require("../utils");
    const jsonServer = require("json-server");


    let restaurantsIdCounter = readLastUsedRestaurantsId();

    const router = jsonServer.router("db.json");

    // Delete restaurant by ID
    server.delete("/api/restaurants/delete/:id", (request, response) => {
        const restaurantsId = parseInt(request.params.id);

        const restaurantsData = router.db.get("restaurants").value();

        const updatedRestaurants = restaurantsData.filter((rest) => rest.id !== restaurantsId);

        // Update
        router.db.set("restaurants", updatedRestaurants).write();

        // Respond with a message
        response.json({ message: "Restaurant deleted successfully" });
    });

    // Get all restaurants
    server.get("/api/restaurants/all", (request, response) => {
        const restaurantsData = router.db.get("restaurants").value();

        response.json(restaurantsData);
    });
};
