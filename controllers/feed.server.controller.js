// @feed.server.controller
// Assumption : Feeds can be added by any user
// Author: Rijul Luman

'use strict';

exports.addFeed = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });
  var data = req.body;

  // Compulsory
  var userId = req.user._id;
  var groupId = (typeof(req.params.groupId) !== "undefined")
    ? req.params.groupId.trim().toLowerCase()
    : "";
  var message = (typeof(data.message) !== "undefined")
    ? data.message.trim()
    : "";
  var link = (typeof(data.link) !== "undefined")
    ? data.link.trim()
    : "";

  if( 
      CommonFunctions.isNull(userId)    ||
      CommonFunctions.isNull(message)   ||
      CommonFunctions.isNull(link)     	||
      CommonFunctions.isNull(groupId)
    ){
    ErrorCodeHandler.getErrorJSONData({'code':1, 'res':res});
    return;
  }

  var succResp = {
    data : "",
    error : {
      code: 0,
      text : "Feed added successfully"
    }
  };

  var feedObj = {
    userId : ObjectId(userId),
    groupId : ObjectId(groupId),
    message : message,
    link : link,
    created : new Date()
  };

  feedCollection.insert(feedObj, function(err, reply){
    if(err || !reply || reply.result.ok < 1){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
      return;
    }
    else{
      succResp.data = {
        feedId : reply.ops[0]._id
      };
      res.status(200).send(succResp);
    }
  });
};

exports.getFeeds = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });
  var data = req.body;

  var timestamp = (typeof(data.timestamp) !== "undefined")
    ? data.timestamp.trim().toLowerCase()
    : "";
  var limit = (typeof(data.limit) !== "undefined") 
    ? parseInt(data.limit.trim(), 10)
    : 0;
  limit = isNaN(limit)
    ? 0 
    : limit;
  var groupId = (typeof(req.params.groupId) !== "undefined")
    ? req.params.groupId.trim().toLowerCase()
    : "";

  if(timestamp != ''){
	  try{
	  	timestamp = new Date(timestamp);
	  }
	  catch(e){
	  	ErrorCodeHandler.getErrorJSONData({'code':12, 'res':res});
			return;
	  }
	}

	var findQuery = {
		groupId : ObjectId(groupId)
	};

	if(timestamp != ''){
		limit = 0;
		findQuery.created = { $gt : timestamp };
	}

	var succResp = {
    data : "",
    error : {
      code: 0,
      text : ""
    }
  };

	feedCollection.find(findQuery).limit(limit).sort({created : -1}).toArray(function(err, docs){
		if(err){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
      return;
    }
    else{
      succResp.data = {
        feeds : docs,
        feedCount : docs.length
      };
      res.status(200).send(succResp);
    }
	});
  
};