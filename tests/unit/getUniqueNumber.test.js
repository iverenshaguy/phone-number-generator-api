import sinon from 'sinon';
import { assert } from 'chai';

import * as generateNumber from '../../src/utils/generateNumber';
import getUniqueNumber from '../../src/utils/getUniqueNumber';

describe('Unique Number Generator', () => {
  it('should try to generate another number if previous data already contains the generated number', () => {
    const stub = sinon.stub(generateNumber, 'default');
    stub.onCall(0).returns(1);
    stub.onCall(1).returns(5);

    getUniqueNumber([1, 2]);

    assert(stub.calledTwice);
    stub.restore();
  });

  it('should not try to generate another number if previous data does not contain the generated number', () => {
    const stub = sinon.stub(generateNumber, 'default').returns(5);
    getUniqueNumber([1, 2]);

    assert(stub.calledOnce);
    stub.restore();
  });
});
