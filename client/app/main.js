"use strict";
//var View, BasicQuestioner, QuestionController;

var driveLoaded;


function handleClientLoad() { driveLoaded = true;}


$(document).bind("pageinit", function () {
    
    var data, channel;

    if(postal)
        channel = postal.channel();
    
    var appView = new View(channel);
    
    var driveLoadedF = function(){
        if(driveLoaded){
            
            
            var drive = new MyDrive(appView,channel);
            drive.init(function(){
               var appController = new QuestionController(appView,new BasicQuestioner(channel), drive,channel);
               extend( new Subject(), appController.model );
            });
        }
    };
    
    window.setTimeout($.proxy(driveLoadedF, this), 1000);
    

});

