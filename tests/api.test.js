//eslint-disable-next-line
const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');
//eslint-disable-next-line
describe('API tests', () => {
  //eslint-disable-next-line
  before(done => {
    db.serialize(err => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  //eslint-disable-next-line
  describe('GET /health', () => {
    //eslint-disable-next-line
    it('should return health', done => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });
});
