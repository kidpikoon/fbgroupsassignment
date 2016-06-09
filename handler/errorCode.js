
// Common Errors
var dataNotComplete =   'Request does not contain all required values';
var dbError         =   'Database error';
var notSignIn       =   'User not signed In'

// For Chatting API
// Array of All Codes
var ERROR_CODES  =   new Array();
/* ALL            */ ERROR_CODES[0]    =  '';
/* ALL            */ ERROR_CODES[1]    =  dataNotComplete;
/* ALL            */ ERROR_CODES[2]    =  dbError;
/* ALL            */ ERROR_CODES[3]    =  'Redis Error';
/* user/signup    */ ERROR_CODES[4]    =  'Passwords donot match';
/* user/signup    */ ERROR_CODES[5]    =  'This username already exists';
/* user/signup    */ ERROR_CODES[6]    =  'Invalid username or password';
/* user/signup    */ ERROR_CODES[7]    =  'Token required for loggedin users';
/* ALL            */ ERROR_CODES[8]    =  'Invalid Token';

/* Pending        */ ERROR_CODES[9]    =  '';
/* ALL            */ ERROR_CODES[10]   =  notSignIn;
/* -/admin        */ ERROR_CODES[11]   =  'Username doesnot exist';
/* -/feed         */ ERROR_CODES[12]   =  'Invalid timestamp';
/* ALL            */ ERROR_CODES[13]   =  'Invalid userId';
/* ALL            */ ERROR_CODES[14]   =  'Invalid groupId';
/* ALL            */ ERROR_CODES[15]   =  'user is not group admin';
/* -/admin        */ ERROR_CODES[16]   =  'admin value must be boolean';
/* -/admin        */ ERROR_CODES[17]   =  'Object was not modified, since it already had the required changes';
/* -/album        */ ERROR_CODES[18]   =  'Invalid Links Array';
/* -/album        */ ERROR_CODES[19]   =  'Invalid privacy';



// @Response Handler
var ErrorCodeHandler = {
  // @Get Error JSON data
  getErrorJSONData : function(data_param){
    // data
    var code  =   data_param.code;
    var res   =   data_param.res;
    var data  =   "";
    if(data_param.data){
      data = data_param.data;
    }

    // response
    var errResp =   {};

    // Get Error Description
    var error_text = ERROR_CODES[code];

    if(data_param.text && data_param.text.length > 0){
      error_text = data_param.text;
    }

    if(data_param.dbErr){
      if(data_param.dbErr.errors){
        var errors = data_param.dbErr.errors;
        for(var i in errors){
          if(errors[i].message){
            error_text = errors[i].message;
            break;
          }
        }
      }
      else if(data_param.dbErr.code == 11000){
        error_text = 'Value already exists (Duplicate key detected)';
      }
    }
    
    errResp =   {
            "data": data, 
            "error": {
              "code": code,
              "text": error_text
            }
          };
    res.status(400).send(errResp);
    return;
  },

}

// export
module.exports = ErrorCodeHandler;