  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  var config                 =    require("./config/" + process.env.NODE_ENV + ".json");
  // listening port for Express/http server
  const PORT            =   config.express_port;
  // mongo config
  const MONGO_URL               = config.mongo_url;
  const MONGO_COLL_POLLS        = config.mongo_coll_polls;
  const MONGO_COLL_TAGS         = config.mongo_coll_tags;
  const MONGO_COLL_BLK_WORDS    = config.mongo_coll_blk_words;
  const MONGO_COLL_VOTERS       = config.mongo_coll_voters;
  const MONGO_COLL_REPORTS      = config.mongo_coll_reports;
  const MONGO_COLL_SHARES       = config.mongo_coll_shares;
  const MONGO_COLL_LIKE_DISLIKE = config.mongo_coll_like_dislike;
  const MONGO_COLL_FOLLOWERS    = config.mongo_coll_followers;
  const MONGO_COLL_USERS        = config.mongo_coll_users;
  const MONGO_COLL_ADMIN        = config.mongo_coll_admin;
  const MONGO_COLL_VIEWS        = config.mongo_coll_views;

// @MongoIndex
var MongoIndex = {
  // add index
  addIndexes : function(collection_name, indexes){
    mongoConnection.collection(collection_name).ensureIndex( indexes, function(err, index_info){
      console.log('Set Indexes for - ',collection_name);  
      console.log('err - ',err);
      console.log('Index info - ',index_info);  
      console.log('-----------------------------------'); 
    });
  },
  
  // add index
  getIndexes : function(collection_name){
    mongoConnection.collection(collection_name).indexInformation(function(err, index_info){
      console.log('Get Indexes for - ',collection_name);  
      console.log('err - ',err);  
      console.log('Index info - ',index_info);
      console.log('-----------------------------------'); 
    });
  },
}

/**
 * Mongo DB
 */ 
var MongoClient = require('mongodb').MongoClient;
var mongoConnection       =   null;

MongoClient.connect(MONGO_URL, function(err, db) {
  if(err) throw err;
  
  // save mongo connection
  mongoConnection       =   db;

  /*
  // Drop index
  mongoConnection.collection(mongo_coll_social_action).dropIndexes(function(err, dropped){
    console.log('Removed Indexes - ',dropped);    
  });
  */
  
   // Add indexes
  MongoIndex.addIndexes(MONGO_COLL_POLLS, {status:1});
  MongoIndex.addIndexes(MONGO_COLL_POLLS, {pollType:1});
  MongoIndex.addIndexes(MONGO_COLL_POLLS, {"timestamp.insert":-1});
  MongoIndex.addIndexes(MONGO_COLL_POLLS, {"timestamp.expire":1});
  MongoIndex.addIndexes(MONGO_COLL_TAGS, {tag:1});
  MongoIndex.addIndexes(MONGO_COLL_USERS, {email:1});
  MongoIndex.addIndexes(MONGO_COLL_VOTERS, {"timestamp.insert":-1});
  
  // Get indexes
  setTimeout(function(){
    MongoIndex.getIndexes(MONGO_COLL_POLLS);
    MongoIndex.getIndexes(MONGO_COLL_TAGS);
    MongoIndex.getIndexes(MONGO_COLL_USERS);
    MongoIndex.getIndexes(MONGO_COLL_VOTERS);
  }, 2000);
});