import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app';

import { token, wrongUserToken, expiredToken, badToken } from '../helpers/fixtures';

const URL = '/api/v1/numbers';
describe('Number Routes', () => {
  describe('Generate numbers', () => {
    describe('Unauthorized user', () => {
      it('should not generate numbers for a client without a token', (done) => {
        request(app)
          .get(URL)
          .expect(401)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.error).to.equal('User authentication token is required');
            if (err) return done(err);
            done();
          });
      });

      it('should not generate numbers for a client with an expired token', (done) => {
        request(app)
          .get(URL)
          .set('Authorization', `Bearer ${expiredToken}`)
          .expect(401)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.error).to.equal('User authentication token is expired');
            if (err) return done(err);
            done();
          });
      });

      it('should not generate numbers for a client with an invalid token', (done) => {
        request(app)
          .get(URL)
          .set('Authorization', `Bearer ${badToken}`)
          .expect(401)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.error).to.equal('Failed to authenticate token');
            if (err) return done(err);
            done();
          });
      });

      it('should not generate numbers for a client with a token with wrong user', (done) => {
        request(app)
          .get(URL)
          .set('Authorization', `Bearer ${wrongUserToken}`)
          .expect(401)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.error).to.equal('Failed to authenticate token');
            if (err) return done(err);
            done();
          });
      });
    });

    describe('Authorized user', () => {
      it('should generate numbers of default length in ascending order for an authorized client', (done) => {
        request(app)
          .get(URL)
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .end((err, res) => {
            const { status, body: { data } } = res;

            expect(status).to.equal(201);
            expect(data).to.have.property('numbers');
            expect(data).to.have.property('min');
            expect(data).to.have.property('max');
            expect(data).to.have.property('length').to.eql(5000);
            expect(data.numbers.length).to.equal(5000);
            expect(Boolean(data.numbers[4999] - data.numbers[0])).to.equal(true);

            if (err) return done(err);
            done();
          });
      });

      it('should generate numbers with count and default ascending order for an authorized client', (done) => {
        request(app)
          .get(`${URL}?count=50`)
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .end((err, res) => {
            const { status, body: { data } } = res;

            expect(status).to.equal(201);
            expect(data).to.have.property('numbers');
            expect(data).to.have.property('min');
            expect(data).to.have.property('max');
            expect(data).to.have.property('length').to.eql(50);
            expect(data.numbers.length).to.equal(50);
            expect(Boolean(data.numbers[49] - data.numbers[0])).to.equal(true);

            if (err) return done(err);
            done();
          });
      });

      it('should generate numbers with descending order and default count for an authorized client', (done) => {
        request(app)
          .get(`${URL}?sort=DESC`)
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .end((err, res) => {
            const { status, body: { data } } = res;

            expect(status).to.equal(201);
            expect(data).to.have.property('numbers');
            expect(data).to.have.property('min');
            expect(data).to.have.property('max');
            expect(data).to.have.property('length').to.eql(5000);
            expect(data.numbers.length).to.equal(5000);
            expect(Boolean(data.numbers[0] - data.numbers[4999])).to.equal(true);

            if (err) return done(err);
            done();
          });
      });

      it('should generate numbers with supplied order and count query for an authorized client', (done) => {
        request(app)
          .get(`${URL}?sort=DESC&count=10`)
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .end((err, res) => {
            const { status, body: { data } } = res;

            expect(status).to.equal(201);
            expect(data).to.have.property('numbers');
            expect(data).to.have.property('min');
            expect(data).to.have.property('max');
            expect(data).to.have.property('length').to.eql(10);
            expect(data.numbers.length).to.equal(10);
            expect(Boolean(data.numbers[0] - data.numbers[9])).to.equal(true);

            if (err) return done(err);
            done();
          });
      });

      it('should generate numbers of maximum count 10000 for an authorized client', (done) => {
        request(app)
          .get(`${URL}?count=10000`)
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .end((err, res) => {
            const { status, body: { data } } = res;

            expect(status).to.equal(201);
            expect(data).to.have.property('numbers');
            expect(data).to.have.property('min');
            expect(data).to.have.property('max');
            expect(data).to.have.property('length').to.eql(10000);
            expect(data.numbers.length).to.equal(10000);
            expect(Boolean(data.numbers[9999] - data.numbers[0])).to.equal(true);

            if (err) return done(err);
            done();
          });
      });

      it('should return validation error for invalid query', (done) => {
        request(app)
          .get(`${URL}?sort=DES&count=r`)
          .set('Authorization', `Bearer ${token}`)
          .expect(400)
          .end((err, res) => {
            const { status, body: { error } } = res;

            expect(status).to.equal(400);
            expect(error.sort[0]).to.equal('"sort" must be one of [ASC, DESC]');
            expect(error.count[0]).to.equal('"count" must be a number');

            if (err) return done(err);
            done();
          });
      });

      it('should return validation error for count query greater than 10000', (done) => {
        request(app)
          .get(`${URL}?sort=DES&count=50000`)
          .set('Authorization', `Bearer ${token}`)
          .expect(400)
          .end((err, res) => {
            const { status, body: { error } } = res;

            expect(status).to.equal(400);
            expect(error.count[0]).to.equal('"count" must be less than or equal to 10000');

            if (err) return done(err);
            done();
          });
      });

      it('should return validation error for count query less than 1', (done) => {
        request(app)
          .get(`${URL}?sort=DES&count=0`)
          .set('Authorization', `Bearer ${token}`)
          .expect(400)
          .end((err, res) => {
            const { status, body: { error } } = res;

            expect(status).to.equal(400);
            expect(error.count[0]).to.equal('"count" must be larger than or equal to 1');

            if (err) return done(err);
            done();
          });
      });
    });
  });

  describe('Download numbers', () => {
    it('should download last generated numbers', (done) => {
      request(app)
        .get(`${URL}/download`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          const { header } = res;

          expect(header['content-disposition']).to.equal('attachment; filename="numbers.txt"');
          expect(header['content-type']).to.equal('text/plain; charset=UTF-8');
          expect(header['accept-ranges']).to.equal('bytes');
          expect(Number(header['content-length'])).to.be.lessThan(4194304); // less than 4 MB

          if (err) return done(err);
          done();
        });
    });
  });
});