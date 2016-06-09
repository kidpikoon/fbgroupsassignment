
// Start/Listen express in cluster mode
var cluster = require('cluster');
var cron = null;
// Master process
if (cluster.isMaster) {
  // var cron = require('./controllers/cron');
  // Count the machine's CPUs

  var cpuCount = require('os').cpus().length;
  console.log('Total CPU Cores - ', cpuCount);
  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i++) {    
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', function (worker) {
    console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();
  });
}
// Worker process
else {
  /**
   * Required configs
   */
  // Load with hotload
  //var hotload = require("hotload");
  // config vars
  global.Constants  =   require("./config/constants.json");

  // Extract from config
  // Env mode
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  if (process.env.NODE_ENV == "production") {
    // require('newrelic');
  }

  var config                 =    require("./config/" + process.env.NODE_ENV + ".json");
  // listening port for Express/http server
  const PORT            =   config.express_port;
  // mongo config
  const MONGO_URL               = config.mongo_url;
  // const MONGO_COLL_USERS        = config.mongo_coll_users;
  // const MONGO_COLL_FEEDS        = config.mongo_coll_feeds;
  // const MONGO_COLL_EVENTS       = config.mongo_coll_events;
  // const MONGO_COLL_DOCS         = config.mongo_coll_docs;
  // const MONGO_COLL_ALBUMS       = config.mongo_coll_albums;
  // const MONGO_COLL_GROUPS       = config.mongo_coll_groups;

  // redis config
  // var redisConfigParam    =   config;
  const REDIS_MA_HOST        =   config.redis.MA.host;
  const REDIS_MA_PORT        =   config.redis.MA.port;
  const REDIS_SL_HOST        =   config.redis.SL.host;
  const REDIS_SL_PORT        =   config.redis.SL.port;
  global.redisPath           =   Constants.redisPath;

  // file system path for images 
  global.imagePath           = config.imagePath;

  /**
   * Express
   */
  global.express        =   require('express');
  global.app            =   express();

  /**
   * @Express Configurations
   */
  // Parse urlencoded request bodies into req.body
  var bodyParser          =   require('body-parser');
  app.use(bodyParser.urlencoded({extended:false}));
  // parse application/json
  app.use(bodyParser.json());

  // Enable CORS - Cross-Origin Request Services
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  /**
   * Redis
   * Setting & Configurations
   */
  var redis           =   require('redis');  
  global.RedisStoreMA =   redis.createClient(REDIS_MA_PORT,REDIS_MA_HOST,{no_ready_check:true});
  global.RedisStoreSL =   redis.createClient(REDIS_SL_PORT,REDIS_SL_HOST,{no_ready_check:true});

  // on connection error
  RedisStoreMA.on("error", function (err) {
    console.log("Redis Master Connection Error - ", err);
    throw err;
  });
  RedisStoreSL.on("error", function (err) {
    console.log("Redis Slave Connection Error - ", err);
    throw err;
  });
  //redis.debug_mode = true;

  // Root / Starting Point
  app.get('/', function (req, res, next) {  
    res.send('Welcome!'); 
  });

  // Listen to port
  var server = app.listen(PORT, function () {

    var lHost = server.address().address;
    var lPort = server.address().port;
    
    console.log('App listening at http://%s:%s', lHost, lPort);
    console.log('Worker ' + cluster.worker.id + ' running!');
  });

  /**
   * Mongo DB
   */
  var MongoClient         =   require('mongodb').MongoClient;
  global.ObjectId         =   require('mongodb').ObjectID;
  // global.mongoConnection       = null;
  global.User        = null;
  global.Feed        = null; 
  global.Event       = null; 
  global.Album       = null; 
  global.Docs        = null; 
  global.Group       = null; 

  var mongooseConn = require('mongoose');
  var mongoose;

  var connect = function(db) {
    var safe = { j: 1, w: "majority", wtimeout: 7000 }; // 7000 for 7 secs
    mongoose = mongooseConn.createConnection( db, { auto_reconnect: true , safe : safe});
  };

  // Require all mongoose models
  var models_path = __dirname + '/models';
  var fs = require('fs');
  fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
  })

  // Bootstrap db connection
  var isConnectedBefore = false;
  
  connect(MONGO_URL);
  mongoose.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    if(!isConnectedBefore){
      connect(db);
    }
  });

  mongoose.on('connected', function() {
      isConnectedBefore = true;
      console.log('Connection established to MongoDB');
  });

  mongoose.on('reconnected', function () {
    console.log('MongoDB reconnected!');
  });

  mongoose.once('open', function(){
    User        = mongoose.model('User');
    Feed        = mongoose.model('Feed');
    Event       = mongoose.model('Event');
    Album       = mongoose.model('Album');
    Docs        = mongoose.model('Docs');
    Group       = mongoose.model('Group');
  });

  // MongoClient.connect(MONGO_URL, function(err, db) {  
  //   // on error
  //   if(err) {
  //     console.log("Mongo Connection Error - ", err);
  //     throw err;
  //   }

  //   //console.log(db.serverConfig.connections().length);
  //   //console.log(db.serverConfig);
    
  //   // save mongo connection
  //   mongoConnection       =   db;
    
  //   // set collection
  //   userCollection         = mongoConnection.collection(MONGO_COLL_USERS);
  //   feedCollection         = mongoConnection.collection(MONGO_COLL_FEEDS);
  //   eventCollection        = mongoConnection.collection(MONGO_COLL_EVENTS);
  //   albumCollection        = mongoConnection.collection(MONGO_COLL_ALBUMS);
  //   docsCollection         = mongoConnection.collection(MONGO_COLL_DOCS);
  //   groupCollection        = mongoConnection.collection(MONGO_COLL_GROUPS);

  //   // mongo db started
  //   console.log('Mongo DB Started');
  // });

  /**
   * Other Required Module
   */
  // For Validation of data
  //global.validator      =   require('validator');
  // Common functions
  global.CommonFunctions    =   require('./controllers/common');
  // For Handling Error Codes
  global.ErrorCodeHandler   =   require('./handler/errorCode');
  // Redis Handler
  global.RedisHandler     =   require('./handler/redis');
  // Redis Flush Handler
  global.RedisFlushHandler  =   require('./handler/redisFlush');

  // Add Routes
  // For APIs

  require('./routes/user.server.routes')(app);
  require('./routes/feed.server.routes')(app);
  require('./routes/group.server.routes')(app);
  require('./routes/album.server.routes')(app);
  require('./routes/doc.server.routes')(app);

  //
  // For webiste
  // app.use('/website', express.static(__dirname+'/admin-panel'));

}
