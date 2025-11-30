/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

let books = []

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      const bookSummaries = books.map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: (book.comments || []).length
      }));

      res.json(bookSummaries);
    })

    .post(function (req, res){
      let title = req.body.title;

      if (!title) {
        return res.json({ error: 'book title missing' });
      }

      title = title.trim();
      if (title === '') {
        return res.json({ error: 'book title missing' });
      }

      const _id = Date.now().toString() + Math.random().toString(36).substring(2, 5);

      const newBook = {
        _id: _id,
        title: title,
        comments: []
      };
      books.push(newBook);
      res.json({ _id: _id, title: title, commentcount: 0});
    })

    .delete(function(req, res){
      books.length = 0
      res.json({ result: 'complete delete successful', books });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      const book = books.find(b => b._id === bookid);

      if (!book) {
        return res.json({ error: 'no book exists' });
      }

      res.json(book);
    })

    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment || comment.trim() === '') {
        return res.json({ error: 'missing required field comment' });
      }

      const book = books.find(b => b._id === bookid);

      if (!book) {
        return res.json({ error: 'no book exists' });
      }

      book.comments.push(comment.trim());

      res.json({ _id: book._id, title: book.title, comments: book.comments });
    })

    .delete(function(req, res){
      let bookid = req.params.id;

      if (!bookid) {
        return res.json({ error: 'missing id' });
      }

      const index = books.findIndex(b => b._id === bookid);
      if (index === -1) {
        return res.json({ error: 'could not delete book', bookid });
      }

      books.splice(index, 1);
      res.json({ result: 'book successfully deleted', bookid });
    });

};
