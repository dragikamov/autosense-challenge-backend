import * as express from "express";
import * as middlewares from "../middlewares";
import * as StationsController from "../controllers/stations";

const router: express.Router = express.Router();

router.post("/createStation", middlewares.checkAuthentication, StationsController.createStation); // Create a new Station
router.put("/updateStation/:id", middlewares.checkAuthentication, StationsController.updateStation); // Update a Station
router.delete("/deleteStation/:id", middlewares.checkAuthentication, StationsController.deleteStation); // Delete a Station
router.get("/", middlewares.checkAuthentication, StationsController.getAllStations); // Get all Stations
router.get("/:id", middlewares.checkAuthentication, StationsController.getStationById); // Get a Station by ID

export default router;
