'use strict';

var express = require('express'),
    gzippo = require('gzippo'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    moment = require('moment'),
    _ = require('underscore'),
    Retext = require('retext'),
    visit = require('retext-visit'),
    sentiment = require('retext-sentiment'),
    retext = new Retext().use(visit).use(sentiment),
    Twit = require('twit'),
    T = new Twit({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    }),
    app = express().set('port', process.env.PORT || 3000)
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended:true})).use(compression()),
    testdata = require('./testdata.js');

app.get('/api/collect', function(req,res) {
    res.json({hi:'hey'});
});

app.post('/api/collect', function(req,res) {
    //res.json(testdata);
    T.get('search/tweets', {q:req.body.search, count:100, language:'en'},
    function(err,data,response) {
        var statuses = [];
            if(data && data.statuses) {
            _.each(data.statuses, function(status) {
                var d = moment(Date.parse(status.created_at)); 
                retext.parse(status.text.replace(/(#|@)\w+|\n/ig,'neutral '), function(err, tree){
                    var newstatus = _.pick(status, 'id', 'created_at', 'text', 'retweet_count', 'favorite_count', 'entities', 'favorited', 'retweeted');
                    newstatus.user = _.pick(status.user, 'id', 'screen_name', 'url', 'followers_count', 'friends_count', 'listed_count', 'created_at', 'favorites_count', 'utc_offset', 'statuses_count', 'profile_image_url', 'profile_image_url_https');
                    newstatus.polarity = tree.data.polarity?tree.data.polarity:0;
                    statuses.push(newstatus);
                });
            });
        }
        res.json(statuses);
    });
});

//ANGULAR BIT
app.use('/scripts', gzippo.staticGzip(__dirname + '/../dist/scripts'));
app.use('/images', gzippo.staticGzip(__dirname + '/../dist/images'));
app.use('/styles', gzippo.staticGzip(__dirname + '/../dist/styles'));
app.use('/views', gzippo.staticGzip(__dirname + '/../dist/views'));
app.all('/*', function(req, res) {
  res.sendFile('index.html', {root: __dirname + '/../dist'});
});  


app.listen(app.get('port'), function(){
    console.log('server listening on ' + app.get('port'));
});
