"use strict";
//var View, BasicQuestioner, QuestionController;

var driveLoaded;


function handleClientLoad() { driveLoaded = true;}


$(document).bind("pageinit", function () {
    
    var appView = new View();
    
    var driveLoadedF = function(){
        if(driveLoaded){
            var drive = new MyDrive(appView);
            drive.init(function(){
               var appController = new QuestionController(appView,new BasicQuestioner(appView,drive), drive);
               extend( new Subject(), appController.model );
            });
        }
        else
        {
        //    window.setTimeout($.proxy(driveLoadedF, this), 1000);  
        }
        
    };
    
    window.setTimeout($.proxy(driveLoadedF, this), 1000);
    

});

