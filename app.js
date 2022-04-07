/******************************************************************************
***
* Group 9
* Web Technologies 
* Term project
* Audio book
*
******************************************************************************
**/

var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var request = require('request');
const exphbs = require('express-handlebars');
var port     = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

/**
 * Adding templating engine.
 */
app.engine('.hbs', exphbs.engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

mongoose.connect(database.url); // Connect with DB

var Book = require('./models/book');
require('./models/adminmodel');

// get all book data from db
app.get('/api/books', function(req, res) {
	// use mongoose to get all todos in the database
	Book.find(function(err, books) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		res.json(books); // return all employees in JSON format
	})
});

// get a book with ID
app.get('/api/books/:book_id', function(req, res) {
	let id = req.params.book_id;
	Book.findById(id, function(err, book) {
		if (err)
			res.send(err)
 
		res.json(book);
	});
 
});

// create book and send back all books after creation
app.post('/api/books', function(req, res) {

    // create mongose method to create a new record into collection
	console.log(req.body);

	var lastBookId = 0;
	request('http://localhost:8000/api/books', function(err, body){

		// getting all books.
		allBooks = JSON.parse(body.body);

		// getting last book id from all books.
		lastBookId = allBooks[allBooks.length - 1]._id;

		Book.create({
			_id: lastBookId + 1,
			title : req.body.title,
			isbn : req.body.isbn,
			pageCount : parseInt(req.body.pageCount),
			publishedDate : new Date(req.body.publishedDate), // example date is 2017-06-01.
			thumbnailUrl : req.body.thumbnailUrl,
			shortDescription : req.body.shortDescription,
			longDescription : req.body.longDescription,
			status : req.body.status,
			authors : [
				req.body.author_0, 
				req.body.author_1, 
				req.body.author_2, 
				req.body.author_3, 
				req.body.author_4
			],
			categories : [
				req.body.category_0, 
				req.body.category_1, 
				req.body.category_2, 
				req.body.category_3, 
				req.body.category_4
			]
		}, function(err, employee) {
			if (err)
				res.send(err);
	 
			// get and return all the employees after newly created employe record
			Book.find(function(err, books) {
				if (err)
					res.send(err)
				res.json(books);
			});
		});
	});
});


// create employee and send back all employees after creation
app.put('/api/books/:book_id', function(req, res) {
	// create mongose method to update an existing record into collection

	let id = req.params.book_id;
	var data = {
		title : req.body.title,
		isbn : req.body.isbn,
		pageCount : (req.body.pageCount) ? parseInt(req.body.pageCount) : '',
		publishedDate : req.body.publishedDate,
		thumbnailUrl : req.body.thumbnailUrl,
		shortDescription : req.body.shortDescription,
		longDescription : req.body.longDescription,
		status : req.body.status,
		authors : [
			req.body.author_0,
			req.body.author_1,
			req.body.author_2,
			req.body.author_3,
			req.body.author_4
		],
		categories : [
			req.body.category_0,
			req.body.category_1,
			req.body.category_2,
			req.body.category_3,
			req.body.category_4
		]
	}

	// save the book
	Book.findByIdAndUpdate(id, data, function(err, book) {
	    if (err) throw err;
    	res.send('Successfully! Book updated - ' + book.title);
	});
});

// delete a book by id
app.delete('/api/books/:book_id', function(req, res) {
	let id = req.params.book_id;
	Book.remove({
		_id : id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Book has been Deleted.');	
	});
});

/**
 * @api {get} / Rendring index.hbs
 */
 app.get('/', function (req, res) {
    res.render('index', { title: 'Audio Books - HOME', data: 'Welcome to Audio Books Management System' });
});

/**
 * @api {get} /app/show-all-books Rendring books.hbs
 */
app.get('/app/show-all-books', function (req, res) {
	request('http://localhost:8000/api/books', function(err, body){
		// getting all books.
		data = JSON.parse(body.body);
		res.render('books', { title: 'Books', data: data });		
	});
});

/**
 * @api {get} /app/insert-a-book Rendring add-books.hbs
 */
app.get('/app/insert-a-book', function (req, res) {
    res.render('addBook', { title: 'Add Book' });
});

/**
 * @api {post} /app/insert-a-book Rendring books.hbs
 */
app.post('/app/insert-a-book', function (req, res) {
	console.log(req.body);
	var postedBody = req.body;
	request.post({
		headers: {'content-type' : 'application/json'},
		url:     'http://localhost:8000/api/books',
		body:    postedBody,
		json:	 true
	}, function(error, response, body){
		console.log(body);
		// var data = JSON.parse(body.body);	
		// res.render('books', { title: 'Asn3 - Books', data: data.reverse() });	
		res.render('index', { title: 'Books'});
	});

});

/* ___________________________________________________________________________________________
______________________________ADMIN PANEL DATA________________________________________________
___________________________________________________________________________________________ */
var adminController = require('./controllers/admincontroller');
// app.get('/admin',function(req,res){
// });

/* ___________________________________________________________________________________________
___________________________________________________________________________________________ */

app.listen(port);
console.log("App listening on port : " + port);
