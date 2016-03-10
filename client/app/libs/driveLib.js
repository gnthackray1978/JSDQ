

var MyDrive = function (view,channel) {

    this.CLIENT_ID = '67881158341-i31rcec2rf6bi26elnf8njnrb7v9ij8q.apps.googleusercontent.com';
//this.SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/plus.login';
    this.SCOPES = 'https://www.googleapis.com/auth/plus.me';
    this.data = null;
    this._channel = channel;
    
    this.authResult = null;

    this._view = view;
    this.driveLoaded;
};

MyDrive.prototype.GoogleSheetTestLogin= function(e){
    console.log('Google Sheet Test Login');
    var that = this;
    gapi.auth.authorize({'client_id': that.CLIENT_ID, 'scope': that.SCOPES, 'immediate': true},$.proxy(that.autherizeResult, that));
};
     
MyDrive.prototype.autherizeResult = function(authResult) {
    var that = this;
    if (authResult && !authResult.error) {
        writeStatement('Authenticated');
        //SET AUTH RESULT
        that.authResult = authResult;
       
        that._channel.publish( "Login", { value: false} );
        gapi.client.load('drive', 'v2', function(r){
            that.driveLoaded();
            // gapi.client.oauth2.userinfo.get().execute(function(userData)
            // {
            //     console.log('userdata name: ' + userData.name);
            //     // userData.id;
            //     // userData.name;
            //     // userData.email;

            // });
      
        });
    }
    else {
        writeStatement('Couldnt authenticate displaying button!');
        //that._view.CmdUpdateLogin(true,'Login');
        that._channel.publish( "Login", { value: true} );
    }
};     
    
MyDrive.prototype.init = function(driveLoaded){
 
    var that = this;
    that.driveLoaded = driveLoaded;
    
    var checkAuth = function() {
        gapi.auth.authorize({'client_id': that.CLIENT_ID, 'scope': that.SCOPES, 'immediate': true},$.proxy(that.autherizeResult, that));
    };

    window.setTimeout($.proxy(checkAuth, this), 1);
};

MyDrive.prototype.SearchForQuizFiles = function(parentId, ocallback){
    
    var fileArray = [];
    var filesToLoad;
    var timeOutReached;
    
    
    var checkFilesLoads = function(){
        
        if(timeOutReached)
        {
            ocallback();
        }
        else
        {
            if(!filesToLoad){ 
                window.setTimeout($.proxy(checkFilesLoads, this), 1);
            }
            else
            {
                if(fileArray.length == filesToLoad.length){
                    writeStatement('all files looked up calling callback');
                    ocallback(fileArray);
                }
                else
                {
                    window.setTimeout($.proxy(checkFilesLoads, this), 1);
                }
            }
        }
    };
    
    window.setTimeout($.proxy(function(){
        timeOutReached =true;
    }, this), 10000);
    
    window.setTimeout($.proxy(checkFilesLoads, this), 1);
    
    var searchForId = function(fileList){
        
        filesToLoad = fileList;
        
        writeStatement('retrieved list of quiz files');
        
        if(fileList.length ==0) ocallback(-1);
        
        var idx =0;
        while(idx < fileList.length){
            if(fileList[idx])
            {
                writeStatement(fileList[idx].title);
                writeStatement('found id: '+ fileList[idx].id);
                
                fileArray.push({ key: idx, value: fileList[idx].title, url : 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=' + fileList[idx].id +'&output=html' });
                
                // var request = gapi.client.drive.files.get({
                //     'fileId': fileList[idx].id
                // });
                  
                // request.execute(function(resp) {
                //     console.log('Title: ' + resp.title);
                //     fileArray.push({ key: idx, value: resp.title });
                // });
                
            }
            idx++;
        }
        
        
    };
    //
    var retrievePageOfFiles = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.items);
            var nextPageToken = resp.nextPageToken;
           
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } 
            else {
                searchForId(result);
            }
        });
    };

    writeStatement('searching for: '+ parentId); 
    
    var pstr= '\'' + parentId+ '\'' + ' in parents';
    
    var initialRequest = gapi.client.drive.files.list({ 'q': pstr});
    
    retrievePageOfFiles(initialRequest, []);
  
};

MyDrive.prototype.SearchForQuizFolder = function(name, ocallback){
    var that = this;
    
    var searchForId = function(fileList){
        writeStatement('retrieved quiz folder');
        
        if(fileList.length > 0){
            writeStatement('quiz folder found: '+ fileList[0].title + ' ' + fileList[0].id);
            that.SearchForQuizFiles(fileList[0].id,ocallback);
        }
        else
        {
            writeStatement('retrieved quiz folder no quizs found');
            ocallback(-1);
        }
    };

    var retrievePageOfFiles = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.items);
            var nextPageToken = resp.nextPageToken;
           
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } 
            else {
                searchForId(result);
            }
        });
    };
    
    //var pstr= '\'' + folderId+ '\'' + ' in parents';
    //title contains 'Hello'
    
    var pstr= 'mimeType = \'application/vnd.google-apps.folder\' and title contains \'quiz\'';
    
    writeStatement('searching for: '+ pstr);   
    
    var initialRequest = gapi.client.drive.files.list({ 'q': pstr});
    
    retrievePageOfFiles(initialRequest, []);
  
};

MyDrive.prototype.ReadSheet = function(sheetUrl, ocallback){
    
    
    Tabletop.init( { key: sheetUrl,
                         callback: showInfo } );
    
    
    function showInfo(data, tabletop) {
        console.log('table loaded: ' + data.length);
        var listofCSVData = [];
        var listofcategories = new UniqueList();

        var idx =0;
        
        while(idx < data["Questions"].raw.feed.entry.length){
            listofCSVData[idx] =[];
            
            listofCSVData[idx][0] = data["Questions"].elements[idx]["Test Name"];
            listofCSVData[idx][1] = data["Questions"].elements[idx]["Parent"];
            listofCSVData[idx][2] = data["Questions"].elements[idx]["Category"];
            listofCSVData[idx][3] = data["Questions"].elements[idx]["Question"];
            listofCSVData[idx][4] = data["Questions"].elements[idx]["Answer"];
            
            listofcategories.Add(data["Questions"].elements[idx]["Category"]);
                
            var rawColumns = data["Questions"].raw.feed.entry[idx].content.$t.split(',');
            
            var cidx =0;
            var cbase =5;
            
            while(cidx < rawColumns.length){
                if(rawColumns[cidx].indexOf("_") != -1)
                {
                    listofCSVData[idx][cbase] = rawColumns[cidx].split(':')[1].trim();
                    cbase++;
                }
                cidx++;
            }
            idx++;
        }
        
        ocallback(listofCSVData,listofcategories);
    };
    
};

function writeStatement(statement){
   console.log(statement);
     var d = new Date();
     var n = d.toLocaleTimeString();
    
     var output = $('#output').html();

     output += '<br/>'+n+ ' ' + statement;
    
     $('#output').html(output);
}
