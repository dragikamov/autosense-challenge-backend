import { QueryError, RowDataPacket, ResultSetHeader, ProcedureCallPacket } from 'mysql2'; // Import types for MySQL2
import sql from './db';

// Define PumpData interface
interface PumpData {
    id?: number;
    id_name: string;
    fuel_type: string;
    price: number;
    available: boolean;
    station_id: number;
}

// Class for no pump found error
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

    // Create a new pump
    static create(newPump: PumpData, result: (error: QueryError | null, pumpData: PumpData | null) => void): void {
        sql.query("INSERT INTO pumps SET ?", newPump, (err: QueryError, res: ResultSetHeader | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | ResultSetHeader[] | ProcedureCallPacket) => {
            if (err) {
                result(err, null);
                return;
            }

            if ("insertId" in res) {
                result(null, { id: res.insertId, ...newPump });
            }
            else {
                result(null, { id: newPump.id, ...newPump });
            }
        });
    }

    // Get all pumps for a station
    static findByStationId(stationId: number, result: (error: QueryError | null, pumps: PumpData[] | null) => void): void {
        sql.query(`SELECT * FROM pumps WHERE station_id = ${stationId}`, (err, res: RowDataPacket[]) => {
            if (err) {
                result(err, null);
                return;
            }

            result(null, res as PumpData[]);
        });
    }

    // Delete all pumps for a station
    static deleteByStationId(stationId: number, result: (error: QueryError | NotFoundError | null, res: RowDataPacket[] | null) => void): void {
        sql.query("DELETE FROM pumps WHERE station_id = ?", stationId, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }

            if ("affectedRows" in res && res.affectedRows === 0) {
                result(new NotFoundError(`not_found`), null);
                return;
            }

            result(null, res as RowDataPacket[]);
        });
    }

    // Update a pump by id
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
                    result(err, null);
                    return;
                }

                if ("affectedRows" in res && res.affectedRows === 0) {
                    result(new NotFoundError(`not_found`), null);
                    return;
                }

                result(null, { id: id, ...pump });
            }
        );
    }

    // Delete a pump by id
    static remove(id: number, result: (error: QueryError | NotFoundError | null, res: RowDataPacket[] | null) => void): void {
        sql.query("DELETE FROM pumps WHERE id = ?", id, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }

            if ("affectedRows" in res && res.affectedRows === 0) {
                result(new NotFoundError(`not_found`), null);
                return;
            }

            result(null, res as RowDataPacket[]);
        });
    }
}

export { Pump, PumpData };
