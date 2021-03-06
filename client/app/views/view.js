/*global ListHelper*/


function View(channel) {       

    this._channel = channel;

    this.cacheCatList =[];
    this.cacheCSVList =[];
    this.cacheResultsList =[];
    
    var that = this;
    
    this._channel.subscribe("RequestAnswer", function(data, envelope) {
       
        var radioBox = $("input[name*=radio-choice]:checked").val();
        var txtBox = $('#answer-box').val();
        
        var answer = (txtBox == '') ? radioBox : txtBox;
        
        that._channel.publish( "QryAnswer", { value: answer});
    
    });
    
    this._channel.subscribe("UpdateView", function(data, envelope) {
        that.UpdateView(data.value);
    });
    
    this.PublishStartTestEvent();
    this.PublishEndTestEvent();
    this.PublishHistoryLoadEvent();
    this.PublishAnswerButtonEvent();
    this.PublishPrevQuestionEvent();
    this.PublishNextQuestionEvent();
    this.PublishSubmitAnswerEvent();
    this.PublishSelectTestEvent();
    // this.PublishCatBtnEvent();
    // this.PublishCsvBtnEvent();
    this.PublishResetQuestionEvent();
    this.PublishCorrectAnswerButtonEvent();
    this.PublishLoginClickEvent();
    this.PublishCreateTestClickEvent();
    this.PublishEditClickEvent();
} 

View.prototype.FormatAnswerSoFar =function (currentQuestionState) {
    var answersofar = '<\BR>' + 'Progress so far: ' + '<\BR>' + currentQuestionState.length + '<\BR>';
    var idx = 0;
    while (idx < currentQuestionState.length) {
        answersofar += currentQuestionState[idx] + ' ';
        idx++;
    }
    
    return answersofar;
};

View.prototype.FormatMultipleChoice = function (question, constAnswers, selectionIdx) {
    var idx = 2;
    var content = '<div id="rqs"><fieldset id = "t1" data-role="controlgroup"><legend>' + question + '</legend>';
    while (idx <= constAnswers.length) {
        var chkid = 'radio-choice-' + idx;
        if (idx == selectionIdx)
            content += '<input type="radio" name="radio-choice" id="' + chkid + '" value="' + (idx - 1) + '" checked="checked" /><label for="' + chkid + '">' + constAnswers[idx - 1] + '</label>';
        else
            content += '<input type="radio" name="radio-choice" id="' + chkid + '" value="' + (idx - 1) + '" /><label for="' + chkid + '">' + constAnswers[idx - 1] + '</label>';
        idx++;
    }
    content += '</fieldset></div>';
    
    return content;
};

View.prototype.FormatCorrectAnswer = function(answers){
    
    if(answers.constructor === Array)
    {
        var correctAnswer = '';
        var idx =0;
         
        while (idx < answers.length) {
    
            var formatClass = '';
            if (idx % 2 == 0) {
                formatClass = 'alt-cAnswer1';
            } else {
                formatClass = 'alt-cAnswer2';
            }
            correctAnswer += '<span class ="' + formatClass + '">' + answers[idx] + '</span>';
    
            if (idx < answers.length - 1)
                correctAnswer += ',';
            idx++;
        }
        
        return correctAnswer;
        
    }         
    else
    {
        return answers;
    }
};

View.prototype.CreateCategoryList = function (catList, context){
    var listHelper = new ListHelper();
    var cats = '';
    var selectEvents = [];
    var idx = 0;
    while (idx < catList.length) {
        if (catList[idx] !== undefined) {
            cats += '<a id= "z' + idx + '" href="index.html" data-role="button" data-theme="b" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-b"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">' + catList[idx] + '</span></span></a>';

            selectEvents.push({ key: 'z' + idx, value: catList[idx] });
        }
        idx++;
    }
    

    $('#categories').html(cats);       
    
    var that = this;
    console.log('adding links for z');
    listHelper.Addlinks(selectEvents, function(e){
        that._channel.publish( "QryCategoryChanged", { value: e});
    }, context);
};

