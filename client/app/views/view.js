function View(channel) {       
  // this.tabChanged = null;
    this._channel = channel;
    
    this.categoryChanged = null;
    this.csvChanged = null;
    this.modeChanged =null;
    this.endTestLock =false;
    this.startTestLock =false;
    this.loginAllowed =false;
    
    var that = this;
    
    this._channel.subscribe("RequestAnswer", function(data, envelope) {
        //that.QryAnswer(data.value);
        
        var radioBox = $("input[name*=radio-choice]:checked").val();
        var txtBox = $('#answer-box').val();
        
        var answer = (txtBox == '') ? radioBox : txtBox;
        
        that._channel.publish( "QryAnswer", { value: answer});
    
    });
    
    that.PublishQryStartTestEvt();
    that.PublishQryEndTestEvt();
    that.PublishQryTestHistoryEvt();
    that.PublishAnswerButtonPress();
    that.PublishQryPrevQuestionEvt();
    that.PublishQryNextQuestionEvt();
    that.PublishQrySubmitEvt();
    that.PublishQrySelectTestBtn();
    that.PublishQryCatBtn();
    that.PublishQryCsvBtn();
    that.PublishQryResetQuestionEvt();
    that.PublishQryCorrectAnswerButtonPress();
    that.PublishQryLoginClick();
} 

View.prototype.CmdUpdateLogin = function(enabled, text){

    $('#login').html(text);
};

View.prototype.CmdDisplayScore = function (questionScore, testScore){
    $('#question-score').html(questionScore + '%');

    if (testScore != undefined)
        $('#perc-correct').html(testScore + '%');
};

View.prototype.CmdDisplayCorrectAnswer = function (answers){
    
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
        
        $('#correct-answer').html(correctAnswer);
    }         
    else
    {
        $('#correct-answer').html(answers);
    }
};

View.prototype.CmdSwitchHeaderContent= function (type, modeChanged) {
        
    // main header
    if (type == 0) {            
        $("#header-answer-block").removeClass("hidePanel").addClass("displayPanel");
        $("#header-home-block").removeClass("displayPanel").addClass("hidePanel");
        modeChanged();
    }
    
    // answer mode header
    if (type == 1) {
        $("#header-answer-block").removeClass("displayPanel").addClass("hidePanel");
        $("#header-home-block").removeClass("hidePanel").addClass("displayPanel");           
        modeChanged();
    }            
};

View.prototype.CmdSetTab = function (tabidx,tabChanged){
    $("#pnlCategories").removeClass("displayPanel").addClass("hidePanel");      //hide categories
    $("#test-sel").removeClass("displayPanel").addClass("hidePanel");           //hide test selectors
    $("#answer-block").removeClass("displayPanel").addClass("hidePanel");       //hide answer block
    $("#pnlQuestions").removeClass("displayPanel").addClass("hidePanel");       //hide questions panel
    $("#pnlCSVList").removeClass("displayPanel").addClass("hidePanel");         //hide csvs
    $("#pnlWebCategories").removeClass("displayPanel").addClass("hidePanel");   //hide web categories
    $("#score-nav").removeClass("displayPanel").addClass("hidePanel");          //hide score 
    $("#question-nav").removeClass("displayPanel").addClass("hidePanel");       //hide question navs
    
    //display nothing
    if (tabidx == -1) { 
        tabChanged();
    }
    
    if (tabidx == 0) {                                                          //show questions
        $("#pnlQuestions").removeClass("hidePanel").addClass("displayPanel");   //show questions panel
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
        $("#score-nav").removeClass("hidePanel").addClass("displayPanel");
        $("#question-nav").removeClass("hidePanel").addClass("displayPanel");
        tabChanged();
    }

    if (tabidx == 1) {                                                           
        $("#pnlCategories").removeClass("hidePanel").addClass("displayPanel");  //show categories
        $("#test-sel").removeClass("hidePanel").addClass("displayPanel");       //show test selectors
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
        tabChanged();
    }

    if (tabidx == 2) {                                                          
        $("#pnlCSVList").removeClass("hidePanel").addClass("displayPanel");     //show csv list
        $("#test-sel").removeClass("hidePanel").addClass("displayPanel");       //show test selectors
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
        tabChanged();
    }

    if (tabidx == 4) {                                                          //show web cats
        $("#pnlWebCategories").removeClass("hidePanel").addClass("displayPanel"); 
        $("#test-sel").removeClass("hidePanel").addClass("displayPanel");       //show test selectors
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
        tabChanged();
    }
    if (tabidx == 5) {                                                           
        $("#pnlCategories").removeClass("hidePanel").addClass("displayPanel");  //show categories
        tabChanged();
    }
};

View.prototype.CmdDisplayCategoryList = function (catList,evt, context){
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

    listHelper.Addlinks(selectEvents, evt, context);
};

View.prototype.CmdDisplayCSVList = function (catList,evt, context) {
    var listHelper = new ListHelper();
    var cats = '';
    var selectEvents = [];
    var idx = 0;
    while (idx < catList.length) {
        if (catList[idx] !== undefined) {
            cats += '<a id= "s' + idx + '" href="index.html" data-role="button" data-theme="b" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-b"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">' + catList[idx].value + '</span></span></a>';

            selectEvents.push({ key: 's' + idx, value: catList[idx].key });
        }
        idx++;
    }
    $('#webcategories').html(cats);
    
    listHelper.Addlinks(selectEvents, evt, context);
};
//updateBoxs
View.prototype.CmdUpdateMiscTextBoxs = function(currentQuestionState, answer, content, answerBox){
    // var answersofar = '<\BR>' + 'Progress so far: ' + '<\BR>' + answer.length + '<\BR>';
    // var idx = 0;
    // while (idx < currentQuestionState.length) {
    //     answersofar += currentQuestionState[idx] + ' ';
    //     idx++;
    // }

    $('#answer-box').val(answerBox);
    $('#mainbody').html(content); //question box
    //$('#answer-so-far').html(answersofar);
    
    this.CmdDisplayAnswerSoFar(currentQuestionState, answer);
};

