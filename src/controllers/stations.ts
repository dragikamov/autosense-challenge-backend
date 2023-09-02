import { Request, Response } from 'express';
import Station from '../models/station';
import * as pump from '../models/pump';

const createStation = async (req: Request, res: Response) => {
    const requiredProperties = ['id_name', 'name', 'latitude', 'longitude', 'city', 'address'];

    for (const prop of requiredProperties) {
        if (!req.body.hasOwnProperty(prop)) {
            return res.status(400).json({
                error: "Bad Request",
                message: `The request body must contain a ${prop} property`,
            });
        }
    }

    const station = new Station({
        id_name: req.body.id_name,
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        city: req.body.city,
        address: req.body.address,
    });

    Station.create(station, (err: Error | null, result?: any) => {
        if (err) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: err.message,
            });
        }

        if (req.body.hasOwnProperty('pumps')) {
            var promises = [];

            for (let i = 0; i < req.body.pumps.length; i++) {
                promises.push(new Promise((resolve, reject) => {
                    const pumpData = new pump.Pump({
                        id_name: req.body.pumps[i].id_name,
                        fuel_type: req.body.pumps[i].fuel_type,
                        price: req.body.pumps[i].price,
                        station_id: result.insertId,
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
        
            Promise.all(promises).then((values) => { return res.status(201).json({...result, pumps: values}); }).catch((err) => {
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: err.message,
                });
            });
        } else {
            return res.status(201).json(result);
        }
    });
};

const updateStation = async (req: Request, res: Response) => {
    const requiredProperties = ['id_name', 'name', 'latitude', 'longitude', 'city', 'address'];

    for (const prop of requiredProperties) {
        if (!req.body.hasOwnProperty(prop)) {
            return res.status(400).json({
                error: "Bad Request",
                message: `The request body must contain a ${prop} property`,
            });
        }
    }

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
            const updatedStation = new Station({
                id_name: req.body.id_name,
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                city: req.body.city,
                address: req.body.address,
            });

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
                    // TODO: Update pumps
                    return res.status(200).json(result);
                }
            });
        }
    });
};

const getAllStations = async (req: Request, res: Response) => {
    Station.getAll(async (err: Error | null, data?: any) => {
        if (err) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: err.message,
            });
        }

        var promises = [];

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

        await Promise.all(promises).then((values) => { return res.status(200).json({ stations: values }); }).catch((err) => {
            return res.status(500).json({
                error: "Internal Server Error",
                message: err.message,
            });
        });
    });
};

const getStationById = async (req: Request, res: Response) => {
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

const deleteStation = async (req: Request, res: Response) => {
    pump.Pump.deleteByStationId(req.params.id, (err: Error | null, data?: any) => {
        if (err && err.message !== "not_found") {
            return res.status(500).send({
                message: "Could not delete Station with ID " + req.params.id + " because of an error with the pumps under it."
            });
        }
        else {
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
