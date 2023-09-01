import { Request, Response } from 'express';
import { Pump }  from '../models/pump';

const createPump = async (req: Request, res: Response) => {
    const requiredProperties = ['id_name', 'fuel_type', 'price', 'available', 'station_id'];

    for (const prop of requiredProperties) {
        if (!req.body.hasOwnProperty(prop)) {
            return res.status(400).json({
                error: "Bad Request",
                message: `The request body must contain a ${prop} property`,
            });
        }
    }

    const pump = new Pump({
        id_name: req.body.id_name,
        fuel_type: req.body.fuel_type,
        price: req.body.price,
        available: req.body.available,
        station_id: req.body.station_id,
    });

    Pump.create(pump, (err: Error | null, result?: any) => {
        if (err) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: err.message,
            });
        }

        return res.status(201).json(result);
    });
};

const updatePump = async (req: Request, res: Response) => {
    const requiredProperties = ['id_name', 'fuel_type', 'price', 'available', 'station_id'];

    for (const prop of requiredProperties) {
        if (!req.body.hasOwnProperty(prop)) {
            return res.status(400).json({
                error: "Bad Request",
                message: `The request body must contain a ${prop} property`,
            });
        }
    }

    Pump.findById(req.params.id, (err: Error | null, pump?: any) => {
        if (err) {
            if (err.message === "not_found") {
                return res.status(404).send({
                    message: `Not found Pump with ID ${req.params.id}.`
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
            const updatedPump = new Pump({
                id_name: req.body.id_name,
                fuel_type: req.body.fuel_type,
                price: req.body.price,
                available: req.body.available,
                station_id: req.body.station_id,
            });

            Pump.updateById(req.params.id, updatedPump, (err: Error | null, result?: any) => {
                if (err) {
                    if (err.message === "not_found") {
                        return res.status(404).send({
                            message: `Not found Pump with ID ${req.params.id}.`
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

const deletePump = async (req: Request, res: Response) => {
    Pump.remove(req.params.id, (err: Error | null, data?: any) => {
        if (err) {
            if (err.message === "not_found") {
                return res.status(404).send({
                    message: `Not found Pump with ID ${req.params.id}.`
                });
            }
            else {
                return res.status(500).send({
                    message: "Could not delete Pump with ID " + req.params.id
                });
            }
        }
        else {
            res.send({ message: `Pump with ID ${req.params.id} was deleted successfully!` });
        }
    });
};

export { createPump, updatePump, deletePump };
