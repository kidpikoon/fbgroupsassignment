// @feed.server.controller
// Author: Rijul Luman

'use strict';

exports.addGroup = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });
  var data = req.body;

  // Compulsory
  var userId = (typeof(data.userId) !== "undefined")
    ? data.userId.trim().toLowerCase()
    : "";
  var name = (typeof(data.name) !== "undefined")
    ? data.name.trim()
    : "";
  // other details here

  if( 
      CommonFunctions.isNull(userId)  ||
      CommonFunctions.isNull(name)
    ){
    ErrorCodeHandler.getErrorJSONData({'code':1, 'res':res});
    return;
  }

  if(!CommonFunctions.isMongoId(userId)){
    ErrorCodeHandler.getErrorJSONData({'code':13, 'res':res});
    return;
  }

  var succResp = {
    data : "",
    error : {
      code: 0,
      text : "Group created successfully"
    }
  };

  userCollection.findOne({userId : ObjectId(userId)}, function(err, doc){
    if(err){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
      return;
    }
    else if(doc){
      ErrorCodeHandler.getErrorJSONData({'code':13, 'res':res});
      return;
    }
    else{
      var groupObj = {
        userId : ObjectId(userId),
        name : name,
        created : new Date()
      };

      groupCollection.insert(groupObj, function(err, reply){
        if(err || !reply || reply.result.ok < 1){
          ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
          return;
        }
        else{
          var groupId = reply.ops[0]._id;
          var updateQuery = {
            $push : {
              admin : ObjectId(groupId)
            }
          };
          userCollection.update(userObj, function(err, reply){
            if(reply.result.nModified < 1){
              ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
              return;
            }
            else{
              succResp.data = {
                groupId : groupId
              };
              res.status(200).send(succResp);
            }
          });
        }
      });
    }
  });
};

/**
 * get group info middleware
 */
exports.getGroup = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });

  var groupId = (typeof(req.params.groupId) !== "undefined")
    ? req.params.groupId.trim().toLowerCase()
    : "";

  if(!CommonFunctions.isMongoId(groupId)){
    ErrorCodeHandler.getErrorJSONData({'code':14, 'res':res});
    return;
  }

	var findQuery = {
		groupId : ObjectId(groupId)
	};

	groupCollection.findOne(findQuery, function(err, doc){
		if(err){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
      return;
    }
    else if(!doc){
      ErrorCodeHandler.getErrorJSONData({'code':14, 'res':res});
      return;
    }
    else{
      req.group = doc;
      next();
    }
	});
};

/**
 * Check if user is Group Admin middleware
 */
exports.isGroupAdmin = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });

  var groupId = req.group._id;

  if(!CommonFunctions.isMongoId(groupId)){
    ErrorCodeHandler.getErrorJSONData({'code':14, 'res':res});
    return;
  }

  if(!user.admin || user.admin.indexOf(groupId) == -1){
    ErrorCodeHandler.getErrorJSONData({'code':14, 'res':res});
    return;
  }
  else{
    next();
  }
};