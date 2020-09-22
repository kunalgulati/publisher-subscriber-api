const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('App Integration Tests', function () {
  context('Validator response and status code for /subscriber', function () {

    /** Route: /Subscribe/:topic */
    it('Should return status = 201 for correct Subscription Input', function (done) { // <= Pass in done callback
      chai.request('http://localhost:8000')
        .post('/subscribe/event')
        .type('application/json')
        .send('{ "url": "http://localhost:8000/event"}')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();                               
        });
    });

    it('Should return status = 400 and correct Error Message for in-correct Subscription Input (empty URL)', function (done) { // <= Pass in done callback
      chai.request('http://localhost:8000')
        .post('/subscribe/event')
        .type('application/json')
        .send('{ "url": ""}')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.error.text).to.be.equal("Request Rejected because no url was provided")
          done();                               
        });
    });

    /** Route: /Subscribe/:topic */
    it('Should return status = 200 and success message in body for correct Publishing POST Input', function (done) { // <= Pass in done callback
      chai.request('http://localhost:8000')
        .post('/publish/event')
        .type('application/json')
        .send('{ "message": "hello"}')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.body.message).to.be.equal("Succesfully published data to all the subscribers")
          expect(res).to.have.status(200);
          done();                               
        });
    });

    /** Route: /Subscribe/:topic */
    it('Should return Status = 400 for when empty object is passed as message', function (done) { // <= Pass in done callback
      chai.request('http://localhost:8000')
        .post('/publish/event')
        .type('application/json')
        .send('{}')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.body.message).to.be.equal("No message in the Publish (POST) request")
          expect(res).to.have.status(400);
          done();                               
        });
    });

    /** Route: /Subscribe/:topic */
    it('Should return Status = 200 for when pubish request when no subscribers exits for the Topic', function (done) { // <= Pass in done callback
      chai.request('http://localhost:8000')
        .post('/publish/noTopic')
        .type('application/json')
        .send('{ "message": "hello"}')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.body.message).to.be.equal("No subscribers exists for the Published Topic")
          expect(res).to.have.status(200);
          done();                               
        });
    });


  });
});
