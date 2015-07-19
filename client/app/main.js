"use strict";
//var View, BasicQuestioner, QuestionController;

var driveLoaded;

function handleClientLoad() { driveLoaded = true;}

$(document).bind("pageinit", function () {
    var driveLoaded = function(){
        if(driveLoaded){
            var data = new MyDrive();
                data.init(function(){
                    loadAll(data);
                });
        }
    };
    
    window.setTimeout($.proxy(driveLoaded, this), 1);
    
    
});

function loadAll (drive){
    
   
    var appView = new View();

    var basicQuestioner = new BasicQuestioner(appView,drive);
    
    var c = new QuestionController(appView,basicQuestioner);

}