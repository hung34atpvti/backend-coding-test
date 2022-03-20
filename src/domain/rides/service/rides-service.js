const PaginationUtils = require('../../../utils/PaginationUtils');
const loggers = require('../../../loggers');

async function createRide(reqRide, db) {
  const {
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
    riderName,
    driverName,
    driverVehicle
  } = reqRide;
  const values = [
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
    riderName,
    driverName,
    driverVehicle
  ];
  loggers.info(values);
  const rideSaved = await db.run(
    'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
    values
  );
  return db.all('SELECT * FROM Rides WHERE rideID = ?', rideSaved.lastID);
}

async function getRides(pageRequest, db) {
  const { skip, limit } = pageRequest;
  const [data, count] = await Promise.all([
    db.all('SELECT * FROM Rides LIMIT ? OFFSET ?', [limit, skip]),
    db.all('SELECT COUNT(*) FROM Rides')
  ]);

  return PaginationUtils.getPaginationResult(
    data,
    count[0]['COUNT(*)'],
    pageRequest
  );
}

async function getRideById(id, db) {
  return db.all(`SELECT * FROM Rides WHERE rideID = ?`, id);
}

module.exports = {
  createRide,
  getRides,
  getRideById
};
