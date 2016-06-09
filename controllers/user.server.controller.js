// @user.server.controller
// Author: Rijul Luman

'use strict';

/**
 * Require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
  // console.log("Auth: ", req.isAuthenticated());
  // console.log("Session: ", req.session);
  if (!req.user) {
    ErrorCodeHandler.getErrorJSONData({'code':10, 'res':res});
    return;
  }
  else{
    next();
  }
};

/**
 * Require authentication middleware
 */
exports.logIn = function (req, res, next) {
  var data = null;
  if(Object.keys(req.body).length != 0){ // && obj.constructor === Object
    data = req.body;
  }
  else if(Object.keys(req.query).length != 0){
    data = req.query;
  }
  if(!data || !data.token) {
    ErrorCodeHandler.getErrorJSONData({'code':7, 'res':res});
    return;
  }
  else{
    RedisHandler.isLoggedIn(data.token, function(err, user){
      if(err){
        ErrorCodeHandler.getErrorJSONData({'code':3, 'res':res});
        return;
      }
      else if(!user || user.length < 1){
        ErrorCodeHandler.getErrorJSONData({'code':8, 'res':res});
        return;
      }
      else{
        user = JSON.parse(user);
        userCollection.findOne({_id : ObjectId(user._id)}, function(err, doc){
          req.user = doc;
          next();
        });
      }
    });
  }
  
};

exports.signup = function (req, res, next) {
  res.set({
          'Content-Type'  :   'application/json'
      });
  var data = req.body;

  // Compulsory
  var username = (typeof(data.username) !== "undefined")
    ? data.username.trim().toLowerCase()
    : "";
  var password = (typeof(data.password) !== "undefined")
    ? data.password.trim()
    : "";
  var verifyPassword = (typeof(data.verifyPassword) !== "undefined")
    ? data.verifyPassword.trim()
    : "";
  var admin = (typeof(data.admin) !== "undefined")
    ? data.admin.trim()
    : false;

  if( 
      CommonFunctions.isNull(username)  ||
      CommonFunctions.isNull(password)  ||
      CommonFunctions.isNull(verifyPassword) 
    ){
    ErrorCodeHandler.getErrorJSONData({'code':1, 'res':res});
    return;
  }

  if(password != verifyPassword){
    ErrorCodeHandler.getErrorJSONData({'code':4, 'res':res});
    return;
  }

  var succResp = {
    data : "",
    error : {
      code: 0,
      text : "Sign up successful"
    }
  };

  userCollection.findOne({username : username}, function(err, doc){
    if(err){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
      return;
    }
    else if(doc){
      ErrorCodeHandler.getErrorJSONData({'code':5, 'res':res});
      return;
    }
    else{
      var userObj = {
        username : username,
        password : password,
        created : new Date()
      };
      if(admin == true || admin == 'true'){
        userObj.admin = true;
      }
      userCollection.insert(userObj, function(err, reply){
        if(err || !reply || reply.result.ok < 1){
          ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
          return;
        }
        else{
          succResp.data = {
            userId : reply.ops[0]._id
          };
          res.status(200).send(succResp);
        }
      });
    }
  });
};

exports.signin = function (req, res, next) {
  res.set({
          'Content-Type'  :   'application/json'
      });
  var data = req.body;

  // Compulsory
  var username = (typeof(data.username) !== "undefined")
    ? data.username.trim().toLowerCase()
    : "";
  var password = (typeof(data.password) !== "undefined")
    ? data.password.trim()
    : "";

  if( 
      CommonFunctions.isNull(username)  ||
      CommonFunctions.isNull(password)  
    ){
    ErrorCodeHandler.getErrorJSONData({'code':1, 'res':res});
    return;
  }

  userCollection.findOne({username : username, password : password}, {password : 0}, function(err, user){
    if(err){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
      return;
    }
    else if(!user){
      ErrorCodeHandler.getErrorJSONData({'code':6, 'res':res});
      return;
    }
    else{
      RedisHandler.signIn(user, function(err, token){
        if(err){
          ErrorCodeHandler.getErrorJSONData({'code':3, 'res':res});
          return;
        }
        else{
          var succResp = {
            data : {
              token : token
            },
            error : {
              code: 0,
              text : "Sign in successful"
            }
          };
          res.status(200).send(succResp);
        }
      });
    }
  });
};

exports.sendDetails = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });

  var succResp = {
    data : req.user,
    error : {
      code: 0,
      text : ""
    }
  };

  res.status(200).send(succResp);
  
};