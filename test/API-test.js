const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// lets us use THING.should.equal(CORRECT_ANSWER) idiom
const should = chai.should();

// This is what lets us do HTTP request testing
chai.use(chaiHttp);


