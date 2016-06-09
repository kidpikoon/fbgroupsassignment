// @album.server.controller
// Assumption : Albums can be viewed by any user if privacy set to public, only admins can add images  
// Author: Rijul Luman

'use strict';

exports.addAlbum = function (req, res) {
  res.set({
          'Content-Type'  :   'application/json'
      });
  var data = req.body;

  // Compulsory
  var userId = req.user._id;
  var groupId = req.group._id;
  var name = (typeof(data.name) !== "undefined")
    ? data.name.trim()
    : "";
  var description = (typeof(data.description) !== "undefined")
    ? data.description.trim()
    : "";
  var privacy = (typeof(data.privacy) !== "undefined")
    ? data.privacy.trim().toLowerCase()
    : "";

  // Optional
  var links = (typeof(data.links) !== "undefined")
    ? data.links
    : [];

  if( 
      CommonFunctions.isNull(name)          ||
      CommonFunctions.isNull(description)   ||
      CommonFunctions.isNull(privacy)
    ){
    ErrorCodeHandler.getErrorJSONData({'code':1, 'res':res});
    return;
  }

  if(privacy != 'public' && privacy != 'private'){
    ErrorCodeHandler.getErrorJSONData({'code':19, 'res':res});
    return;
  }

  if(links != []){
    try{
      links = JSON.parse(links);
    }
    catch(e){
      ErrorCodeHandler.getErrorJSONData({'code':18, 'res':res});
      return;
    }
  }

  var succResp = {
    data : "",
    error : {
      code: 0,
      text : "Album added successfully"
    }
  };

  var albumObj = {
    userId : ObjectId(userId),
    groupId : ObjectId(groupId),
    name : name,
    privacy : privacy,
    description : description,
    links : links,
    created : new Date()
  };

  var album = new Album(albumObj);
  album.save(function(err, reply){
    if(err || !reply){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res, 'dbErr' : err});
      return;
    }
    else{
      succResp.data = {
        albumId : reply._id
      };
      res.status(200).send(succResp);
    }
  });
};

exports.getAlbums = function (req, res) {
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
		findQuery.created = { $gt : timestamp };
	}

  if(!CommonFunctions.isGroupAdmin(req)){
    findQuery.privacy = 'public';
  }

	var succResp = {
    data : "",
    error : {
      code: 0,
      text : ""
    }
  };

	Album.collection.find(findQuery).limit(limit).sort({created : -1}).toArray(function(err, docs){
		if(err){
      ErrorCodeHandler.getErrorJSONData({'code':2, 'res':res, 'dbErr' : err});
      return;
    }
    else{
      succResp.data = {
        albums : docs,
        albumCount : docs.length
      };
      res.status(200).send(succResp);
    }
	});
  
};