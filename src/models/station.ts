import { QueryError, RowDataPacket, ResultSetHeader, ProcedureCallPacket } from 'mysql2'; // Import types for MySQL2
import sql from './db';
import * as pump from './pump';

// Define StationData interface
interface StationData {
    id?: number;
    id_name: string;
    name: string;
    latitude: number;
    longitude: number;
    city: string;
    address: string;
    pumps?: pump.PumpData[];
}

// Class for no station found error
class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

class Station {
    id_name: string;
    name: string;
    latitude: number;
    longitude: number;
    city: string;
    address: string;

    constructor(station: StationData) {
        this.id_name = station.id_name;
        this.name = station.name;
        this.latitude = station.latitude;
        this.longitude = station.longitude;
        this.city = station.city;
        this.address = station.address;
    }

    // Create a new station
    static create(newStation: StationData, result: (error: QueryError | null, StationData: StationData | null) => void): void {
        sql.query("INSERT INTO stations SET ?", newStation, (err: QueryError, res: ResultSetHeader | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | ResultSetHeader[] | ProcedureCallPacket) => {
            if (err) {
                result(err, null);
                return;
            }

            if ("insertId" in res) {
                result(null, { id: res.insertId, ...newStation });
            }
            else {
                result(null, { id: newStation.id, ...newStation });
            }
        });
    }

    // Get a station by id
    static findById(StationId: number, result: (error: QueryError | NotFoundError | null, StationData: StationData | null) => void): void {
        sql.query(`SELECT * FROM stations WHERE id = ${StationId}`, (err, res: RowDataPacket[]) => {
            if (err) {
                result(err, null);
                return;
            }

            if (res.length) {
                result(null, res[0] as StationData);
            } else {
                result(new NotFoundError(`not_found`), null);
            }
        });
    }

    // Get all stations
    static getAll(result: (error: QueryError | null, Stations: StationData[] | null) => void): void {
        sql.query(`SELECT * FROM stations`, (err, res: RowDataPacket[]) => {
            if (err) {
                result(err, null);
                return;
            }

            result(null, res as StationData[]);
        });
    }

    // Update a station by id
    static updateById(
        id: number,
        Station: StationData,
        result: (error: QueryError | NotFoundError | null, updatedStationData: StationData | null) => void
    ): void {
        sql.query(
            "UPDATE stations SET id_name = ?, name = ?, latitude = ?, longitude = ?, city = ?, address = ? WHERE id = ?",
            [Station.id_name, Station.name, Station.latitude, Station.longitude, Station.city, Station.address, id],
            (err: QueryError, res: ResultSetHeader | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | ResultSetHeader[] | ProcedureCallPacket) => {
                if (err) {
                    result(err, null);
                    return;
                }

                if ("affectedRows" in res && res.affectedRows === 0) {
                    result(new NotFoundError(`not_found`), null);
                    return;
                }

                result(null, { id: id, ...Station });
            }
        );
    }

    // Delete a station by id
    static remove(id: number, result: (error: QueryError | NotFoundError | null, res: RowDataPacket[] | null) => void): void {
        sql.query("DELETE FROM stations WHERE id = ?", id, (err, res) => {
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

export default Station;
