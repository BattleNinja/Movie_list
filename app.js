const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser());

app.get('/', (req, res, next) => {
  res.render('home')
});
app.get('/newmovie', (req, res, next) => {
  res.render('newmovie')
});
//add the new mieve information into Mongodb
app.post('/savemovie', (req, res, next) => {
  const url = 'mongodb://localhost:27017/videos'
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err)
    } else {
      console.log('successfully connect to mongodb');
      db.collection('movies').insert(req.body, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          res.redirect('/display')
        }
        db.close();
        console.log('close DB')

      });
    }
  });
});
app.get('/display', (req, res, next) => {
  const url = 'mongodb://localhost:27017/videos'
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err)
    } else {
      console.log('successfully connect to db')
      db.collection('movies').find({}).toArray((err, movies) => {
        if (err) {
          console.log(err)
        } else if (movies.length === 0) {
          res.send('No movie was found')
        } else {
          res.render('display', {
            'movies': movies
          })
          db.close();
          console.log('close DB')
        }
      });
    }
  });
});




const server = app.listen(3000, () => {
  console.log('Server is listening to port %s', server.address().port)
});