View.prototype.CreateCSVList = function (catList, context) {
    var listHelper = new ListHelper();
    var cats = '';
    var selectEvents = [];
    var idx = 0;
    while (idx < catList.length) {
        if (catList[idx] !== undefined) {
            cats += '<a id= "s' + idx + '" href="index.html" data-role="button" data-theme="b" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-b cat-but"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">' + catList[idx].value + '</span></span></a>';

            selectEvents.push({ key: 's' + idx, value: catList[idx].key });
            
        }
        idx++;
    }
    
    if(catList.length > 0)
        $('#webcategories').html(cats);
    else
        $('#webcategories').html('<b>No tests found (Click Create to create some)</b>');




    var that = this;

    listHelper.Addlinks(selectEvents, function(e){
        that._channel.publish( "QryCSVChanged", { value: e});
    }, context);
};

View.prototype.CreateResultList = function (results) {
    
    // var makeCol= function(key,val){
    //     var col = '<div class="ui-block-'+ key+'"><div class="ui-bar" style="height:30px"><span>'+ val+'</span></div></div>';
    //     return col;
    // };
    
    var resultsElements = ''; 
    var idx = 0;
    while (idx < results.length) {
        if (results[idx] !== undefined) {
            //resultsElements += makeCol('a',results[idx].type) + makeCol('b',results[idx].subtype) + makeCol('c',results[idx].score +'%');
            
            resultsElements += '<div class="ui-block-a"><div class="ui-bar" style="height:30px">'+ 
                                 '<span>' + results[idx].type+'</span>' 
                                + '<span>' + results[idx].subtype+'</span>'
                                + '<span>' + results[idx].score+'</span>'
                                + '</div></div>';
        }
        idx++;
    }
    
    $('#resultsList').html(resultsElements);
     
};

