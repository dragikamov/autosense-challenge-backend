import { Request, Response } from 'express';
import Station from '../models/station';
import * as pump from '../models/pump';

// Controller for creating a new station
const createStation = async (req: Request, res: Response) => {
    const requiredProperties = ['id_name', 'name', 'latitude', 'longitude', 'city', 'address'];

    // Check if the request body contains all required properties
    for (const prop of requiredProperties) {
        if (!req.body.hasOwnProperty(prop)) {
            return res.status(400).json({
                error: "Bad Request",
                message: `The request body must contain a ${prop} property`,
            });
        }
    }

    // Create a new station object with the properties from the request body
    const station = new Station({
        id_name: req.body.id_name,
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        city: req.body.city,
        address: req.body.address,
    });

    // Save the station in the database using the model
    Station.create(station, (err: Error | null, result?: any) => {
        if (err) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: err.message,
            });
        }

        // If the request body contains pumps, create them and add them to the station
        if (req.body.hasOwnProperty('pumps')) {
            var promises = [];

            for (let i = 0; i < req.body.pumps.length; i++) {
                promises.push(new Promise((resolve, reject) => {
                    // Check if the request body contains all required properties
                    if (!req.body.pumps[i].hasOwnProperty('id_name') || !req.body.pumps[i].hasOwnProperty('fuel_type') || !req.body.pumps[i].hasOwnProperty('price') || !req.body.pumps[i].hasOwnProperty('available')) {
                        reject(new Error("The request body must contain a id_name, fuel_type, price and available property for each pump"));
                    }

                    // Create a new pump object with the properties from the request body
                    const pumpData = new pump.Pump({
                        id_name: req.body.pumps[i].id_name,
                        fuel_type: req.body.pumps[i].fuel_type,
                        price: req.body.pumps[i].price,
                        station_id: result.id,
                        available: req.body.pumps[i].available,
                    });

                    pump.Pump.create(pumpData, (err: Error | null, result?: any) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                }));
            }

            // Wait for all pumps to be created and then return the station
            Promise.all(promises).then((values) => { return res.status(201).json({ ...result, pumps: values }); }).catch((err) => {
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: err.message,
                });
            });
        } else {
            // If the request body does not contain pumps, return the station
            return res.status(201).json(result);
        }
    });
};

// Controller for updating a station
const updateStation = async (req: Request, res: Response) => {
    const requiredProperties = ['id_name', 'name', 'latitude', 'longitude', 'city', 'address'];

    // Check if the request body contains all required properties
    for (const prop of requiredProperties) {
        if (!req.body.hasOwnProperty(prop)) {
            return res.status(400).json({
                error: "Bad Request",
                message: `The request body must contain a ${prop} property`,
            });
        }
    }

    // Create a new station object with the properties from the request body
    const updatedStation = new Station({
        id_name: req.body.id_name,
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        city: req.body.city,
        address: req.body.address,
    });

    // Update the station in the database using the model
    Station.updateById(req.params.id, updatedStation, (err: Error | null, result?: any) => {
        if (err) {
            if (err.message === "not_found") {
                return res.status(404).send({
                    message: `Not found Station with ID ${req.params.id}.`
                });
            }
            else {
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: err.message,
                });
            }
        }
        else {
            // If the request body contains pumps, create/update/delete them and add them to the station
            if (req.body.hasOwnProperty('pumps')) {
                var promises = [];

                for (let i = 0; i < req.body.pumps.length; i++) {
                    promises.push(new Promise((resolve, reject) => {
                        // Check if the request body contains all required properties
                        if (!req.body.pumps[i].hasOwnProperty('id_name') || !req.body.pumps[i].hasOwnProperty('fuel_type') || !req.body.pumps[i].hasOwnProperty('price') || !req.body.pumps[i].hasOwnProperty('available')) {
                            reject(new Error("The request body must contain a id_name, fuel_type, price and available property for each pump"));
                        }

                        // Create a new pump object with the properties from the request body
                        const pumpData = new pump.Pump({
                            id_name: req.body.pumps[i].id_name,
                            fuel_type: req.body.pumps[i].fuel_type,
                            price: req.body.pumps[i].price,
                            station_id: req.params.id,
                            available: req.body.pumps[i].available,
                        });

                        // If the pump has an id, update it, otherwise create it
                        if (req.body.pumps[i].hasOwnProperty('id') && req.body.pumps[i].id !== null) {
                            // If the pump has a deleted property and it is true, delete it, otherwise update it
                            if (req.body.pumps[i].hasOwnProperty('deleted') && req.body.pumps[i].deleted === true) {
                                pump.Pump.remove(req.body.pumps[i].id, (err: Error | null, result?: any) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(void 0);
                                    }
                                });
                            } else {
                                pump.Pump.updateById(req.body.pumps[i].id, pumpData, (err: Error | null, result?: any) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(result);
                                    }
                                });
                            }
                        } else {
                            pump.Pump.create(pumpData, (err: Error | null, result?: any) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(result);
                                }
                            });
                        }
                    }));
                }

                // Wait for all pumps to be created/updated/deleted and then return the station
                Promise.all(promises).then((values) => { return res.status(200).json({ ...result, pumps: values }); }).catch((err) => {
                    return res.status(500).json({
                        error: "Internal Server Error",
                        message: err.message,
                    });
                });
            } else {
                // If the request body does not contain pumps, return the station
                return res.status(200).json(result);
            }
        }
    });
};

