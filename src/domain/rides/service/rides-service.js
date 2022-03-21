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

async function getRideWithPaging(pageRequest, db) {
  return new Promise((resolve, reject) => {
    const { skip, limit } = pageRequest;
    db.all('SELECT * FROM Rides LIMIT ? OFFSET ?', [limit, skip], function(
      error,
      rowQuery
    ) {
      if (error) {
        return reject(error);
      }
      return resolve(rowQuery);
    });
  });
}

async function getRideCount(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT COUNT(*) FROM Rides', function(error, rowCount) {
      if (error) {
        return reject(error);
      }
      return resolve(rowCount[0]['COUNT(*)']);
    });
  });
}

async function getRides(pageRequest, db) {
  const [data, count] = await Promise.all([
    getRideWithPaging(pageRequest, db),
    getRideCount(db)
  ]);
  console.log('count------------', count);
  return PaginationUtils.getPaginationResult(data, count, pageRequest);
}

async function getRideById(id, db) {
  return db.all(`SELECT * FROM Rides WHERE rideID = ?`, id);
}

module.exports = {
  createRide,
  getRides,
  getRideById
};
