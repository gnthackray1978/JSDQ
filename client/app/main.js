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
            
            var appController = new QuestionController(new BasicQuestioner(channel), drive,channel);
            
            extend( new Subject(), appController.model );

            drive.init(function(){
               
            });
        }
    };
    
    window.setTimeout($.proxy(driveLoadedF, this), 1000);
    

});

