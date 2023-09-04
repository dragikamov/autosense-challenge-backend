import * as express from "express";
import * as middlewares from "../middlewares";
import * as StationsController from "../controllers/stations";

const router: express.Router = express.Router();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: apiKey
 *      name: Authorization
 *      in: header
 *      description: JWT Authorization header. The JWT token must NOT be prefixed by "Bearer ". It can be obtained from the localhost:4000/ endpoint.
 *  schemas:
 *     Station:
 *       type: object
 *       required:
 *         - id_name
 *         - name
 *         - latitude
 *         - longitude
 *         - city
 *         - address
 *         - pumps
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the Station
 *         id_name:
 *           type: string
 *           description: The id_name of the Station
 *         name:
 *           type: string
 *           description: The name of the Station
 *         latitude:
 *           type: number
 *           description: The latitude of the Station
 *         longitude:
 *           type: number
 *           description: The longitude of the Station
 *         city:
 *           type: string
 *           description: The city of the Station
 *         address:
 *           type: string
 *           description: The address of the Station
 *         pumps:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pump'
 *           description: The pumps of the Station
 *       example:
 *         id_name: "MIGROL_100041"
 *         name: "Migrol Tankstelle"
 *         latitude: 47.3943939
 *         longitude: 8.52981
 *         city: "Zürich"
 *         address: "Scheffelstrasse 16"
 *         pumps: 
 *           [{
 *             id_name: "10001",
 *             fuel_type: "BENZIN_95",
 *             price: 1.68,
 *             station_id: 1,
 *             available: true
 *           }]
 *     Pump:
 *       type: object
 *       required:
 *         - id_name
 *         - fuel_type
 *         - price
 *         - station_id
 *         - available
 *       optional:
 *         - deleted
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the Pump
 *         id_name:
 *           type: string
 *           description: The id_name of the Pump
 *         fuel_type:
 *           type: string
 *           description: The fuel_type of the Pump
 *         price:
 *           type: number
 *           description: The price of the Pump
 *         station_id:
 *           type: integer
 *           description: The station_id of the Pump
 *         available:
 *           type: boolean
 *           description: The available of the Pump
 *         deleted:
 *           type: boolean
 *           description: Denotes if the Pump should be deleted
 *       example:
 *         id: 1
 *         id_name: "10001"
 *         fuel_type: "BENZIN_95"
 *         price: 1.68
 *         station_id: 1
 *         available: true
 */

/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: The Stations managing API
 * 
 * /:
 *   get:
 *     summary: Returns the list of all the Stations
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the Stations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             items:
 *               $ref: '#/components/schemas/Station'
 *       401:
 *         description: The JWT token is missing or invalid
 *       500:
 *         description: Some internal server error
 * 
 *   post:
 *     summary: Create a new Station
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Station'
 *     responses:
 *       201:
 *         description: The Station was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       400:
 *         description: Bad Request because of missing parameters. The missing parameter can be found in the response message.
 *       401:
 *         description: The JWT token is missing or invalid
 *       500:
 *         description: Some internal server error
 * 
 * /{id}:
 *   get:
 *     summary: Get the Station by id
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Station id
 *     responses:
 *       200:
 *         description: The Station description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       401:
 *         description: The JWT token is missing or invalid
 *       404:
 *         description: The Station was not found
 *       500:
 *         description: Some internal server error
 * 
 *   put:
 *     summary: Update the Station by the id
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Station id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Station'
 *     responses:
 *       200:
 *         description: The Station was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       400:
 *         description: Bad Request because of missing parameters. The missing parameter can be found in the response message.
 *       401:
 *         description: The JWT token is missing or invalid
 *       404:
 *         description: The Station was not found
 *       500:
 *         description: Some internal server error or missing pump parameter. 
 * 
 *   delete:
 *     summary: Remove the Station by id
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Station id
 *     responses:
 *       200:
 *         description: The Station was deleted
 *       401:
 *         description: The JWT token is missing or invalid
 *       404:
 *         description: The Station was not found
 *       500:
 *         description: Some internal server error
 */

router.get("/", middlewares.checkAuthentication, StationsController.getAllStations); // Get all Stations
router.post("/", middlewares.checkAuthentication, StationsController.createStation); // Create a new Station
router.get("/:id", middlewares.checkAuthentication, StationsController.getStationById); // Get a Station by ID
router.put("/:id", middlewares.checkAuthentication, StationsController.updateStation); // Update a Station
router.delete("/:id", middlewares.checkAuthentication, StationsController.deleteStation); // Delete a Station

export default router;