View.prototype.CmdDisplayAnswerSoFar = function(currentQuestionState){
    var answersofar = '<\BR>' + 'Progress so far: ' + '<\BR>' + currentQuestionState.length + '<\BR>';
    var idx = 0;
    while (idx < currentQuestionState.length) {
        answersofar += currentQuestionState[idx] + ' ';
        idx++;
    }
    
    $('#answer-so-far').html(answersofar);
};

View.prototype.CmdDisplayStandardQuestion =function (question, answer) {
    $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");

    $("#answer").removeClass("hidePanel").addClass("displayPanel");

    $('#answer-box').val(answer);

    $('#mainbody').html(question);
};

View.prototype.CmdDisplayMultipleChoice = function (question, constAnswers, selectionIdx) {

    $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");
    $("#answer").removeClass("displayPanel").addClass("hidePanel");

    //need to check if we have an answer saved for this question 
    //which should be stored in the form of an index
    //we can do a simple comparison against that.
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

    $('#mainbody').html(content);
};

View.prototype.CmdDisplayImageQuestion = function (question, answerSet) {

    $('#answer-box').val(answerSet);
    $("#imgPanel").removeClass("hidePanel").addClass("displayPanel");
    $("#sourceid").attr("src", question);
    //multi answer   
};

View.prototype.CmdDisplayMultiAnswerQuestion = function (question,answer) {
    $("#answer").removeClass("hidePanel").addClass("displayPanel");
    $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");
    $('#mainbody').html(question);
    $('#answer-box').val(answer);
    //multi answer   
};

View.prototype.CmdDisplaySortedMultiAnswerQuestion = function (question,answer) {
    $("#answer").removeClass("hidePanel").addClass("displayPanel");
    $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");
    $('#mainbody').html(question);
    $('#answer-box').val(answer);
    //multi answer   
};

View.prototype.CmdResetAnswers =function () {
    $('#mainbody').html('');
    $('#perc-correct').html('');
    $('#question-score').html('');
    $('#answer-so-far').html(''); 
};

View.prototype.CmdUpdateCurrentQuestionLabel= function (currentQuestion, totalQuestions) {
    $('#current-question').html(currentQuestion + ' of ' + totalQuestions);
};
    
View.prototype.CmdDisplayNoQuestion= function () {
    $("#answer").removeClass("displayPanel").addClass("hidePanel");
    $('#mainbody').html('no questions');
};
    
View.prototype.CmdUpdateAnswerSoFar= function (answerSoFar) {
    $('#answer-so-far').html(answerSoFar);
};
    
View.prototype.CmdSetTestName= function (title) {
    $('#test_name').html(title);
};

View.prototype.CmdSetCatName= function (title) {
    $('#cat_name').html(title);
};




View.prototype.PublishQryStartTestEvt= function () {
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

View.prototype.PublishQryEndTestEvt = function () {
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

View.prototype.PublishQryTestHistoryEvt= function () {
    var that = this;
    $('#history').bind("vclick", function (e) { 
        that._channel.publish( "QryTestHistoryEvt", { value: e});
    });
};

View.prototype.PublishAnswerButtonPress = function () {
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

View.prototype.PublishQryPrevQuestionEvt = function () {
    var that = this;
    $('#prev').bind("vclick", function () { 
        that._channel.publish( "QryPrevQuestionEvt", { value: -1});
    });
};

View.prototype.PublishQryNextQuestionEvt = function () {
    var that = this;
    $('#next').bind("vclick", function () { 
        that._channel.publish( "QryNextQuestionEvt", { value: 1});
    });
};

View.prototype.PublishQrySubmitEvt = function () {
    var that = this;
    $('#submit').bind("vclick", function (e) { 
        //callback.apply(context); 
        that._channel.publish( "QrySubmitEvt", { value: e});
    });
};

View.prototype.PublishQrySelectTestBtn = function () {//context.listtests();
    var that = this;
    
    $('#choosetest').bind("vclick", function (e) {
        that._channel.publish( "QrySelectTestBtn", { value: e});
        //callback.apply(context);
    });
};

//now unused as cats has been commented out
// we dont currently need that functionality 
View.prototype.PublishQryCatBtn = function () {//context.listtests();
    var that = this;
    
    $('#cats').bind("vclick", function (e) {
        //callback.apply(context);
        that._channel.publish( "QryCatBtn", { value: e});
    });
};

//now unused as csv has been commented out
// we dont currently need that functionality 
View.prototype.PublishQryCsvBtn = function () {//context.listtests();
    var that = this;
    
    $('#csvs').bind("vclick", function (e) {
        //callback.apply(context);
        that._channel.publish( "QryCsvBtn", { value: e});
    });
};

View.prototype.PublishQryResetQuestionEvt = function () {
    var that = this;
    $('#select').bind("vclick", function (e) { 
        that._channel.publish( "QryResetQuestionEvt", { value: e});
    });
};

View.prototype.PublishQryCorrectAnswerButtonPress = function () {

    var that = this;
    
    $('#show-answer').bind("vclick", function(e){
        that._channel.publish( "QryCorrectAnswerButtonPress", { value: e});
    });
};

View.prototype.PublishQryLoginClick = function (callback, context) {
    var that = this;
    $('#login').bind("vclick", function (e) { 
        
        that._channel.publish( "LoginClick", { value: e});

    });
};


