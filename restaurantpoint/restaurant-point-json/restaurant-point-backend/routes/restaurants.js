const { read } = require("fs");

module.exports = function (server) {
    const { readLastUsedRestaurantId } = require("../utils");
    const jsonServer = require("json-server");


    let restaurantsIdCounter = readLastUsedRestaurantId();

    const router = jsonServer.router("db.json");

    server.post("/api/restaurants", (request, response) => {
        const requestBody = request.body;

       
        if (requestBody.id === undefined) {
            let restaurantId = restaurantsIdCounter++;

            const newRestaurant = {
                id: restaurantId,
                name: requestBody.name,
                menus: [],
            };
           

            const restaurantsData = router.db.get("restaurants").value();

            restaurantsData.push(newRestaurant);
            

        router.db.set("restaurants", restaurantsData).write();
        const lastUsedId = router.db.get("lastUsedId").value();
        lastUsedId.restaurantId = restaurantsIdCounter;
        router.db.set("lastUsedId", lastUsedId).write();
        response.json(newRestaurant);

            
        } else {
            const restaurantsData = router.db.get("restaurants").value();

            
            const index = restaurantsData.findIndex((rest) => rest.id === requestBody.id);

            if (index === -1) {
                response.status(404).json({ error: "Restaurant not found" });
            } else {
                
                requestBody.id = parseInt(requestBody.id);
                restaurantsData[index] = {
                    ...restaurantsData[index],
                    ...requestBody,
                };

                router.db.set("restaurants", restaurantsData).write();

                response.json(restaurantsData[index])
            }
        }
    });

    // Delete restaurant by ID
    server.delete("/api/restaurants/delete/:id", (request, response) => {
        const restaurantId = parseInt(request.params.id);

        const restaurantsData = router.db.get("restaurants").value();

        const updatedRestaurants = restaurantsData.filter((rest) => rest.id !== restaurantId);

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

    server.get("/api/restaurants/id/:id", (request, response) => {
        const restaurantId = parseInt(request.params.id);
        const restaurantsData = router.db.get("restaurants").value();
        const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);

        if (!restaurant) {
            response.status(404).json({ error: "Restaurant not found" });
        } else {
            response.json(restaurant);
        }
    });

   
};
