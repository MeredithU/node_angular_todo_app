
// set up
var express   = require('express');
var app       = express();              //create app using express
var mongoose  = require('mongoose');    // use mongoose for mongodb


// configuration
mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus

app.configure(function() {
  app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users
  app.use(express.logger('dev'));                     // log every request to the console
  app.use(express.bodyParser());                      // pull information from html in POST
  app.use(express.methodOverride());                 // simulate DELETE and PUT
});


// define model
var Todo = mongoose.model('Todo', {
  text : String
});


// routes
app.get('/api/todos', function(req, res) {

  // user mongoose to get all todos in the database
  Todo.find(function(err, todos) {

    // if there is an error retrieving, send the error
    if (err)
      res.send(err)

    res.json(todos); // return all todos in JSON format
  });
});


// create todo and send back all todos after creating
app.post('/api/todos', function(req, res) {

  // create a todo using a AJAX request from Angular
  Todo.create({
    text : req.body.text,
    done : false
  }, function(err, todo) {
    if(err)
      res.send(err);

    // get and return all the todos after you create another
    Todo.find(function(err, todos) {
      if(err)
        res.send(err)
      res.json(todos);
    });
  });
});


// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
  Todo.remove({
    _id : req.params.todo_id
  }, function(err, todo) {
    if(err)
      res.send(err);

    // get and return all the todos after you create another
    Todo.find(function(err, todos) {
      if(err)
        res.send(err)
      res.json(todos);
    });
  });
});


// load our index.html page as our home page
app.get('*', function(req, res) {
  res.sendfile('./public/index.html');  // load single view file
});



app.listen(8080);
console.log("App listening on port 8080");