View.prototype.UpdateView= function (view) {
    //return;
    
    var listEqual = function(l1,l2){
        if(l1.length != l2.length) return false;
        if(l1.length ==0) return true;
        
        var idx =0;
        while(idx < l1.length){
            
            if(l1[idx].key!= undefined && l2[idx].key!=undefined){
               if(l1[idx].key!= l2[idx].key)
                    return false; 
            }
            else
            {
                if(l1[idx]!= l2[idx])
                    return false;
            }   
                
            idx++;
        }
        
        return true;
    };
    //hide everything initially.
    $("#pnlCategories").removeClass("displayPanel").addClass("hidePanel");      //hide categories
    $("#answer-block").removeClass("displayPanel").addClass("hidePanel");       //hide answer block
    $("#pnlQuestions").removeClass("displayPanel").addClass("hidePanel");       //hide questions panel
    $("#pnlCSVList").removeClass("displayPanel").addClass("hidePanel");         //hide csvs
    $("#pnlWebCategories").removeClass("displayPanel").addClass("hidePanel");   //hide web categories
    $("#score-nav").removeClass("displayPanel").addClass("hidePanel");          //hide score 
    $("#question-nav").removeClass("displayPanel").addClass("hidePanel");       //hide question navs
    $("#pnlResults").removeClass("displayPanel").addClass("hidePanel");         //hide result panel
    $("#result-block").removeClass("displayPanel").addClass("hidePanel");       //hide result block
    $("#results-header-block").removeClass("displayPanel").addClass("hidePanel"); 
    $("#pnlCreateTest").removeClass("displayPanel").addClass("hidePanel");         //hide result panel
    $("#create-block").removeClass("displayPanel").addClass("hidePanel");
    $("#edit-block").removeClass("displayPanel").addClass("hidePanel");

    //headers
    $("#header-answer-block").removeClass("displayPanel").addClass("hidePanel");
    $("#header-home-block").removeClass("displayPanel").addClass("hidePanel");
    $("#header-loggedout-block").removeClass("displayPanel").addClass("hidePanel");

    $('#cat_name').html(view.catName);
    $('#test_name').html(view.testName);

    
    $('#login').html(view.loginMessage);    
    
    
      
    if (view.MSTATE == ENUM_STATES.LOGGEDOUT) {
        //header
        $("#header-loggedout-block").removeClass("hidePanel").addClass("displayPanel");
        $('#username').html('Georges Quiz App');
    }
    else
    {
        $('#username').html('Logged in as: '+ view.loginName);
    }

    //display nothing$("#header-loggedout-block").removeClass("displayPanel").addClass("hidePanel");
    //not in test 
    if (view.MSTATE == ENUM_STATES.LOGGEDIN) {
        $("#pnlResults").removeClass("hidePanel").addClass("displayPanel");     
        $("#result-block").removeClass("hidePanel").addClass("displayPanel");   
        $("#results-header-block").removeClass("hidePanel").addClass("displayPanel"); 
        //header
        $("#header-home-block").removeClass("hidePanel").addClass("displayPanel");
        
        if(!listEqual(this.cacheResultsList,view.results)){
            this.cacheResultsList = JSON.parse(JSON.stringify(view.results));
            this.CreateResultList(view.results) ;
        }
 
    }
    
    if (view.MSTATE == ENUM_STATES.INTEST) {//show questions
        $('#answer-so-far').html(this.FormatAnswerSoFar(view.answerSoFar));
        //header
        $("#header-answer-block").removeClass("hidePanel").addClass("displayPanel");
    
        if(view.isMultipleChoice){
            var tpMainBody = this.FormatMultipleChoice(view.multiChoiceQuestion, view.multiChoiceConstantAnswer, view.multiChoiceIdx);            
            $('#mainbody').html(tpMainBody);               
        }else
        {
            $('#mainbody').html(view.mainBody);
        }
        $('#answer-box').val(view.answerBox);
        
        if(view.visibleAnswer){
            $("#answer").removeClass("hidePanel").addClass("displayPanel");
        }else
        {
            $("#answer").removeClass("displayPanel").addClass("hidePanel");
        }
        
        //
        if(view.visibleImage){
            $("#imgPanel").removeClass("hidePanel").addClass("displayPanel");
            $("#sourceid").attr("src", view.imagePath);
        }else
        {
            $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");
            $("#sourceid").attr("src", view.imagePath);
        }
        
        $('#correct-answer').html(this.FormatCorrectAnswer(view.correctAnswer));
        
        $('#question-score').html(view.questionScore + '%');
        
        $('#perc-correct').html(view.percentageCorrect + '%');
        $('#current-question').html(view.currentQuestion);
    
    
        $("#pnlQuestions").removeClass("hidePanel").addClass("displayPanel");   //show questions panel
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
        $("#score-nav").removeClass("hidePanel").addClass("displayPanel");
        $("#question-nav").removeClass("hidePanel").addClass("displayPanel");
        
    }

    if (view.MSTATE == ENUM_STATES.TESTSELECT) {                                                          //show web cats
        $("#pnlWebCategories").removeClass("hidePanel").addClass("displayPanel"); 
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
        //header
        $("#header-home-block").removeClass("hidePanel").addClass("displayPanel");
        
        if(!listEqual(this.cacheCSVList,view.csvList)){
            this.cacheCSVList = JSON.parse(JSON.stringify(view.csvList));
            this.CreateCSVList(view.csvList, this);
        }
    }
    
    if (view.MSTATE == ENUM_STATES.CATEGORYSELECT) {                                                           
        $("#pnlCategories").removeClass("hidePanel").addClass("displayPanel");  //show categories
        //header
        $("#header-home-block").removeClass("hidePanel").addClass("displayPanel");
        $("#edit-block").removeClass("hidePanel").addClass("displayPanel");
        
        //something has changed so display
        if(!listEqual(this.cacheCatList,view.catList)){
            this.cacheCatList = JSON.parse(JSON.stringify(view.catList));
            this.CreateCategoryList(view.catList, this);
        }
    }
    
    // create test panel
    if (view.MSTATE == ENUM_STATES.TESTCREATE) {
        //header
        $("#header-home-block").removeClass("hidePanel").addClass("displayPanel");
        
        $("#result-block").removeClass("displayPanel").addClass("hidePanel");  
        $("#answer-block").removeClass("displayPanel").addClass("hidePanel"); 
        $("#create-block").removeClass("hidePanel").addClass("displayPanel");
        $("#pnlCreateTest").removeClass("hidePanel").addClass("displayPanel");
        //pnlCreateTest
    }

};



