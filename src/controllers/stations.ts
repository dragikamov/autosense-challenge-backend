import { Request, Response } from 'express';
import Station from '../models/station';
import { Pump } from '../models/pump';

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

        return res.status(201).json(result);
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
                    return res.status(200).json(result);
                }
            });
        }
    });
};

const getAllStations = async (req: Request, res: Response) => {
    Station.getAll((err: Error | null, data?: any) => {
        if (err) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: err.message,
            });
        }

        return res.status(200).json(data);
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
            return res.status(200).json(station);
        }
    });
};

const deleteStation = async (req: Request, res: Response) => {
    Pump.deleteByStationId(req.params.id, (err: Error | null, data?: any) => {
        if (err) {
            if (err.message !== "not_found") {
                return res.status(500).send({
                    message: "Could not delete Station with ID " + req.params.id + " because of an error with the pumps under it."
                });
            }
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