// Controller for getting all stations
const getAllStations = async (req: Request, res: Response) => {
    // Get all stations from the database using the model
    Station.getAll((err: Error | null, data?: any) => {
        if (err) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: err.message,
            });
        }

        var promises = [];

        // Get all pumps for each station
        for (let i = 0; i < data.length; i++) {
            promises.push(new Promise((resolve, reject) => {
                pump.Pump.findByStationId(data[i].id, (err: Error | null, pumps: pump.PumpData[] | null) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        data[i].pumps = pumps;
                        resolve(data[i]);
                    }
                });
            }));
        }

        // Wait for all pumps to be fetched and then return the stations
        Promise.all(promises).then((values) => { return res.status(200).json({ stations: values }); }).catch((err) => {
            return res.status(500).json({
                error: "Internal Server Error",
                message: err.message,
            });
        });
    });
};

// Controller for getting a station by id
const getStationById = async (req: Request, res: Response) => {
    // Get the station from the database using the model
    Station.findById(req.params.id, (err: Error | null, station?: any) => {
        if (err) {
            if (err.message === "not_found") {
                return res.status(404).send({
                    message: `Not found Station with ID ${req.params.id}.`
                });
            }
            else {
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: err.message,
                });
            }
        }
        else {
            // Get all pumps for the station
            pump.Pump.findByStationId(req.params.id, (err: Error | null, pumps: pump.PumpData[] | null) => {
                if (err) {
                    if (err.message !== "not_found") {
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: err.message,
                        });
                    }
                }
                else {
                    station.pumps = pumps;
                }
            });

            return res.status(200).json(station);
        }
    });
};

// Controller for deleting a station
const deleteStation = async (req: Request, res: Response) => {
    // Delete all pumps for the station
    pump.Pump.deleteByStationId(req.params.id, (err: Error | null, data?: any) => {
        // If there is an error and it is not that pumps were not found, return an error
        // If pumps were not found then it can be the case that the gas station didn't have pumps assigned to it
        if (err && err.message !== "not_found") {
            return res.status(500).send({
                message: "Could not delete Station with ID " + req.params.id + " because of an error with the pumps under it."
            });
        }
        else {
            // Delete the station
            Station.remove(req.params.id, (err: Error | null, data?: any) => {
                if (err) {
                    if (err.message === "not_found") {
                        return res.status(404).send({
                            message: `Not found Station with ID ${req.params.id}.`
                        });
                    }
                    else {
                        return res.status(500).send({
                            message: "Could not delete Station with ID " + req.params.id
                        });
                    }
                }
                else {
                    res.send({ message: `Station with ID ${req.params.id} was deleted successfully!` });
                }
            });
        }
    });
};

export { createStation, updateStation, getAllStations, getStationById, deleteStation };
