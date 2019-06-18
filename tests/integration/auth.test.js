import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app';
import { user, userWithWrongPassword, unexistingUser } from '../helpers/fixtures';

const URL = '/api/v1/auth';
describe('Auth Routes', () => {
  it('should log in an existing user', (done) => {
    request(app)
      .post(`${URL}/signin`)
      .send(user)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.have.property('token');
        if (err) return done(err);
        done();
      });
  });

  it('should return joi validation errrors for bad payload', (done) => {
    request(app)
      .post(`${URL}/signin`)
      .send({ userId: '', password: '' })
      .expect(400)
      .end((err, res) => {
        const { status, body } = res;
        expect(status).to.equal(400);
        expect(body.error.userId[0]).to.equal('"userId" is not allowed to be empty');
        expect(body.error.password[0]).to.equal('"password" is not allowed to be empty');
        if (err) return done(err);
        done();
      });
  });

  it('should not log in an unexisting user', (done) => {
    request(app)
      .post(`${URL}/signin`)
      .send(unexistingUser)
      .expect(401)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('error').equal('Invalid credentials');
        if (err) return done(err);
        done();
      });
  });

  it('should not log in a user with wrong password', (done) => {
    request(app)
      .post(`${URL}/signin`)
      .send(userWithWrongPassword)
      .expect(401)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('error').equal('Invalid credentials');
        if (err) return done(err);
        done();
      });
  });
});