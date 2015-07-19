"use strict";
//var View, BasicQuestioner, QuestionController;

var driveLoaded;

function handleClientLoad() { driveLoaded = true;}

$(document).bind("pageinit", function () {
    var driveLoadedF = function(){
        if(driveLoaded){
            var data = new MyDrive();
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

function loadAll (drive){
    
   
    var appView = new View();

    var basicQuestioner = new BasicQuestioner(appView,drive);
    
    var c = new QuestionController(appView,basicQuestioner);

}