// @group.server.controller
// Assumption : Groups can be created and viewed by any user, groups admins can be added only by a group admin
// Author: Rijul Luman

'use strict';

exports.addGroup = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });
  var data = req.body;

  // Compulsory
  var userId = req.user._id;
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

  var groupObj = {
    userId : ObjectId(userId),
    name : name,
    created : new Date()
  };
  var group = new Group(groupObj);
  group.save(function(err, reply){
    if(err || !reply){
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
      User.collection.update({_id : ObjectId(userId)}, updateQuery, function(err, reply){
        if(err || reply.result.nModified < 1){
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
};

/**
 * get group info middleware
 */
exports.getGroup = function (req, res, next) {
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

	Group.findById(groupId).exec(function(err, doc){
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
exports.isGroupAdmin = function (req, res, next) {
  res.set({
          'Content-Type'  :   'application/json'
      });

  var groupId = req.group._id;
  var isAdmin = CommonFunctions.isGroupAdmin(req);
  
  if(!isAdmin){
    ErrorCodeHandler.getErrorJSONData({'code':15, 'res':res});
    return;
  }
  else{
    next();
  }
};


exports.addAdmin = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });
  var data = req.body;

  // Compulsory
  var groupId = req.group._id;
  var userId = (typeof(data.userId) !== "undefined")
    ? data.userId.trim().toLowerCase()
    : "";
  var admin = (typeof(data.admin) !== "undefined")
    ? data.admin.trim()
    : "";
  // other details here

  if( 
      CommonFunctions.isNull(userId)  ||
      CommonFunctions.isNull(admin)
    ){
    ErrorCodeHandler.getErrorJSONData({'code':1, 'res':res});
    return;
  }

  if(!CommonFunctions.isMongoId(userId)){
    ErrorCodeHandler.getErrorJSONData({'code':13, 'res':res});
    return;
  }

  if(admin != 'true' && admin != 'false'){
    ErrorCodeHandler.getErrorJSONData({'code':16, 'res':res});
    return;
  }

  if(admin == 'true' || admin == true){
    admin = true;
  }
  else{
    admin = false;
  }

  var succResp = {
    data : "",
    error : {
      code: 0,
      text : "Group Admin set successfully"
    }
  };

  User.findOne({_id : ObjectId(userId)}).exec(function(err, doc){
    if(err){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
      return;
    }
    else if(!doc){
      ErrorCodeHandler.getErrorJSONData({'code':13, 'res':res});
      return;
    }
    else{
      var isAdmin = CommonFunctions.isGroupAdmin(req);

      var updateQuery;
      if(admin && !isAdmin){
        updateQuery = {
          $push : {
            admin : ObjectId(groupId)
          }
        };
      }
      else if(!admin && isAdmin){
        updateQuery = {
          $pull : {
            admin : ObjectId(groupId)
          }
        };
      }
      else{
        ErrorCodeHandler.getErrorJSONData({'code':17, 'res':res});
        return;
      }

      User.collection.update({_id : ObjectId(userId) }, updateQuery, function(err, reply){
        if(err || reply.result.nModified < 1){
          ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
          return;
        }
        else{
          succResp.data = {
            groupId : groupId,
            userId : userId
          };
          res.status(200).send(succResp);
        }
      });
    }
  });
};