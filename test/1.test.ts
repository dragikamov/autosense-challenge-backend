import api from '../src/api';
import * as chai from 'chai';
import * as supertest from 'supertest';

const expect = chai.expect;
const request = supertest(api);

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJpYXQiOjE2OTM4MzEyOTcsImV4cCI6MTY5NDQzNjA5N30.AkoHJWurVDGAjyGmOeOltaV8VL1HhHn0tgHNV_ZlF_I";

describe('GET /', () => {
  it('should return a 200 response', (done) => {
    request
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        done();
      });
  });
});

describe('GET /stations', () => {
  it('should return a 200 response', async () => {
    const response = await request
      .get('/stations')
      .set('Authorization', authToken)
      .expect(200);

    expect(response.status).to.equal(200);
    expect(response.body.stations).to.be.an('array');
  });
  
  it('should return a 401 response', (done) => {
    request
      .get('/stations')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(401);
        done();
      });
  });
});

describe('POST /stations', () => {
  it('should return a 201 response', async () => {
    const response = await request
      .post('/stations')
      .set('Authorization', authToken)
      .send({
        id_name: "test",
        name: "test",
        latitude: 1,
        longitude: 1,
        city: "test",
        address: "test"
      })
      .expect(201);

    expect(response.status).to.equal(201);
    expect(response.body).to.be.an('object');
    expect(response.body.id_name).to.equal("test");
    expect(response.body.name).to.equal("test");
    expect(response.body.latitude).to.equal(1);
    expect(response.body.longitude).to.equal(1);
    expect(response.body.city).to.equal("test");
    expect(response.body.address).to.equal("test");

    const response2 = await request
      .delete(`/stations/${response.body.id}`)
      .set('Authorization', authToken)
      .expect(200);

    expect(response2.status).to.equal(200);
  });

  it('should return a 400 response', async () => {
    const response = await request
      .post('/stations')
      .set('Authorization', authToken)
      .send({
        id_name: "test",
        name: "test",
        longitude: 1,
        city: "test",
        address: "test"
      })
      .expect(400);
    
    expect(response.status).to.equal(400);
    expect(response.body).to.be.an('object');
    expect(response.body.error).to.equal("Bad Request");
    expect(response.body.message).to.equal("The request body must contain a latitude property");
  });

  it('should return a 401 response', (done) => {
    request
      .post('/stations')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('should return a 500 response', async () => {
    const response = await request
    .post('/stations')
    .set('Authorization', authToken)
    .send({
      id_name: "test",
      name: "test",
      latitude: 1,
      longitude: "word",
      city: "test",
      address: "test"
    })
    .expect(500);

    expect(response.status).to.equal(500);
    expect(response.body).to.be.an('object');
    expect(response.body.error).to.equal("Internal Server Error");
  });
});

describe('GET /stations/:id', () => {
  it('should return a 200 response', async () => {
    // Create a station
    const response1 = await request
      .post('/stations')
      .set('Authorization', authToken)
      .send({
        id_name: "test",
        name: "test",
        latitude: 1,
        longitude: 1,
        city: "test",
        address: "test"
      })
      .expect(201);

    expect(response1.status).to.equal(201);
    expect(response1.body).to.be.an('object');

    // Get the station
    const response2 = await request
      .get(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .expect(200);

    expect(response2.status).to.equal(200);
    expect(response2.body).to.be.an('object');
    expect(response2.body.id).to.equal(response1.body.id);
    expect(response2.body.id_name).to.equal(response1.body.id_name);
    expect(response2.body.name).to.equal(response1.body.name);
    expect(response2.body.latitude).to.equal(response1.body.latitude);
    expect(response2.body.longitude).to.equal(response1.body.longitude);
    expect(response2.body.city).to.equal(response1.body.city);
    expect(response2.body.address).to.equal(response1.body.address);

    // Delete the station
    const response3 = await request
      .delete(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .expect(200);

    expect(response3.status).to.equal(200);
  });

  it('should return a 401 response', (done) => {
    request
      .get('/stations/1')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('should return a 404 response', async () => {
    // Create a station
    const response1 = await request
      .post('/stations')
      .set('Authorization', authToken)
      .send({
        id_name: "test",
        name: "test",
        latitude: 1,
        longitude: 1,
        city: "test",
        address: "test"
      })
      .expect(201);

    expect(response1.status).to.equal(201);
    expect(response1.body).to.be.an('object');

    // Delete the station
    const response2 = await request
      .delete(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .expect(200);

    expect(response2.status).to.equal(200);

    // Get the station
    const response3 = await request
      .get(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .expect(404);

    expect(response3.status).to.equal(404);
    expect(response3.body).to.be.an('object');
    expect(response3.body.message).to.equal(`Not found Station with ID ${response1.body.id}.`);
  });

  it('should return a 500 response', async () => {
    const response = await request
      .get('/stations/word')
      .set('Authorization', authToken)
      .expect(500);

    expect(response.status).to.equal(500);
    expect(response.body).to.be.an('object');
    expect(response.body.error).to.equal("Internal Server Error");
  });
});

describe('PUT /stations/:id', () => {
  it('should return a 200 response', async () => {
    // Create a station
    const response1 = await request
      .post('/stations')
      .set('Authorization', authToken)
      .send({
        id_name: "test",
        name: "test",
        latitude: 1,
        longitude: 1,
        city: "test",
        address: "test"
      })
      .expect(201);

    expect(response1.status).to.equal(201);
    expect(response1.body).to.be.an('object');

    // Update the station
    const response2 = await request
      .put(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .send({
        id_name: "test2",
        name: "test2",
        latitude: 2,
        longitude: 2,
        city: "test2",
        address: "test2"
      })
      .expect(200);

    expect(response2.status).to.equal(200);
    expect(response2.body).to.be.an('object');
    expect(response2.body.id_name).to.equal("test2");
    expect(response2.body.name).to.equal("test2");
    expect(response2.body.latitude).to.equal(2);
    expect(response2.body.longitude).to.equal(2);
    expect(response2.body.city).to.equal("test2");
    expect(response2.body.address).to.equal("test2");

    // Delete the station
    const response3 = await request
      .delete(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .expect(200);

    expect(response3.status).to.equal(200);
  });

  it('should return a 400 response', async () => {
    // Create a station
    const response1 = await request
      .post('/stations')
      .set('Authorization', authToken)
      .send({
        id_name: "test",
        name: "test",
        latitude: 1,
        longitude: 1,
        city: "test",
        address: "test"
      })
      .expect(201);

    expect(response1.status).to.equal(201);
    expect(response1.body).to.be.an('object');

    // Update the station
    const response2 = await request
      .put(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .send({
        id_name: "test2",
        name: "test2",
        longitude: 2,
        city: "test2",
        address: "test2"
      })
      .expect(400);

    expect(response2.status).to.equal(400);
    expect(response2.body).to.be.an('object');
    expect(response2.body.error).to.equal("Bad Request");
    expect(response2.body.message).to.equal("The request body must contain a latitude property");

    // Delete the station
    const response3 = await request
      .delete(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .expect(200);

    expect(response3.status).to.equal(200);
  });

  it('should return a 401 response', (done) => {
    request
      .put('/stations/1')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('should return a 404 response', async () => {
    // Update the station
    const response = await request
      .put('/stations/0')
      .set('Authorization', authToken)
      .send({
        id_name: "test2",
        name: "test2",
        latitude: 2,
        longitude: 2,
        city: "test2",
        address: "test2"
      })
      .expect(404);

    expect(response.status).to.equal(404);
    expect(response.body).to.be.an('object');
    expect(response.body.message).to.equal("Not found Station with ID 0.");
  });

  it('should return a 500 response', async () => {
    // Create a station
    const response1 = await request
      .post('/stations')
      .set('Authorization', authToken)
      .send({
        id_name: "test",
        name: "test",
        latitude: 1,
        longitude: 1,
        city: "test",
        address: "test"
      })
      .expect(201);

    expect(response1.status).to.equal(201);
    expect(response1.body).to.be.an('object');

    // Update the station
    const response2 = await request
      .put(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .send({
        id_name: "test2",
        name: "test2",
        latitude: "word",
        longitude: 2,
        city: "test2",
        address: "test2"
      })
      .expect(500);

    expect(response2.status).to.equal(500);
    expect(response2.body).to.be.an('object');
    expect(response2.body.error).to.equal("Internal Server Error");

    // Delete the station
    const response3 = await request
      .delete(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .expect(200);

    expect(response3.status).to.equal(200);
  });
});

describe('DELETE /stations/:id', () => {
  it('should return a 200 response', async () => {
    // Create a station
    const response1 = await request
      .post('/stations')
      .set('Authorization', authToken)
      .send({
        id_name: "test",
        name: "test",
        latitude: 1,
        longitude: 1,
        city: "test",
        address: "test"
      })
      .expect(201);

    expect(response1.status).to.equal(201);
    expect(response1.body).to.be.an('object');

    // Delete the station
    const response2 = await request
      .delete(`/stations/${response1.body.id}`)
      .set('Authorization', authToken)
      .expect(200);

    expect(response2.status).to.equal(200);
  });

  it('should return a 401 response', (done) => {
    request
      .delete('/stations/1')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('should return a 404 response', async () => {
    const response = await request
      .delete('/stations/0')
      .set('Authorization', authToken)
      .expect(404);

    expect(response.status).to.equal(404);
    expect(response.body).to.be.an('object');
    expect(response.body.message).to.equal("Not found Station with ID 0.");
  });
});
