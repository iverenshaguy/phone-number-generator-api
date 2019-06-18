import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';

describe('API Home Routes', () => {
  it('should return a fallback page for wrong routes', (done) => {
    request(app)
      .get('/yadayada')
      .end((err, res) => {
        expect(res.body.error).to.equal('Route not found');
        if (err) return done(err);
        done();
      });
  });

  it('should return a Welcome Message for API Home', (done) => {
    request(app)
      .get('/api')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Welcome to the Phone Number Generator API');

        if (err) return done(err);
        done();
      });
  });

  it('should return a Welcome Message for Version 1 API Home', (done) => {
    request(app)
      .get('/api/v1')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Welcome to version 1 of the Phone Number Generator API');

        if (err) return done(err);
        done();
      });
  });
});