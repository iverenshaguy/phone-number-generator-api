import sinon from 'sinon';
import { assert } from 'chai';
import errorHandler from '../../src/middlewares/errorHandler.middleware';

// mock server response
const res = {
  headersSent: false,
  status: status => ({
    json: message => ({ status, message })
  })
};

// mock server request
const req = {
  headers: 'header'
};

const err = {
  status: 400,
  message: 'error'
};

const next = sinon.spy();
const status = sinon.spy(res, 'status');

describe('Error Handler', () => {
  it('should handle errors with no headers sent', () => {
    errorHandler(err, req, res, next);

    assert(status.calledWith(400));
  });

  it('should handle errors with no headers sent and no status', () => {
    errorHandler({ message: 'error' }, req, res, next);

    assert(status.calledWith(500));
  });

  it('should handle errors with headers sent', () => {
    res.headersSent = true;
    errorHandler(err, req, res, next);

    assert(next.called);
  });
});
