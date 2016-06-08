// @RedisHandler
// Author: Rijul Luman
// To read data from Redis in the desired format. 

var RedisHandler = {
  
  signIn: function(user, callback) {
    var token = CommonFunctions.createRandomString({length : 5}) + user._id + new Date().getTime().toString();

    RedisStoreMA.setex(redisPath.userLogIn + token, Constants.LOG_IN_EXPIRY, JSON.stringify(user) , function(err, reply){
      callback(err, token);
    });
  },

  isLoggedIn: function(token, callback) {
    RedisStoreSL.get(redisPath.userLogIn + token, function(err, reply){
      callback(err, reply);
    });
  },

//End of export   
}

module.exports = RedisHandler;