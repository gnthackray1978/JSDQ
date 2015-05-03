function View() {       
  // this.tabChanged = null;
   this.categoryChanged = null;
   this.csvChanged = null;
   this.modeChanged =null;
} 

View.prototype.SetDisplayScore = function (questionScore, testScore){
      $('#question-score').html(questionScore + '%');

        if (testScore != undefined)
            $('#perc-correct').html(testScore + '%');
};

View.prototype.SetDisplayCorrectAnswer = function (answer){
    $('#correct-answer').html(answer);
};

 //switchtab: function (tabidx, tab1) {
View.prototype.CmdSetTab = function (tabidx,tabChanged){

    var panels = new Panels();

    if (tabidx == 0) {
        panels.masterShowTab(1);
        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
        $("#score-nav").removeClass("hidePanel").addClass("displayPanel");
        $("#question-nav").removeClass("hidePanel").addClass("displayPanel");
        $("#test-sel").addClass("hidePanel").removeClass("displayPanel");
        tabChanged();
    }

    if (tabidx == 1) {
        panels.masterShowTab(2);

        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
        $("#score-nav").addClass("hidePanel").removeClass("displayPanel");
        $("#question-nav").addClass("hidePanel").removeClass("displayPanel");
        $("#test-sel").removeClass("hidePanel").addClass("displayPanel");

        tabChanged();
    }

    if (tabidx == 2) {
        panels.masterShowTab(3);

        $("#answer-block").removeClass("hidePanel").addClass("displayPanel");
        $("#score-nav").addClass("hidePanel").removeClass("displayPanel");
        $("#question-nav").addClass("hidePanel").removeClass("displayPanel");
        $("#test-sel").addClass("displayPanel").removeClass("hidePanel");

        tabChanged();
    }

    if (tabidx == 3) {
        panels.masterShowTab(4); 
        tabChanged();          
    }

    if (tabidx == 4) {
        panels.masterShowTab(5);
        tabChanged();
    }
    
    if (tabidx == 5) {
        panels.masterShowTab(6);
        tabChanged();
    }
};

View.prototype.CmdDisplayCategoryList = function (catList, context){
    var listHelper = new ListHelper();
    var cats = '';
    var selectEvents = [];
    var idx = 0;
    while (idx < catList.length) {
        if (catList[idx] !== undefined) {
            cats += '<a id= "s' + idx + '" href="index.html" data-role="button" data-theme="b" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-b"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">' + catList[idx] + '</span></span></a>';

            selectEvents.push({ key: 's' + idx, value: catList[idx] });
        }
        idx++;
    }
    

    $('#categories').html(cats);       

    listHelper.Addlinks(selectEvents, this.categoryChanged, context);
};

View.prototype.CmdDisplayCSVList = function (catList, context) {
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
    
    listHelper.addlinks(selectEvents, this.csvChanged, context);
};
//updateBoxs
View.prototype.CmdUpdateMiscTextBoxs = function(currentQuestionState, answer, content, answerBox){
    var answersofar = '<\BR>' + 'Progress so far: ' + '<\BR>' + answer.length + '<\BR>';
    var idx = 0;
    while (idx < currentQuestionState.length) {
        answersofar += currentQuestionState[idx] + ' ';
        idx++;
    }

    $('#answer-box').val(answerBox);
    $('#mainbody').html(content); //question box
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

View.prototype.CmdDisplayMultiAnswerQuestion = function (question) {
    $("#answer").removeClass("hidePanel").addClass("displayPanel");
    $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");
    $('#mainbody').html(question);
    //multi answer   
};

View.prototype.CmdDisplaySortedMultiAnswerQuestion = function (question) {
    $("#answer").removeClass("hidePanel").addClass("displayPanel");
    $("#imgPanel").removeClass("displayPanel").addClass("hidePanel");
    $('#mainbody').html(question);
    //multi answer   
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
    
View.prototype.CmdSetTitle= function (title) {
    $('#title').html(title);
};

View.prototype.CmdSetCSV= function (title) {
    $('#title').html(title);
};




View.prototype.QryModeChanged= function(switchFunc){
    this.modeChanged = switchFunc;
};

View.prototype.QryLoginEvt= function (callback, context) {
    var myArray = [1];
    $('#login').bind("vclick", function () { callback.apply(context, myArray); });
};
    
View.prototype.QryStartTestEvt= function (callback, context) {
    var myArray = [1];
    $('#taketest').bind("vclick", function () { callback.apply(context, myArray); });
};
    
View.prototype.QrySelectTestEvt= function (callback, context) {
    var myArray = [1];
    $('#choosetest').bind("vclick", function () { callback.apply(context, myArray); });
};
    
View.prototype.QryTestHistorytEvt= function (callback, context) {
    var myArray = [1];
    $('#history').bind("vclick", function () { callback.apply(context, myArray); });
};
    
View.prototype.QryEndTestEvt= function (callback, context) {
    var myArray = [1];
    $('#next').bind("vclick", function () { callback.apply(context, myArray); });
};

View.prototype.QryMainSelectBtn = function (callback, context) {//context.listtests();
    $('#main').bind("vclick", function () {
            //  context.view.switchtab(0, function () { });
            callback.apply(context);
        }
    );
};

View.prototype.QryPrevQuestionEvt = function (callback, context) {
    var myArray = [-1];
    $('#prev').bind("vclick", function () { callback.apply(context, myArray); });
};

View.prototype.QryNextQuestionEvt = function (callback, context) {
    var myArray = [1];
    $('#next').bind("vclick", function () { callback.apply(context, myArray); });
};

View.prototype.QrySubmitEvt = function (callback, context) {
    $('#submit').bind("vclick", function () { callback.apply(context); });
};

View.prototype.QryAnswerButtonPress = function (callback, context) {
    $("#answer-box").keypress(function (event) {
        if (event.which == 13) {
            callback.apply(context);
            $('#mainbody').css('position', '');
            $('#mainbody').css('bottom', '');
        }
    });
};

View.prototype.QryCorrectAnswerButtonPress = function (callback, context) {
    var debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    };
    var myEfficientFn = debounce(function () {
        callback.apply(context);
    }, 500);
    
    $('#show-answer').bind("vclick", myEfficientFn);
};

View.prototype.QrySelectTestBtn = function (callback, context) {//context.listtests();
    $('#choosetest').bind("vclick", function () {
            context.view.switchtab(1, function () { });
            callback.apply(context);
        }
    );
};

View.prototype.QryCatBtn = function (callback, context) {//context.listtests();
    $('#cats').bind("vclick", function () {
            context.view.switchtab(1, function () { });
            callback.apply(context);
        }
    );
};
    
View.prototype.QryCsvBtn = function (callback, context) {//context.listtests();

    $('#csvs').bind("vclick", function () {
            context.view.switchtab(2, function () { });
            callback.apply(context);
        }
    );
};
//GetAnswer
View.prototype.QryAnswer = function (action){
    action($('#answer-box').val());
};
 
// View.prototype.QryTabChanged = function (action){
//   this.tabChanged = action;
   
// };

View.prototype.QryCategoryChanged = function (action){
   this.categoryChanged = action;
};

View.prototype.QryCSVChanged = function (action){
   this.csvChanged = action;
};