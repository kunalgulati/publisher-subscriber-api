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
          expect(res.body.body).to.be.equal("Succesfully published data to all the subscribers")
          expect(res).to.have.status(200);
          done();                               
        });
    });

    /** Route: /Subscribe/:topic */
    it('Should return status = 400 and error message in body for in-correct Publishing POST as Input', function (done) { // <= Pass in done callback
      chai.request('http://localhost:8000')
        .post('/publish/event')
        .type('application/json')
        .send('{}')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.body.body).to.be.equal("Succesfully published data to all the subscribers")
          expect(res).to.have.status(200);
          done();                               
        });
    });

    /** Route: /Publish/:topic */
    // it('Should return status = 200', function (done) { // <= Pass in done callback
    //   chai.request('http://localhost:8000')
    //     .post('/publish/event')
    //     .type('application/json')
    //     .send('{ "message": ""}')
    //     .end(function (err, res) {
    //       expect(err).to.be.null;
    //       expect(res).to.have.status(200);
    //       done();                               
    //     });
    // });

    // it('Should return status = 200 for queryString with Direction field', function (done) { // <= Pass in done callback
    //   chai.request('http://localhost:4000')
    //     .get('/api/posts?tags="direction=asc')
    //     .end(function (err, res) {
    //       expect(err).to.be.null;
    //       expect(res).to.have.status(200);
    //       expect(res).to.be.json;
    //       done();                               // <= Call done to signal callback end
    //     });
    // });

    // it('Should return status = 200 for queryString with SortBy field', function (done) { // <= Pass in done callback
    //   chai.request('http://localhost:4000')
    //     .get('/api/posts?tags="sortBy="likes')
    //     .end(function (err, res) {
    //       expect(err).to.be.null;
    //       expect(res).to.have.status(200);
    //       expect(res).to.be.json;
    //       done();                               // <= Call done to signal callback end
    //     });
    // });

    // it('Should return status = 400 for queryString with No Tags field', function (done) { // <= Pass in done callback
    //   chai.request('http://localhost:4000')
    //     .get('/api/posts')
    //     .end(function (err, res) {
    //       expect(res).to.have.status(400);
    //       expect(res).to.be.json
    //       expect(res.body).to.deep.equal({ error: "Tags parameter is required" });
    //       done();                               // <= Call done to signal callback end
    //     });
    // });

    // it('Should return status = 400 for queryString with Wrong SortBy parameter', function (done) { // <= Pass in done callback
    //   chai.request('http://localhost:4000')
    //     .get('/api/posts?tags=history&sortBy=wrong')
    //     .end(function (err, res) {
    //       expect(res).to.have.status(400);
    //       expect(res).to.be.json
    //       expect(res.body).to.deep.equal({ error: "sortBy parameter is invalid" });
    //       done();                               // <= Call done to signal callback end
    //     });
    // });

    // it('Should return status = 400 for queryString with Wrong Direction parameter', function (done) { // <= Pass in done callback
    //   chai.request('http://localhost:4000')
    //     .get('/api/posts?tags=history&sortBy=id&direction=down')
    //     .end(function (err, res) {
    //       expect(res).to.have.status(400);
    //       expect(res).to.be.json
    //       expect(res.body).to.deep.equal({ error: "direction parameter is invalid" });
    //       done();                               // <= Call done to signal callback end
    //     });
    // });


  });
});
