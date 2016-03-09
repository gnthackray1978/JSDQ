function TestView(){
    
    this.currentQuestion ='';
    this.answerSoFar ='';
    this.answerBox ='';
    this.testName ='';
    this.catName ='';
    this.mainBody ='';
    this.imagePath = '';
    this.correctAnswer ='';
    this.percentageCorrect =0;
    this.questionScore=0;
    this.tabIdx =0;
    this.headerIdx=1;
    
    this.visibleAnswer=false;
    this.visibleImage=false;
    
}

function View(channel) {       
  // this.tabChanged = null;
    this._channel = channel;
    this._testView = new TestView();
    
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

View.prototype.CmdResetAnswers =function () {
    
    // $('#perc-correct').html('');
    // $('#question-score').html('');
    // $('#answer-so-far').html(''); 
    // $('#mainbody').html('');
    
    this._testView.questionScore = 0;
    
    this._testView.percentageCorrect = 0;
    
    this._testView.answersofar ='';
    
    this._testView.mainBody ='';
    
    this.UpdateView(this._testView); 
};

View.prototype.CmdDisplayScore = function (questionScore, percentageCorrect){
    // $('#question-score').html(questionScore + '%');

    // if (percentageCorrect != undefined)
    //     $('#perc-correct').html(percentageCorrect + '%');
        
        
    this._testView.questionScore = questionScore;
    
    this._testView.percentageCorrect = percentageCorrect;
    
    this.UpdateView(this._testView);    
};

View.prototype.CmdDisplayQuestionScore = function (questionScore){
    // $('#question-score').html(questionScore + '%');

    // if (percentageCorrect != undefined)
    //     $('#perc-correct').html(percentageCorrect + '%');
        
    this._testView.questionScore = questionScore;

    this.UpdateView(this._testView);    
};



View.prototype.CmdDisplayCorrectAnswer = function (answers){

    var formattedAnswers = this.FormatCorrectAnswer(answers);
    
    //$('#correct-answer').html(formattedAnswers);

    this._testView.correctAnswer = formattedAnswers;
    
    this.UpdateView(this._testView);
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


View.prototype.CmdSwitchHeaderContent= function (type, modeChanged) {
    // var that = this;
    
    // // main header
    // if (type == 0) {            
    //     $("#header-answer-block").removeClass("hidePanel").addClass("displayPanel");
    //     $("#header-home-block").removeClass("displayPanel").addClass("hidePanel");
    // }
    
    // // answer mode header
    // if (type == 1) {
    //     $("#header-answer-block").removeClass("displayPanel").addClass("hidePanel");
    //     $("#header-home-block").removeClass("hidePanel").addClass("displayPanel");           
    // }
    
    this._testView.headerIdx = type;
    
    this.UpdateView(this._testView);
};

View.prototype.CmdSetTab = function (tabidx,tabChanged){
    // $("#pnlCategories").removeClass("displayPanel").addClass("hidePanel");      //hide categories
    // $("#test-sel").removeClass("displayPanel").addClass("hidePanel");           //hide test selectors
    // $("#answer-block").removeClass("displayPanel").addClass("hidePanel");       //hide answer block
    // $("#pnlQuestions").removeClass("displayPanel").addClass("hidePanel");       //hide questions panel
    // $("#pnlCSVList").removeClass("displayPanel").addClass("hidePanel");         //hide csvs
    // $("#pnlWebCategories").removeClass("displayPanel").addClass("hidePanel");   //hide web categories
    // $("#score-nav").removeClass("displayPanel").addClass("hidePanel");          //hide score 
    // $("#question-nav").removeClass("displayPanel").addClass("hidePanel");       //hide question navs
    
    // //display nothing
    // if (tabidx == -1) { 
    //     tabChanged();
    // }
    
    // if (tabidx == 0) {                                                          //show questions
    //     $("#pnlQuestions").removeClass("hidePanel").addClass("displayPanel");   //show questions panel
    //     $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
    //     $("#score-nav").removeClass("hidePanel").addClass("displayPanel");
    //     $("#question-nav").removeClass("hidePanel").addClass("displayPanel");
    //     tabChanged();
    // }

    // if (tabidx == 1) {                                                           
    //     $("#pnlCategories").removeClass("hidePanel").addClass("displayPanel");  //show categories
    //     $("#test-sel").removeClass("hidePanel").addClass("displayPanel");       //show test selectors
    //     $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
    //     tabChanged();
    // }

    // if (tabidx == 2) {                                                          
    //     $("#pnlCSVList").removeClass("hidePanel").addClass("displayPanel");     //show csv list
    //     $("#test-sel").removeClass("hidePanel").addClass("displayPanel");       //show test selectors
    //     $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
    //     tabChanged();
    // }

    // if (tabidx == 4) {                                                          //show web cats
    //     $("#pnlWebCategories").removeClass("hidePanel").addClass("displayPanel"); 
    //     $("#test-sel").removeClass("hidePanel").addClass("displayPanel");       //show test selectors
    //     $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
    //     tabChanged();
    // }
    // if (tabidx == 5) {                                                           
    //     $("#pnlCategories").removeClass("hidePanel").addClass("displayPanel");  //show categories
    //     tabChanged();
    // }
    
    this._testView.tabIdx = tabidx;
    
    this.UpdateView(this._testView);
};

//exception
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

//exception
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
   
   // $('#answer-box').val(answerBox);
    this._testView.answerBox = answerBox;
    
  //  $('#mainbody').html(content); //question box
    this._testView.mainBody = answerBox;
 
    //this.CmdDisplayAnswerSoFar(currentQuestionState, answer);
    
    var answersofar = this.FormatAnswerSoFar(currentQuestionState);
    
    this._testView.answerSoFar = answersofar;
    
   // $('#answer-so-far').html(answersofar);
    
    
    this.UpdateView(this._testView);
};

View.prototype.CmdDisplayAnswerSoFar = function(currentQuestionState){
    
    var answersofar = this.FormatAnswerSoFar(currentQuestionState);
    
    this._testView.answerSoFar = answersofar;
    
   // $('#answer-so-far').html(answersofar);
    
    this.UpdateView(this._testView);
};

View.prototype.FormatAnswerSoFar =function (currentQuestionState) {
    var answersofar = '<\BR>' + 'Progress so far: ' + '<\BR>' + currentQuestionState.length + '<\BR>';
    var idx = 0;
    while (idx < currentQuestionState.length) {
        answersofar += currentQuestionState[idx] + ' ';
        idx++;
    }
    
    return answersofar;
};

View.prototype.CmdDisplayStandardQuestion =function (question, answer) {
 //   $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");
    this._testView.visibleImage =false;

  //  $("#answer").removeClass("hidePanel").addClass("displayPanel");
    this._testView.visibleAnswer =true;

  //  $('#answer-box').val(answer);
    this._testView.answerBox = answer;

  //  $('#mainbody').html(question);
    this._testView.mainBody = question;
    
    
    this.UpdateView(this._testView);
};

View.prototype.CmdDisplayMultipleChoice = function (question, constAnswers, selectionIdx) {

 //   $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");
    this._testView.visibleImage =false;

 //   $("#answer").removeClass("displayPanel").addClass("hidePanel");
    this._testView.visibleAnswer =false;

    var content = this.FormatMultipleChoice(question, constAnswers, selectionIdx);

    this._testView.mainBody = content;

 //   $('#mainbody').html(content);
    
    this.UpdateView(this._testView);
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

View.prototype.CmdDisplayImageQuestion = function (question, answerSet) {

  //  $('#answer-box').val(answerSet);
    this._testView.answerBox = answerSet;
    
   // $("#imgPanel").removeClass("hidePanel").addClass("displayPanel");
    this._testView.visibleImage =true;
    
   // $("#sourceid").attr("src", question);
    
    this._testView.imagePath = question;
    
    this.UpdateView(this._testView);
    
    //multi answer   
};

View.prototype.CmdDisplayMultiAnswerQuestion = function (question,answer) {
   // $("#answer").removeClass("hidePanel").addClass("displayPanel");
    this._testView.visibleAnswer =true;
    
 //   $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");
    this._testView.visibleImage =false;
    
   // $('#mainbody').html(question);
    this._testView.mainBody = question;
    
   // $('#answer-box').val(answer);
    this._testView.answerBox = answer;
    
    
    this.UpdateView(this._testView);
};

View.prototype.CmdDisplaySortedMultiAnswerQuestion = function (question,answer) {
  //  $("#answer").removeClass("hidePanel").addClass("displayPanel");
    this._testView.visibleAnswer =true;
    
   // $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");
   
    this._testView.visibleImage =false;
    
  //  $('#mainbody').html(question);
    this._testView.mainBody = question;
   // $('#answer-box').val(answer);
    this._testView.answerBox = answer;
    //multi answer   
    
    this.UpdateView(this._testView);
};

View.prototype.CmdUpdateCurrentQuestionLabel= function (currentQuestion, totalQuestions) {
  //  $('#current-question').html(currentQuestion + ' of ' + totalQuestions);
    
    this._testView.currentQuestion = currentQuestion + ' of ' + totalQuestions;
    this.UpdateView(this._testView);
};
    
View.prototype.CmdDisplayNoQuestion= function () {
   // $("#answer").removeClass("displayPanel").addClass("hidePanel");
   // $('#mainbody').html('no questions');
    
    this._testView.mainBody = 'no questions';
    this._testView.visibleAnswer =false;
    this.UpdateView(this._testView);
};
    
View.prototype.CmdUpdateAnswerSoFar= function (answerSoFar) {
  //  $('#answer-so-far').html(answerSoFar);
    
    this._testView.answerSoFar = answerSoFar;
    this.UpdateView(this._testView);
};
    
View.prototype.CmdSetTestName= function (title) {
   // $('#test_name').html(title);
    
    this._testView.testName = title;
    this.UpdateView(this._testView);
};

View.prototype.CmdSetCatName= function (title) {
 //   $('#cat_name').html(title);
    
    this._testView.catName = title;
    this.UpdateView(this._testView);
};

View.prototype.UpdateView= function (view) {
    //return;
    
    //hide everything initially.
    $("#pnlCategories").removeClass("displayPanel").addClass("hidePanel");      //hide categories
    $("#test-sel").removeClass("displayPanel").addClass("hidePanel");           //hide test selectors
    $("#answer-block").removeClass("displayPanel").addClass("hidePanel");       //hide answer block
    $("#pnlQuestions").removeClass("displayPanel").addClass("hidePanel");       //hide questions panel
    $("#pnlCSVList").removeClass("displayPanel").addClass("hidePanel");         //hide csvs
    $("#pnlWebCategories").removeClass("displayPanel").addClass("hidePanel");   //hide web categories
    $("#score-nav").removeClass("displayPanel").addClass("hidePanel");          //hide score 
    $("#question-nav").removeClass("displayPanel").addClass("hidePanel");       //hide question navs
    
    
    
    $('#cat_name').html(view.catName);
    $('#test_name').html(view.testName);
    $('#answer-so-far').html(view.answerSoFar);
    $('#mainbody').html(view.mainBody);
    $('#answer-box').val(view.answerBox);
    $('#correct-answer').html(view.correctAnswer);
    
    $('#question-score').html(view.questionScore + '%');

    $('#perc-correct').html(view.percentageCorrect + '%');
    $('#current-question').html(view.currentQuestion);
        
        
    if(view.visibleAnswer){
        $("#answer").removeClass("displayPanel").addClass("hidePanel");
    }else
    {
        $("#answer").removeClass("hidePanel").addClass("displayPanel");
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
    
    
        //display nothing
    if (view.tabIdx == -1) { 
    }
    
    if (view.tabIdx == 0) {                                                          //show questions
        $("#pnlQuestions").removeClass("hidePanel").addClass("displayPanel");   //show questions panel
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
        $("#score-nav").removeClass("hidePanel").addClass("displayPanel");
        $("#question-nav").removeClass("hidePanel").addClass("displayPanel");
    }

    if (view.tabIdx == 1) {                                                           
        $("#pnlCategories").removeClass("hidePanel").addClass("displayPanel");  //show categories
        $("#test-sel").removeClass("hidePanel").addClass("displayPanel");       //show test selectors
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
    }

    if (view.tabIdx == 2) {                                                          
        $("#pnlCSVList").removeClass("hidePanel").addClass("displayPanel");     //show csv list
        $("#test-sel").removeClass("hidePanel").addClass("displayPanel");       //show test selectors
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
    }

    if (view.tabIdx == 4) {                                                          //show web cats
        $("#pnlWebCategories").removeClass("hidePanel").addClass("displayPanel"); 
        $("#test-sel").removeClass("hidePanel").addClass("displayPanel");       //show test selectors
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
    }
    if (view.tabIdx == 5) {                                                           
        $("#pnlCategories").removeClass("hidePanel").addClass("displayPanel");  //show categories
    }
    
    // main header
    if (view.headerIdx == 0) {            
        $("#header-answer-block").removeClass("hidePanel").addClass("displayPanel");
        $("#header-home-block").removeClass("displayPanel").addClass("hidePanel");
    }
    
    // answer mode header
    if (view.headerIdx == 1) {
        $("#header-answer-block").removeClass("displayPanel").addClass("hidePanel");
        $("#header-home-block").removeClass("hidePanel").addClass("displayPanel");           
    }
    


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


