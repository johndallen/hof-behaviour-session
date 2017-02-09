'use strict';

const chai = require('chai');

global.sinon = require('sinon');

chai.use(require('sinon-chai'));
chai.should();

global.expect = chai.expect;
