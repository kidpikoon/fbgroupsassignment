var hexadecimal   =   /^[0-9A-F]+$/i;
var numeric     =   /^[-+]?[0-9]+$/;

// @Common Functions
var CommonFunctions = {
  // @Get unique Id for optionId, LD, RA, etc.
  getUniqueId : function(){
    var id = new Date().getTime().toString();
    id += CommonFunctions.createRandomString({length : 5});
    return id;
  },

  // @Get UNIX timestamp
  getTimestamp : function(){        
    var date    =   new Date();
    var time    =   date.getTime();
    var timestamp   =   Math.round(time/1000);
    return timestamp;
  },

  // @Get timestamp from YYYY-MM-DD
  getTimestampFromDate : function(date){
    var date    =   new Date(date);
    var time    =   date.getTime();
    var timestamp   =   Math.round(time/1000);
    return timestamp;
  },

  // @Get ISO date
  getISODate : function(){
    //var date    =   ISODate();
    var date    =   new Date();
    var ISODate   =   date.toISOString(); 
    return ISODate;
  },
  
  // @Add 0 to dates
  addZeroToDate : function(i){
    if(i < 10){
      i = '0'+i;
    }
    return i;
  },

  // @Get Date Time Str Format - YYYY-MM-DD HH:MM:SS
  getDateTime : function(){ 
    var date    =   new Date();
    var year    =   date.getFullYear();
    var month     =   CommonFunctions.addZeroToDate(date.getMonth() + 1);   
    var day     =   CommonFunctions.addZeroToDate(date.getDate());
    var hours     =   CommonFunctions.addZeroToDate(date.getHours());
    var minutes   =   CommonFunctions.addZeroToDate(date.getMinutes());
    var seconds   =   CommonFunctions.addZeroToDate(date.getSeconds());
    
    var date_str  =   year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
    return date_str;
  },

  // @Get Date Time Str Format - YYYY-MM-DD HH:MM:SS
  getDateTimeFromUNIX : function(timestamp){
    var date    =   new Date( parseInt(timestamp, 10) * 1000 );
    var year    =   date.getFullYear();
    var month     =   CommonFunctions.addZeroToDate(date.getMonth() + 1);   
    var day     =   CommonFunctions.addZeroToDate(date.getDate());
    var hours     =   CommonFunctions.addZeroToDate(date.getHours());
    var minutes   =   CommonFunctions.addZeroToDate(date.getMinutes());
    var seconds   =   CommonFunctions.addZeroToDate(date.getSeconds());
    
    var date_str  =   year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
    return date_str;
  },

  // @Get Date Str Format - YYYY-MM-DD
  getDateFromUNIX : function(timestamp){
    var date    =   new Date( parseInt(timestamp, 10) * 1000 );
    var year    =   date.getFullYear();
    var month     =   CommonFunctions.addZeroToDate(date.getMonth() + 1);   
    var day     =   CommonFunctions.addZeroToDate(date.getDate());
    
    var date_str  =   year+'-'+month+'-'+day;
    return date_str;
  },

  // Get time since given date
  getTimeSince : function(timestamp) {
    // check
    timestamp   =   (typeof(timestamp) !== "undefined") ? timestamp   :   0;
    
    // diff
      var seconds = CommonFunctions.getTimestamp() - timestamp;

      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
          return interval + " years ago";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
          return interval + " months ago";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
          return interval + " days ago";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
          return interval + " hours ago";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
          return interval + " minutes ago";
      }
      return Math.floor(seconds) + " seconds ago";
  },
  
  // @Trim whitespaces
  trimWhiteSpace : function(str) {    
    return str.replace(/\s+/g, '');
  },

  isValidURL : function(str) {
    var result = str.match(/(http|ftp|https):\/\/[\w\-​​_]+(\.[\w\-_​​]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/);

    if(result) {
      return true;
    }
    else {
      return false;
    }
  },

  // @Debug logs
  debugLog : function(data){
    if(1){
      console.log(data);
    }
  },

  // @Null check
  isNull : function(str){   
    //str = str.toString();
    return str.length === 0;
  },

  isMongoId : function (str) {
    return CommonFunctions.isHexadecimal(str) && str.length === 24;
  },

  isHexadecimal : function (str) {
    return hexadecimal.test(str);
  },

  isNumeric : function (str) {
    return numeric.test(str);
  },
  
  // @Email check
  isValidEmail : function(email){
    var filter  = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return filter.test(email);  
  },

  // Make first character of string uppercase
  firstToUpperCase : function(str) {
      return str.substr(0, 1).toUpperCase() + str.substr(1);
  },

  // Sort Latest by insert date
  sortLatestByInsert : function(reviewArr) {
    reviewArr.sort(function(a, b){
      if(a.timestamp == null){
        a.timestamp = {insert : 0};
      }
      if(b.timestamp == null){
        b.timestamp = {insert : 0};
      }
      var a_cnt = parseInt(a.timestamp.insert, 10);
      var b_cnt = parseInt(b.timestamp.insert, 10);
      return b_cnt - a_cnt;
    });

    return reviewArr;
  },
  // Sort alphabetically
  sortByAlphabet : function(reviewArr, name) {
    reviewArr.sort(function(a, b){
      var A = a[name].toLowerCase();
      var B = b[name].toLowerCase();
      if(A < B) return -1;
        if(A > B) return 1;
      return 0;
    });
    return reviewArr;
  },

  sortByNumberDescending : function(reviewArr, name) {
    // reviewArr.sort(function(a, b){
    //   var A = parseInt(a[name], 10);
    //   var B = parseInt(b[name], 10);

    //   return B - A;
    // });
    var newArray = [];

    for(var i = 0; i < reviewArr.length; i++){
      var maxValue = -1;
      var index = -1;
      var pushAble = null;
      for(var j = 0; j < reviewArr.length; j++){
        if(reviewArr[j][name] > maxValue){
          index = j;
          maxValue = reviewArr[j][name];
          pushAble = reviewArr[j];
        }
      }
      if(index > 0){
        newArray.push(pushAble);
        reviewArr.splice(index,1);
        i--;
      }
    }
    if(reviewArr.length > 0){
      newArray.push.apply(newArray, reviewArr);
    }
    return newArray;
  },

  sortByNumberAscending : function(reviewArr, name) {
    reviewArr.sort(function(a, b){
      var A,B;
      if(a[name] == null){
        A = 320000;
      }
      else{
        A = parseInt(a[name], 10);
      }
      if(b[name] == null){
        B = 320000;
      }
      else{
        B = parseInt(b[name], 10);
      }
      
      return A - B;
    });
    return reviewArr;
  },

  // Sort sequence
  sortBySequence : function(reviewArr) {
    reviewArr.sort(function(a, b){
      var a_cnt = parseInt(a.seqNum, 10);
        var b_cnt = parseInt(b.seqNum, 10);

        return a_cnt - b_cnt;
    });

    return reviewArr;
  },

  spliceByIndex : function(arr, indexList){
    var newArr = [];
    for(var i = 0; i < arr.length; i++){
      if(indexList.indexOf(i) == -1){
        newArr.push(arr[i]);
      }
    }
    return newArr;
  },

  // create hash for algo
  createHash : function(data_param) {
    var algo    = (typeof(data_param.algo) !== "undefined") ? data_param.algo : 'md5';
    var data    = data_param.data;
    var encoding  = (typeof(data_param.encoding) !== "undefined") ? data_param.encoding : 'hex';
    var crypto  =   require('crypto');
    // create
    var hash  =   crypto.createHash(algo).update(data).digest(encoding);
    return hash;
  },

  resolveArrayTagNames : function(data, callback){
    var count = 0;
    if(data.length == 0){
      callback(data);
      return;
    }
    for(i in data){
      CommonFunctions.resolveTagNames(data[i], i, function(tagNames, index){
        if(index == 'FlushActive'){
          callback(index);
          return;
        }
        data[index].tags = tagNames;
        count++;
        if(count == data.length){
          callback(data);
        }
      });
    }
  },

  resolveTagNames : function(data, index, callback){
    var tags = data.tags;
    var tagNames = [];
    var count = 0;
    for(var i = 0; i < tags.length; i++){
      var id = tags[i];
      RedisHandler.getTagById(id, function(err_t,reply_t){
        if(reply_t == 'FlushActive'){
          callback(err, reply_t);
          return;
        }
        if(reply_t != null){
          reply_t = JSON.parse(reply_t);
          var tagObj = {key : reply_t._id, value: reply_t.tag, status: reply_t.status};
          tagNames.push(tagObj);
        }
        count++;
        if(count == tags.length){
          // data.tagNames = tagNames;
          callback(tagNames, index);
        }
      });
    }
  },

  formatDataForResponse : function(reply){
    return formatDataForResponse(reply, []);
  },

  formatDataForResponse : function(reply, trendingPolls){
    if(trendingPolls == null){
      trendingPolls = [];
    }
    // Tag names need to be resolved later
    var pushAble = {};

    pushAble.pollId          = reply._id;
    pushAble.tags            = reply.tags;
    pushAble.userName        = reply.userName;
    pushAble.memId           = reply.memId;
    pushAble.email           = reply.email;
    pushAble.anonymous       = reply.anonymous;
    pushAble.appCode         = reply.appCode;
    pushAble.visibility      = {};
    pushAble.visibility.type = reply.visibility.type;
    pushAble.status          = reply.status;
    if(reply.pollType != null){
      pushAble.pollType = reply.pollType;
      if(reply.pollTypeNumber != null){
        pushAble.pollTypeNumber = reply.pollTypeNumber;
      }
    }
    else if(trendingPolls.indexOf(reply._id) != -1){
      pushAble.pollType = 'T';
    }
    else{
      pushAble.pollType = '';
    }
    pushAble.question        = {};
    pushAble.question.text   = reply.question.text;
    if(reply.question.description != null){
      pushAble.question.description = reply.question.description;
    }
    else{
      pushAble.question.description = '';
    }
    if(reply.question.image != null){
      pushAble.question.image = reply.question.image;
    }
    else{
      pushAble.question.image = '';
    }
    pushAble.options = [];
    for(j in reply.options){
      var obj = {};
      obj.seqNum = reply.options[j].seqNum;
      obj.text = reply.options[j].text;
      obj.optionId = reply.options[j].optionId;
      if(reply.options[j].image != null){
        obj.image = reply.options[j].image;
      }
      else{
        obj.image = '';
      }
      if(reply.totalVoteCount > 0){
        obj.percentage = (reply.options[j].voteCount * 100/ reply.totalVoteCount).toFixed(2);
      }
      else{
        obj.percentage = 0;
      }
      obj.voteCount = reply.options[j].voteCount;

      if(reply.options[j].link != null){
        obj.link = reply.options[j].link;
      }
      else{
        obj.link = '';
      }
      pushAble.options.push(obj); 
    }
    
    pushAble.totalVoteCount = reply.totalVoteCount;
    pushAble.visibility.type = reply.visibility.type;
    if(reply.visibility.type != 'e'){
      pushAble.visibility.list = reply.visibility.list;
    }
    
    if(reply.fbId != null){
      pushAble.fbId = reply.fbId;
    }
    else{
      obj.fbId = '';
    }
    if(reply.plusId != null){
      pushAble.plusId = reply.plusId;
    }
    else{
      obj.plusId = '';
    }
    if(reply.userAvatar != null){
      pushAble.userAvatar = reply.userAvatar;
    }
    else{
      obj.userAvatar = '';
    }
    if(reply.source != null){
      pushAble.source = reply.source;
    }
    else{
      obj.source = '';
    }
    if(reply.linkedPolls != null && reply.linkedPolls.length != 0){
      pushAble.linkedPolls = reply.linkedPolls;
    }
    if(reply.totalViews != null){
      pushAble.totalViews = reply.totalViews;
    }
    else{
      pushAble.totalViews = 0;
    }
    pushAble.date       = CommonFunctions.getDateTimeFromUNIX(reply.timestamp.insert);
    pushAble.timeSince  = CommonFunctions.getTimeSince(reply.timestamp.insert);
    // pushAble.RA               = reply.RA;
    pushAble.RACount          = reply.RACount;
    // pushAble.shares           = reply.shares;
    pushAble.shareCount       = reply.shareCount;
    // pushAble.followers        = reply.followers;
    pushAble.followerCount    = reply.followerCount;
    // pushAble.LD               = reply.LD;
    pushAble.likesCount       = reply.likesCount;
    pushAble.dislikesCount    = reply.dislikesCount;
    // pushAble.ldCount          = reply.ldCount;
    // userVoteStatus : 'Y'

    pushAble.approveDate = (typeof(reply.timestamp.approve) !== "undefined")
      ? CommonFunctions.getDateTimeFromUNIX(reply.timestamp.approve)
      : '';
    pushAble.adminEmail = (typeof(reply.adminEmail) !== "undefined")
      ? reply.adminEmail
      : '';
    pushAble.adminReason = (typeof(reply.adminReason) !== "undefined")
      ? reply.adminReason
      : '';

    if(reply.timestamp.expired != null){
      pushAble.expiryDate = CommonFunctions.getDateTimeFromUNIX(reply.timestamp.expired);
    }
    else if(reply.timestamp.expire != null){
      pushAble.expiryDate = CommonFunctions.getDateTimeFromUNIX(reply.timestamp.expire);
    }
    else{
      pushAble.expiryDate = '';
    }
    pushAble.userType = (typeof(reply.userType) !== "undefined")
      ? reply.userType
      : 'U';

    return pushAble;
  },

  checkIfPollExists : function(id, callback){
    pollCollection.count({_id: ObjectId(id)}, function(err, reply){
      if(reply > 0){
        callback(id, true);
      }
      else{
        callback(id, false);
      }
    });
  },

  fixTagsCount : function(newTags, removedTags){
    for(var i = 0; i < newTags.length; i++){
      var insertParam = { $inc: {pollCount : 1}};
      CommonFunctions.updateTag(insertParam, newTags[i]);
    }
    for(var i = 0; i < removedTags.length; i++){
      var insertParam = { $inc: {pollCount : -1}};
      CommonFunctions.updateTag(insertParam, removedTags[i]);
    }
  },

  updateTag : function(insertParam, id){
    tagCollection.update({_id: ObjectId(id)}, insertParam, function(err, reply){
      RedisHandler.resetTagById(id, function(err, reply){

      });
    });
  },

  handleExpiredPoll : function(pollId, callback){
    var set = {};
    set.status = 'E';

    var unset = {};
    unset.pollType = "";
    unset.pollTypeNumber = "";

    var rename = { "timestamp.expire" : "timestamp.expired"};


    var updateParam = {$set : set, $unset: unset, $rename : rename};

    pollCollection.update({"_id" : ObjectId(pollId)},updateParam,function(err_u,doc_u){
      if(doc_u.result.nModified < 1) {
        callback(null, 0);
      }
      else{
        redisStoreMA.hdel(redisPath.pollById, pollId);
        RedisHandler.removePollFromSortedLists(pollId, function(err, reply){
          
        });
        callback(null, doc_u.result.nModified);
      }
    });
  },

  // check with blacklisted words
  checkBlackListWords : function(stringInput, callback) {     // Input String is an Array
    
    var blacklist;
    if(stringInput == null || stringInput.length == 0) {
      callback(null,'PASS');
      return;
    }

    RedisHandler.getBlackListWords(function(err,reply) {
      if(err != null) {
        callback(err,reply);
        return;
      }
      if(reply == null || reply.length == 0) {
        callback(err,'PASS');
        return;
      }
      blacklist = reply;
      strInputLen   = stringInput.length;
      blacklistLen  = blacklist.length;

      outerloop:
      for(var j = 0; j < strInputLen; j++) {
        for(var i = 0; i < blacklistLen; i++) {
          //var indexFound = stringInput[j].indexOf(blacklist[i]);
          var pattern = new RegExp('\\b'+blacklist[i]+'\\b', 'gi'); 
          var indexFound = stringInput[j].search(pattern);   
          if((j == (strInputLen - 1)) && (i == (blacklistLen - 1)) && (indexFound == -1)) {
            callback(err, 'PASS');
            break outerloop;
          }
          else if(indexFound != -1) {
            callback(err, 'FAIL');
            break outerloop;
          }
        }
      }
    });
  },

  createRandomString : function(dataParam) {
    dataParam = (typeof(dataParam) !== "undefined") 
      ? dataParam
      : {};

    var length = (typeof(dataParam.length) !== "undefined") 
      ? parseInt(dataParam.length, 10)
      : 16;
    var chars = (typeof(dataParam.chars) !== "undefined") 
      ? dataParam.chars
      : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var result = '';
    for (var i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  },

  encryptData : function(dataParam){
    var crypto = require('crypto');
    var password = '1QcZUJEd2SAILV8H';

    var algo = (typeof(dataParam.algo) !== "undefined") 
      ? dataParam.algo
      : 'aes-256-ctr';
    var data = dataParam.data;
    var inputEncoding = (typeof(dataParam.inputEncoding) !== "undefined") 
      ? dataParam.inputEncoding
      : 'utf8';
    var outputEncoding = (typeof(dataParam.outputEncoding) !== "undefined") 
      ? dataParam.outputEncoding
      : 'hex';

    var cipher = crypto.createCipher(algo,password)
    var crypted = cipher.update(data,inputEncoding,outputEncoding)
    crypted += cipher.final(outputEncoding);
    return crypted;
  },
   
  decryptData : function(dataParam){
    var crypto = require('crypto');
    var password = '1QcZUJEd2SAILV8H';

    var algo = (typeof(dataParam.algo) !== "undefined") 
      ? dataParam.algo
      : 'aes-256-ctr';
    var data = dataParam.data;
    var inputEncoding = (typeof(dataParam.inputEncoding) !== "undefined") 
      ? dataParam.inputEncoding
      : 'hex';
    var outputEncoding = (typeof(dataParam.outputEncoding) !== "undefined") 
      ? dataParam.outputEncoding
      : 'utf8';

    var decipher = crypto.createDecipher(algo,password)
    var dec = decipher.update(data,inputEncoding,outputEncoding)
    dec += decipher.final(outputEncoding);
    return dec;
  },

    // split string by length i/p
  splitStr : function(string, split_length) {
    // example 1: str_split('Hello Friend', 3);
    // returns 1: ['Hel', 'lo ', 'Fri', 'end']

    split_length = parseInt(split_length, 10);

    if (split_length === null) {
      split_length = 1;
    }
    if (string === null || split_length < 1) {
      return false;
    }
    string += '';
    var chunks = [],
      pos = 0,
      len = string.length;

    while (pos < len) {
      chunks.push(string.slice(pos, pos += split_length));
    }

    return chunks;
  },

  // generate md5 hash for password
  hashPassword : function(password) {
    var randomNum = Math.floor((Math.random() * 9) + 1);

    var mergedPwd = CommonFunctions.createMergedPassword({
      password  : password,
      randomNum : randomNum
    });

    var randomChar = CommonFunctions.createRandomString({
      length : 1,
      chars  : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    });
    
    var hashedPwd = CommonFunctions.createHash({data : mergedPwd, algo : 'sha512'});
    hashedPwd = randomChar + randomNum + hashedPwd;        
    return hashedPwd;
  },

  // re-generate md5 hash from md5password
  reHashPassword : function(dataParam) {
    var md5password = dataParam.md5password;
    var password = dataParam.password;

    var randomNum = md5password.substr(1, 1);

    var mergedPwd = CommonFunctions.createMergedPassword({
      password  : password,
      randomNum : randomNum
    });

    var randomChar = md5password.substr(0, 1);
    
    var hashedPwd = CommonFunctions.createHash({data : mergedPwd, algo : 'sha512'});
    hashedPwd = randomChar + randomNum + hashedPwd;        
    return hashedPwd;
  },

  createMergedPassword : function(dataParam) {
    var password  = dataParam.password;
    var randomNum = dataParam.randomNum;

    var aSplitPwd = CommonFunctions.splitStr(password, randomNum);

    var passPhrase = 'GaI65QVJjVlOzbxY';
    var aSplitPassPhrase = CommonFunctions.splitStr(passPhrase, randomNum);
    
    var mergedPwd = "";
    for(var i = 0; i < aSplitPwd.length; i++) {
      mergedPwd += aSplitPwd[i] + aSplitPassPhrase[i];
    }

    return mergedPwd;
  },

  // verify admin sign in
  verifyAdminSignIn : function (dataParam, callback) {
    // callback(null, true);
    // return;

    var email = (typeof(dataParam.email) !== "undefined")
      ? dataParam.email
      : '';
    var lsid = (typeof(dataParam.lsid) !== "undefined") 
      ? dataParam.lsid
      : '';
    var path = redisPath.lsidExpire + email + '.'+lsid;
    redisStoreSL.exists(path, function(err, reply){
      if(reply == 0){
        var findCriteria = {
          'email'  : email,
          // 'lsid'   : { $in : [lsid] },
          'status' : 'A'
        };
        var lastLogout = CommonFunctions.getTimestamp();
        var updateParam = {$pull : {lsid : { $in : [lsid] }}};
        adminCollection.update(findCriteria, updateParam, function(errF, docF) {
          if(docF.result.nModified > 0){
            adminCollection.update(findCriteria, {$set : {"timestamp.lastLogout" : lastLogout}}, function(errU, docU) {
            
            });
          }
          callback(null, false);
        });
      }
      else{
        var ADMIN_TTL_EXPIRY = constantsConfig.ADMIN_TTL_EXPIRY;
        redisStoreMA.expire(path, ADMIN_TTL_EXPIRY);
        callback(null, true);
      }
    });
    // var findCriteria = {
    //   'email'  : email,
    //   'lsid'   : { $in : [lsid] },
    //   'status' : 'A'
    // };
    // adminCollection.findOne(findCriteria, {_id : 1}, function(errF, docF) {
    //   // DB error
    //   if(errF) {
    //     callback(null, false);
    //     return;
    //   }

    //   // not present
    //   if(docF == null) {
    //     callback(null, false);        
    //   }
    //   else {
    //     callback(null, true);        
    //   }
    // });
  },

  // Function to get user image
  fnGUserImg : function(data_param) {
    // extact data
    var memFBId   = (typeof(data_param.FBID)    !== "undefined") ? data_param.FBID.trim().toLowerCase()   : '';
    var emailId   = (typeof(data_param.EMAIL)     !== "undefined") ? data_param.EMAIL.trim().toLowerCase()  : '';
    var memId   = (typeof(data_param.MEMBERID)  !== "undefined") ? data_param.MEMBERID.trim().toLowerCase() : '';
    //size = small / normal / large
    var size    = (!CommonFunctions.isNull(data_param.SIZE)) ? data_param.SIZE.toLowerCase() : 'small';
    var secure    = (data_param.secure == 'TRUE') ? true : false;

    //  ALLOWED SIZES ARRAY
    var arrSizes  = ['small', 'normal', 'large'];   
    if(arrSizes.indexOf(size) == -1) {
      size  = 'small';
    }

    // No Image
    if(secure) {
      defImgSrc = "//in.bookmyshow.com/img/noimguser.jpg"; // https:
    }
    else {
      defImgSrc = "//cnt.in.bookmyshow.com/in/synopsis-new/noimguser.jpg"; // http:
    }

    // for FB
    var imgSrc  = "";
    if(!CommonFunctions.isNull(memFBId)) {
      size  = (size == 'small') ? 'square' : size;  //  square / small / normal / large

      if (secure) {
        imgSrc = "//graph.facebook.com/"+memFBId+"/picture?type="+size+"&return_ssl_resources=1"; // https:
      }
      else {
        imgSrc = "//graph.facebook.com/"+memFBId+"/picture?type="+size; // http:
      }
    }
    // for Email
    else if(!CommonFunctions.isNull(emailId)) {
      var arrGravSizes    = new Array();
      arrGravSizes['small'] = 50;
      arrGravSizes['normal']  = 100;
      arrGravSizes['large'] = 500;

      var emailHash = CommonFunctions.createHash({'data' : emailId});
      var defImgSrcEncoded  = encodeURIComponent(defImgSrc);

      if (secure) {
        imgSrc  = "//secure.gravatar.com/avatar/"+emailHash+"?s="+arrGravSizes[size]+"&d="+defImgSrcEncoded+"&r=g";  //  r = image rating (g, pg, r, x) // https:
      }
      else {
        imgSrc  = "//www.gravatar.com/avatar/"+emailHash+"?s="+arrGravSizes[size]+"&d="+defImgSrcEncoded+"&r=g"; // http:
      }
    }
    /*
    // for member id
    elseif(!CommonFunctions.isNull(memId)) {
      $imgSrc = "//cnt.in.bookmyshow.com/profile/"+memId+"/pic"; // http:
    }
    */
    else {
      imgSrc = defImgSrc;
    }

    return imgSrc;
  },

  // Function to strip extra characters 
  fnStripExtra : function(str) {
    //  CHECK FOR OCCURRENCE OF CHARACTERS A-Z
    //  FOR MORE THAN 2 TIMES AND SET IT TO TWO
    var pattern   =   '/([A-Z])\1{1,}/gi';
    //var returnTxt =   preg_replace(pattern, '$1$1', str);
    var returnTxt =   str.replace(pattern, '$1$1');

    //  CHECK FOR OCCURRENCE OF ANY CHARACTER
    //  FOR MORE THAN 3 TIMES AND SET IT TO THREE
    pattern   =   '/(.)\1{2,}/gi';
    //returnTxt   =   preg_replace(pattern, '$1$1$1', returnTxt);   
    returnTxt =   returnTxt.replace(pattern, '$1$1$1');

    return returnTxt;

    /*
    var returnTxt     = '';
    var capitalLimit  = 2;
    var generalLimit  = 3;
    var len       = str.length;
    var prevCh      = '';

    for(var i = 0; i < len;){
      var count   = 1;
      var ch    = str.charAt(i);
      while((i < len) && (str.charAt(i) == str.charAt(i+1))){
        count++;
        i++;
      }
      if(count > 1){
        if(ch >= 'A' && ch <='Z'){
          if(count > capitalLimit){
            count = capitalLimit;
          }
        }
        else if(count > generalLimit){
          count = generalLimit;
        }
        if(prevCh.toLowerCase().charAt(0) == ch.toLowerCase()){
          if(prevCh.length >= generalLimit){
            count = 0;
          }
          else{
            count -= prevCh.length;
          }
        }
        for(var j = 1; j < count; j++){
          returnTxt += ch;
          prevCh += ch;
        }
      }
      else{
        if(prevCh.toLowerCase().charAt(0) == ch.toLowerCase()){
          if(prevCh.length < generalLimit){
            returnTxt += ch;
            i++;
            prevCh += ch;
          }
          else{
            i++;
          }         
        }
        else{
          returnTxt += ch;
          i++;
          prevCh = ch;
        }
      }
    }
    return returnTxt;
    */
  },

  // Verify Sign in for User
  verifySignIn: function (data_param, callback){
    var http  =   require("http");
    var strParams = "";
    if(data_param.appCode == null){
      data_param.appCode = 'WEBIN';
    }
    if(data_param.memId == null){
      data_param.memId = '';
    }
    if(data_param.lsid == null){
      data_param.lsid = '';
    }
    if(data_param.email == null){
      data_param.email = '';
    }
    strParams += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
    strParams += "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\"><soap12:Body>";
    strParams += "<objExecute xmlns=\"http://www.bookmyshow.com/\">";
    strParams += "<strAppCode>"+data_param.appCode+"</strAppCode>";
    strParams += "<strVenueCode></strVenueCode>";
    strParams += "<lngTransactionIdentifier>0</lngTransactionIdentifier>";
    strParams += "<strCommand>VERIFYSIGNIN</strCommand>";
    strParams += "<strParam1>"+data_param.memId+"</strParam1>";
    strParams += "<strParam2>"+data_param.lsid  +"</strParam2>";
    strParams += "<strParam3>"+data_param.email +"</strParam3>";
    strParams += "<strParam4></strParam4>";
    strParams += "<strParam5></strParam5>";
    strParams += "<strParam6></strParam6>";
    strParams += "<strParam7></strParam7>";
    strParams += "<strParam8></strParam8>";
    strParams += "<strParam9>false</strParam9>";
    strParams += "<strParam10>false</strParam10></objExecute></soap12:Body></soap12:Envelope>";

    var postRequest = {
        host: "services.in.bookmyshow.com",
        path: "/wsTrans.asmx",
        port: 80,
        method: "POST",
        headers: {
          'Cookie': "cookie",
          'Content-Type': 'text/xml',
          'Content-Length': Buffer.byteLength(strParams)
        }
    };

    var buffer = "";

    var req = http.request( postRequest, function(res){
      var buffer = "";
      res.on( "data", function( data ) { 
        buffer = buffer + data; 
      });
        var parseString   =   require('xml2js').parseString;
        res.on( "end", function( data ) {
        parseString(buffer, function (err, result) {
          var success = 'false';
          try{
            success = result['soap:Envelope']['soap:Body'][0]['objExecuteResponse'][0]['objExecuteResult'][0]['blnSuccess'][0];
          }
          catch(e){
            //
          }
          // console.dir(result['soap:Envelope']['soap:Body'][0]['objExecuteResponse'][0]['objExecuteResult'][0]['blnSuccess'][0]);
          if(success == 'true'){
            callback(null, true);
          }
          else{   // if(success == 'false')
            callback(null, false);
           }
        });
      });
    });

    req.on('error', function(e) {
      //
    });

    req.write( strParams );
    req.end();
  },

  isGroupAdmin : function(req){
    var isAdmin = false;
    if(req.user.admin){
      isAdmin = req.user.admin.some(function (id) {
        return id.equals(req.group._id);
      });
    }
    return isAdmin;
  },
}

// export
module.exports = CommonFunctions;