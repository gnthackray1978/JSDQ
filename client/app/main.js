"use strict";
//var View, BasicQuestioner, QuestionController;

var driveLoaded;


function handleClientLoad() { driveLoaded = true;}


$(document).bind("pageinit", function () {
    
    var appView = new View();
    
    var driveLoadedF = function(){
        if(driveLoaded){
            var drive = new MyDrive(appView);
            
            var appController = new QuestionController(appView,data);
            
            drive.init(function(){
                appController.model = new BasicQuestioner(appView,drive);
            });
        }
        else
        {
        //    window.setTimeout($.proxy(driveLoadedF, this), 1000);  
        }
        
    };
    
    window.setTimeout($.proxy(driveLoadedF, this), 1000);
    

});

