/*global gapi*/

var MyDrive = function (view,channel) {
    this.scriptId = "MY-Myk9KaOAMscHfKgZpwIfZQHuFeqzZk";
    this.CLIENT_ID = '67881158341-i31rcec2rf6bi26elnf8njnrb7v9ij8q.apps.googleusercontent.com';
    this.SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/spreadsheets';
    //this.SCOPES = 'https://www.googleapis.com/auth/plus.me';
    this.data = null;
    this._channel = channel;
    
    this.authResult = null;

    this._view = view;
    this.driveLoaded;
};

MyDrive.prototype.LogInGoogle= function(){
    console.log('Login Google');
    var that = this;
    //gapi.auth.authorize({'client_id': that.CLIENT_ID, 'scope': that.SCOPES, 'immediate': false},$.proxy(that.autherizeResult, that));
    
    gapi.auth.authorize(
          {client_id: that.CLIENT_ID, scope: that.SCOPES, immediate: false},
          $.proxy(that.autherizeResult, that) );//handleAuthResult
        return false;
};

MyDrive.prototype.LogOutGoogle= function(){
    console.log('Logout Google');
    window.open("https://accounts.google.com/logout");
}; 
    
     
MyDrive.prototype.autherizeResult = function(authResult) {
    var that = this;
    if (authResult && !authResult.error) {
        writeStatement('Authenticated');
        //SET AUTH RESULT
        that.authResult = authResult;
       
        that._channel.publish( "Login", { value: false} );
        
        var request = {
            'function': 'getLoggedInUser'
        };
        
        that.RunScript(request, function(resp){
            that._channel.publish( "LoginData", { value: resp} );
        })
        
        // gapi.client.load('drive', 'v2', function(r){
        //     that.driveLoaded();
        // });
        
        // gapi.client.load('plus', 'v1', function() {
        //   var request = gapi.client.plus.people.get({
        //     'userId': 'me'
        //   });
        //   request.execute(function(resp) {
        //     //console.log(resp.displayName);  
        //     that._channel.publish( "LoginData", { value: resp} );
        //   });
        // });
    }
    else {
        writeStatement('Couldnt authenticate displaying button!');
        //that._view.CmdUpdateLogin(true,'Login');
        that._channel.publish( "Login", { value: true} );
    }
};     
    
MyDrive.prototype.init = function(driveLoaded){

};

MyDrive.prototype.SearchForQuizFiles = function(parentId, ocallback){

  
};

MyDrive.prototype.SearchForQuizFolder = function(name, ocallback){
    var that = this;

};

MyDrive.prototype.ReadSheet = function(sheetUrl, ocallback){
    

};

MyDrive.prototype.CreateFile = function(driveLoaded){
 

};

MyDrive.prototype.RunScript = function(req,callback){
    
        // Create an execution request object.
        var request = {
            'function': 'createSheet'
            };

        // Make the API request.
        var op = gapi.client.request({
            'root': 'https://script.googleapis.com',
            'path': 'v1/scripts/' + this.scriptId + ':run',
            'method': 'POST',
            'body': req
        });

        op.execute(function(resp) {
          if (resp.error && resp.error.status) {
            // The API encountered a problem before the script
            // started executing.
            console.log('Error calling API:');
            console.log(JSON.stringify(resp, null, 2));
          } else if (resp.error) {
            // The API executed, but the script returned an error.

            // Extract the first (and only) set of error details.
            // The values of this object are the script's 'errorMessage' and
            // 'errorType', and an array of stack trace elements.
            var error = resp.error.details[0];
            appendPre('Script error message: ' + error.errorMessage);

            if (error.scriptStackTraceElements) {
              // There may not be a stacktrace if the script didn't start
              // executing.
              appendPre('Script error stacktrace:');
              for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                var trace = error.scriptStackTraceElements[i];
                appendPre('\t' + trace.function + ':' + trace.lineNumber);
              }
            }
          } else {
            callback(resp.response.result);
            
          }
        });
      
 
};



function writeStatement(statement){
   console.log(statement);
     var d = new Date();
     var n = d.toLocaleTimeString();
    
     var output = $('#output').html();

     output += '<br/>'+n+ ' ' + statement;
    
     $('#output').html(output);
}