View.prototype.PublishStartTestEvent= function () {
    var that =this;
    
    $('#taketest').bind("vclick", function (e) 
    { 
        // console.log('Take Test clicked');
        // that.startTestLock =true;    

        // if(!that.endTestLock)
        //     callback.apply(context);        
        
        // setTimeout(function () {
        //     that.startTestLock =false; 
        //     console.log('unlocked');
        // }, 5000);
        
        that._channel.publish( "QryStartTestEvt", { value: e});
        
    });
};

View.prototype.PublishEndTestEvent = function () {
    var that = this;
    $('#main').bind("vclick", function (e) {
        that._channel.publish( "QryEndTestEvt", { value: e});
        // console.log('Finish Test clicked');
        // that.endTestLock =true;
        
        // if(!that.startTestLock)
        //     callback.apply(context);
            
        // setTimeout(function () {
        //     that.endTestLock =false; 
        //     console.log('unlocked');
        // }, 5000);
    });
};

View.prototype.PublishHistoryLoadEvent= function () {
    var that = this;
    
    $('#createtest').bind("vclick", function (e) { 
        that._channel.publish( "createtestmodeselected", { value: e});
    });
    
    
};





View.prototype.PublishAnswerButtonEvent = function () {
    var that = this;
    
    $("#answer-box").keypress(function (event) {
        if (event.which == 13) {
            //callback.apply(context);
            that._channel.publish( "QryAnswerButtonPress", { value: event});
            
            $('#mainbody').css('position', '');
            $('#mainbody').css('bottom', '');
        }
    });
};

View.prototype.PublishPrevQuestionEvent = function () {
    var that = this;
    $('#prev').bind("vclick", function () { 
        that._channel.publish( "QryPrevQuestionEvt", { value: -1});
    });
};

View.prototype.PublishNextQuestionEvent = function () {
    var that = this;
    $('#next').bind("vclick", function () { 
        that._channel.publish( "QryNextQuestionEvt", { value: 1});
    });
};

View.prototype.PublishSubmitAnswerEvent = function () {
    var that = this;
    $('#submit').bind("vclick", function (e) { 
        //callback.apply(context); 
        that._channel.publish( "QrySubmitEvt", { value: e});
    });
};

View.prototype.PublishSelectTestEvent = function () {//context.listtests();
    var that = this;
    
    $('#choosetest').bind("vclick", function (e) {
        that._channel.publish( "QrySelectTestBtn", { value: e});
    });
};

View.prototype.PublishResetQuestionEvent = function () {
    var that = this;
    $('#select').bind("vclick", function (e) { 
        that._channel.publish( "QryResetQuestionEvt", { value: e});
    });
};

View.prototype.PublishCorrectAnswerButtonEvent = function () {

    var that = this;
    
    $('#show-answer').bind("vclick", function(e){
        that._channel.publish( "QryCorrectAnswerButtonPress", { value: e});
    });
};

View.prototype.PublishLoginClickEvent = function (callback, context) {
    var that = this;
    $('#login').bind("vclick", function (e) { 
        that._channel.publish( "LoginClick", { value: e});
    });
    $('#mainlogin').bind("vclick", function (e) { 
        that._channel.publish( "LoginClick", { value: e});
    });
};

View.prototype.PublishCreateTestClickEvent = function(callback, context){
    var that = this;
    $('#createtestbtn').bind("vclick", function (e) { 
        
        //create-box
        var tp = $('#create-box').val();
        
        that._channel.publish( "createtestclicked", { value: tp});
    });
};

View.prototype.PublishEditClickEvent = function(callback, context){
    var that = this;
    $('#edittestbtn').bind("vclick", function (e) { 
        
        //create-box
        //var tp = $('#edittestbtn').val();
        
        that._channel.publish( "edittestclicked", { value: e});
    });
};