"use strict";
//var View, BasicQuestioner, QuestionController;

var driveLoaded;


function handleClientLoad() { driveLoaded = true;}


$(document).bind("pageinit", function () {
    
    var appView = new View();
    
    var loadAll = function(drive){
        var basicQuestioner = new BasicQuestioner(appView,drive);
        var c = new QuestionController(appView,basicQuestioner);
    };
    
    var driveLoadedF = function(){
        if(driveLoaded){
            var data = new MyDrive(appView);
            
            var drivecontroller = new QuestionController(appView,data);
            
            data.init(function(){
                loadAll(data);
            });
        }
        else
        {
        //    window.setTimeout($.proxy(driveLoadedF, this), 1000);  
        }
        
    };
    
    window.setTimeout($.proxy(driveLoadedF, this), 1000);
    

});

