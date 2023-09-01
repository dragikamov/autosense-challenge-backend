import * as mysql from 'mysql2'; // Import 'mysql2/promise' for promises support
import * as dbConfig from '../config';

const connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

export default connection;
