"use strict";

//var Panels, QryStrUtils, AncUtils;


$(document).bind("pageinit", function () {
    loadAll(true);
    
  

});


 
 
function loadAll (drive){
    
    var appView = new View();

    var basicQuestioner = new BasicQuestioner(appView);
    
    var c = new QuestionController(appView,basicQuestioner);

}