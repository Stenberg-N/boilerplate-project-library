/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let bookID;

suite('Functional Tests', function() {


  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({
            title: "Title"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');

            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            assert.property(res.body, "commentcount");

            assert.equal(res.body.title, "Title");
            assert.equal(res.body.commentcount, 0);

            bookID = res.body._id;

            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({
            // title: "Title"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');

            assert.deepEqual(res.body, { error: 'book title missing' });

            done();
          });
      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');

            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "title");
            assert.property(res.body[0], "commentcount");

            assert.equal(res.body[0].title, "Title");
            assert.equal(res.body[0].commentcount, 0);

            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get('/api/books/invalidBookID')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');

            assert.deepEqual(res.body, { error: 'no book exists' });

            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .get(`/api/books/${bookID}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');

            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            assert.property(res.body, "comments");

            assert.equal(res.body.title, "Title");
            assert.equal(res.body.comments.length, 0);

            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .post(`/api/books/${bookID}`)
          .send({
            comment: "Test comment"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');

            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            assert.property(res.body, "comments");

            assert.equal(res.body._id, bookID);
            assert.equal(res.body.title, "Title");
            assert.equal(res.body.comments[0], "Test comment");
            assert.equal(res.body.comments.length, 1);

            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .post(`/api/books/${bookID}`)
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');

            assert.deepEqual(res.body, { error: 'missing required field comment' });

            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post(`/api/books/invalidBookID`)
          .send({
            comment: "Test comment"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');

            assert.deepEqual(res.body, { error: 'no book exists' });

            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete(`/api/books/${bookID}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);

            assert.deepEqual(res.body, { result: 'book successfully deleted', bookid: bookID });

            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        let invalidBookID = "invalidBookID";
        chai
          .request(server)
          .delete(`/api/books/${invalidBookID}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);

            assert.deepEqual(res.body, { error: 'could not delete book', bookid: invalidBookID });

            done();
          });
      });

    });

  });

});
