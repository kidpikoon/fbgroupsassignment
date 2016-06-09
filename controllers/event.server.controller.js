// @events.server.controller
// Assumption : Events can be viewed by any user, only admins can add docs  
// Author: Rijul Luman

'use strict';

exports.addEvent = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });
  var data = req.body;

  // Compulsory
  data.userId = req.user._id;
  data.groupId = req.group._id;

  var succResp = {
    data : "",
    error : {
      code: 0,
      text : "Event added successfully"
    }
  };

  var event = new Event(data);

  event.save(function(err, reply){
    if(err || !reply){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res, 'dbErr' : err});
      return;
    }
    else{
      succResp.data = {
        eventId : reply._id
      };
      res.status(200).send(succResp);
    }
  });
};

exports.getEvents = function (req, res) {
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

	Event.collection.find(findQuery).limit(limit).sort({updated : -1}).toArray(function(err, events){
		if(err){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res, 'dbErr' : err});
      return;
    }
    else{
      succResp.data = {
        events : events,
        eventsCount : events.length
      };
      res.status(200).send(succResp);
    }
	});
  
};