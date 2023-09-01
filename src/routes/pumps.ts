import * as express from "express";
import * as middlewares from "../middlewares";
import * as PumpsController from "../controllers/pumps";

const router: express.Router = express.Router();

router.post("/createPump", middlewares.checkAuthentication, PumpsController.createPump); // Create a new Pump
router.put("/updatePump/:id", middlewares.checkAuthentication, PumpsController.updatePump); // Update a Pump
router.delete("/deletePump/:id", middlewares.checkAuthentication, PumpsController.deletePump); // Delete a Pump

export default router;
