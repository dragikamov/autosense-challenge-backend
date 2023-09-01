CREATE TABLE IF NOT EXISTS stations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_name TEXT NOT NULL,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pumps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_name TEXT NOT NULL,
    fuel_type TEXT NOT NULL,
    price REAL NOT NULL,
    available BOOLEAN NOT NULL,
    station_id INT NOT NULL,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

INSERT INTO stations(id, id_name, name, latitude, longitude, city, address) VALUES (1, "MIGROL_100041", "Migrol Tankstelle", 47.3943939, 8.52981, "Zürich", "Scheffelstrasse 16"), (2, "MIGROL_100085", "Migrol Service", 47.367348257, 8.4942242729, "Zürich", "Birmensdorferstrasse 517");
INSERT INTO pumps (id, id_name, fuel_type, price, available, station_id) VALUES (1, 10001, "BENZIN_95", 1.68, 1, 1), (2, 10002, "BENZIN_98", 1.77, 0, 1), (3, 10003, "DIESEL", 1.75, 1, 1), (4, 10001, "BENZIN_95", 1.72, 1, 2), (5, 10002, "BENZIN_98", 1.79, 1, 2), (6, 10003, "DIESEL", 1.71, 0, 2);
