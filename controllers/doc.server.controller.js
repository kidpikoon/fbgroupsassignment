// @doc.server.controller
// Assumption : Docs can be viewed by any user, only admins can add docs  
// Author: Rijul Luman

'use strict';

exports.addDoc = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });
  var data = req.body;

  // Compulsory
  var userId = req.user._id;
  var groupId = req.group._id;
  var subject = (typeof(data.subject) !== "undefined")
    ? data.subject.trim()
    : "";
  var message = (typeof(data.message) !== "undefined")
    ? data.message.trim()
    : "";
  var icon = (typeof(data.icon) !== "undefined")
    ? data.icon.trim().toLowerCase()
    : "";

  if( 
      CommonFunctions.isNull(subject)   ||
      CommonFunctions.isNull(message)   ||
      CommonFunctions.isNull(icon)
    ){
    ErrorCodeHandler.getErrorJSONData({'code':1, 'res':res});
    return;
  }

  var succResp = {
    data : "",
    error : {
      code: 0,
      text : "Doc added successfully"
    }
  };

  var docObj = {
    userId : ObjectId(userId),
    groupId : ObjectId(groupId),
    subject : subject,
    icon : icon,
    created : new Date(),
    updated : new Date()
  };

  docsCollection.insert(docObj, function(err, reply){
    if(err || !reply || reply.result.ok < 1){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
      return;
    }
    else{
      succResp.data = {
        docId : reply.ops[0]._id
      };
      res.status(200).send(succResp);
    }
  });
};

exports.getDocs = function (req, res) {
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
  var groupId = req.group._id;

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
		findQuery.updated = { $gt : timestamp };
	}

	var succResp = {
    data : "",
    error : {
      code: 0,
      text : ""
    }
  };

	docsCollection.find(findQuery).limit(limit).sort({updated : -1}).toArray(function(err, docs){
		if(err){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res});
      return;
    }
    else{
      succResp.data = {
        docs : docs,
        docsCount : docs.length
      };
      res.status(200).send(succResp);
    }
	});
  
};