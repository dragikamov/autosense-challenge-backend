import { QueryError, RowDataPacket, ResultSetHeader, ProcedureCallPacket } from 'mysql2'; // Import types for MySQL2
import sql from './db';

interface PumpData {
    id?: number;
    id_name: string;
    fuel_type: string;
    price: number;
    available: boolean;
    station_id: number;
}

class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

class Pump {
    id_name: string;
    fuel_type: string;
    price: number;
    available: boolean;
    station_id: number;

    constructor(pump: PumpData) {
        this.id_name = pump.id_name;
        this.fuel_type = pump.fuel_type;
        this.price = pump.price;
        this.available = pump.available;
        this.station_id = pump.station_id;
    }

    static create(newPump: PumpData, result: (error: QueryError | null, pumpData: PumpData | null) => void): void {
        sql.query("INSERT INTO pumps SET ?", newPump, (err: QueryError, res: ResultSetHeader | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | ResultSetHeader[] | ProcedureCallPacket) => {
            if (err) {
                console.error("Error: ", err);
                result(err, null);
                return;
            }

            if ("insertId" in res) {console.log("Created Pump: ", { id: res.insertId, ...newPump });
            result(null, { id: res.insertId, ...newPump });}
            else {
                console.log("Created Pump: ", { id: newPump.id, ...newPump });
                result(null, { id: newPump.id, ...newPump });
            }
        });
    }

    static findById(pumpId: number, result: (error: QueryError | NotFoundError | null, pumpData: PumpData | null) => void): void {
        sql.query(`SELECT * FROM pumps WHERE id = ${pumpId}`, (err, res: RowDataPacket[]) => {
            if (err) {
                console.error("Error: ", err);
                result(err, null);
                return;
            }

            if (res.length) {
                console.log("Found Pump: ", res[0]);
                result(null, res[0] as PumpData);
            } else {
                result(new NotFoundError(`not_found`), null);
            }
        });
    }

    static findByStationId(stationId: number, result: (error: QueryError | null, pumps: PumpData[] | null) => void): void {
        sql.query(`SELECT * FROM pumps WHERE station_id = ${stationId}`, (err, res: RowDataPacket[]) => {
            if (err) {
                console.error("Error: ", err);
                result(err, null);
                return;
            }

            console.log("Pumps: ", res);
            result(null, res as PumpData[]);
        });
    }
    
    static deleteByStationId(stationId: number, result: (error: QueryError | NotFoundError | null, res: RowDataPacket[] | null) => void): void {
        sql.query("DELETE FROM pumps WHERE station_id = ?", stationId, (err, res) => {
            if (err) {
                console.error("Error: ", err);
                result(err, null);
                return;
            }

            if ("affectedRows" in res && res.affectedRows === 0) {
                result(new NotFoundError(`not_found`), null);
                return;
            }

            console.log("Deleted Pumps with Station ID: ", stationId);
            result(null, res as RowDataPacket[]);
        });
    }

    static updateById(
        id: number,
        pump: PumpData,
        result: (error: QueryError | NotFoundError | null, updatedPumpData: PumpData | null) => void
    ): void {
        sql.query(
            "UPDATE pumps SET id_name = ?, fuel_type = ?, price = ?, available = ?, station_id = ? WHERE id = ?",
            [pump.id_name, pump.fuel_type, pump.price, pump.available, pump.station_id, id],
            (err: QueryError, res: ResultSetHeader | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | ResultSetHeader[] | ProcedureCallPacket) => {
                if (err) {
                    console.error("Error: ", err);
                    result(err, null);
                    return;
                }

                if ("affectedRows" in res && res.affectedRows === 0) {
                    result(new NotFoundError(`not_found`), null);
                    return;
                }

                console.log("Updated Pump: ", { id: id, ...pump });
                result(null, { id: id, ...pump });
            }
        );
    }

    static remove(id: number, result: (error: QueryError | NotFoundError | null, res: RowDataPacket[] | null) => void): void {
        sql.query("DELETE FROM pumps WHERE id = ?", id, (err, res) => {
            if (err) {
                console.error("Error: ", err);
                result(err, null);
                return;
            }

            if ("affectedRows" in res && res.affectedRows === 0) {
                result(new NotFoundError(`not_found`), null);
                return;
            }

            console.log("Deleted Pump with ID: ", id);
            result(null, res as RowDataPacket[]);
        });
    }
}

export { Pump, PumpData };
