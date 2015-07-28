var QuestionController = function (view, model,drive) {
    this.view = view;
    this.drive = drive;
    this.model = model;
    this.scoreLib = new ScoreLib();
    this.questionLib = new QuestionLib();
    
    this.init();
    
    this.view.QryStartTestEvt(this.qryStartTestEvt, this); 
    this.view.QryEndTestEvt(this.qryEndTestEvt, this);
    
    this.view.QryTestHistorytEvt(this.qryTestHistorytEvt, this);
    
    this.view.QryPrevQuestionEvt(this.qryPrevQuestionEvt, this); 
    this.view.QryNextQuestionEvt(this.qryNextQuestionEvt, this); 
    this.view.QrySubmitEvt(this.qrySubmitEvt, this); 
    this.view.QryAnswerButtonPress(this.qryAnswerButtonPress, this);
    this.view.QryCorrectAnswerButtonPress(this.qryCorrectAnswerButtonPress, this); 
    this.view.QrySelectTestBtn(this.qrySelectTestBtn, this);
    this.view.QryCatBtn(this.qryCatBtn, this);
    this.view.QryCsvBtn(this.qryCsvBtn, this); 
    this.view.QryCategoryChanged(this.qryCategoryChanged, this);
    this.view.QryCSVChanged(this.qryCSVChanged, this);
    this.view.QryModeChanged(this.qryModeChanged, this);
    this.view.QryResetQuestionEvt(this.qryResetQuestionEvt, this);
    this.view.QryNA(this.qryNA,this);
};

QuestionController.prototype = {
    init:function(){
        
    },
    
    qryNA:function(evt){
        if (this.model !== null) {
            this.model.GoogleSheetTestLogin(evt);
        }
    },
    
    qryModeChanged:function(evt){
        if (this.model !== null) {
            this.model.ModeChanged(evt);
        }
    },
    
     
    
    qrySelectTestEvt:function(evt){
        if (this.model !== null) {
            this.view.CmdSetTab(4, function () {});
        }
    },
    qryTestHistorytEvt:function(evt){
        if (this.model !== null) {
            this.view.switchtab(5, function () {});
        }
    },
    
   
    
    qryStartTestEvt:function(evt){
        if (this.model !== null) {
            var that = this;
            console.log('start test');
            
    		if(that.model.validTestSelected()){
    		    
                that.view.CmdResetAnswers();
    		   	
    		   	var selectedCat = that.model.selectedcategory;
    		   	var rawCSVData = that.model.rawCSVData;
    		   	
    		   	var qdata = that.questionLib.CreateQuestionSet(rawCSVData,selectedCat);
    		   	
    			that.model.setQuestionData(qdata);
    			
    			that.displayQuestion(0);
    			
    			that.view.CmdSwitchHeaderContent(0, function () {
    				that.view.CmdSetTab(0,function(){});
    			});
            }
        }
    },
    qryEndTestEvt:function(evt){
        if (this.model !== null) {
            var that = this;
        	that.view.CmdSwitchHeaderContent(1, function () {
    			that.view.CmdSetTab(-1,function(){});
    		});
        }
    },
    qryPrevQuestionEvt:function(evt){
        if (this.model !== null) {
            this.displayQuestion(evt);
        }
    },
    qryNextQuestionEvt:function(evt){
        if (this.model !== null) {
            this.displayQuestion(evt);
        }
    },
    qrySubmitEvt:function(evt){
        if (this.model !== null) {
            this.answerQuestion(evt);
        }
    },
    qryAnswerButtonPress:function(evt){
        if (this.model !== null) {
            this.answerQuestion(evt);
        }
    },
    qryCorrectAnswerButtonPress:function(evt){
        if (this.model !== null) {
            if (this.model.isAnswerDisplayed == true) {
                this.view.CmdDisplayCorrectAnswer('');
                this.model.isAnswerDisplayed = false;
            } else {
                this.view.CmdDisplayCorrectAnswer(this.model.currentQuestionAnswer());
                this.model.isAnswerDisplayed = true;
            }
        }
    },
    qrySelectTestBtn:function(evt){
        if (this.model !== null) {
            this.view.CmdSetTab(2, function () { });
        }
    },
    qryCatBtn:function(evt){
        //button in ui commented out
        if (this.model !== null) {
            console.log('listing categories');
            //var that = this;
            
            // that.questionLib.GetCategoriesFromTest(function(cats){
            //     that.view.CmdDisplayCategoryList(cats.D,that.qryCategoryChanged, that);
            //     that.view.CmdSetTab(5, function () { });
            // });
            
            this.view.CmdSetTab(5, function () { });
        }
    },
    qryCsvBtn:function(evt){
        // button in ui commented out
        if (this.model !== null) {
            //this.model.listtests(evt);
            
            console.log('listing csvs(tests)');
            var that = this;
            
            that.drive.SearchForQuizFolder('quiz', function(quizlist){
                console.log('fetched list of quizs: '+quizlist);
                that.model.listoftests = quizlist;
                that.view.CmdDisplayCSVList(that.model.listoftests,that.qryCSVChanged, that);
                that.view.CmdSetTab(4, function () { });
            });
            
        }
    },
    
    qryCategoryChanged:function(evt){
        if (this.model !== null) {
            this.model.selectedcategory = evt;
            this.view.CmdSetCatName(this.model.selectedcategory);
        }
    },
    qryCSVChanged:function(evt){
        var that = this;
        
        if (that.model !== null) {
            that.model.selectedCSV = evt;
            that.drive.ReadSheet(that.model.SelectedTestName().url, function(csv,cats){
                that.questionLib.ParseCats(csv, function(csv,cats){
                    that.model.rawCSVData = csv;
                    that.model.categories = cats;
                    
                    that.view.CmdDisplayCategoryList(cats.D,that.qryCategoryChanged, that);
                });
                
            });
            
            that.view.CmdSetTestName(that.model.SelectedTestName().value);
        }
    },
    
    qryResetQuestionEvt:function(evt){
        if (this.model !== null) {
            
            this.model.ResetQuestion(evt);
            
    	    this.model.score = this.scoreLib.GetQuestionSetScore(this.model.questionset);
    	    
    	    this.view.CmdDisplayScore(this.model.currentQuestion().score, this.model.score);
    	    
    	    this.displayQuestion();
        }
    },
    
    displayQuestion: function (pos) {

        this.model.currentQuestionState = [];
        this.model._changeCurrentQuestion(pos);
        
        this.view.CmdDisplayCorrectAnswer('');
        this.view.CmdUpdateAnswerSoFar('');
    
        this.model.isAnswerDisplayed = false;
        
        if (this.model.currentQuestionSetLength() > 0) {
            var question = this.model.currentQuestion();
                         
            this.view.CmdDisplayScore(question.score);

            var attemptedAnswer = question.attemptedAnswer;

            switch (question.type) {
                case 0:
                    this.view.CmdDisplayStandardQuestion(question.question,attemptedAnswer);
                    break;
                case 1:
                    this.view.CmdDisplayMultipleChoice(question.question, 
                                                        question.constAnswers, 
                                                        parseInt(attemptedAnswer) + 1);
                    break;
                case 2:
                    this.view.CmdDisplayImageQuestion(question.question, attemptedAnswer);
                    break;
                case 3:// multi answer
                    this.view.CmdDisplayMultiAnswerQuestion(question.question, attemptedAnswer);
                    this.view.CmdDisplayAnswerSoFar(question.correctAnswers);
                    break;
                case 4:// multi ordered answer
                    this.view.CmdDisplaySortedMultiAnswerQuestion(question.question, attemptedAnswer);
                    break;
            }
            this.view.CmdUpdateCurrentQuestionLabel(this.model.currentQuestionIdx + 1, this.model.currentQuestionSetLength());

        } else {
            this.view.CmdDisplayNoQuestion();
        }


        //  $('#mainbody').html(content);
        //how long did it take to work out i needed to call this - on a containing div not the content!!
        $("#rqs").trigger('create');

    },
    
    answerQuestion: function () {
        var that = this;

        var gotAnswer = function(answer){

            var question =  that.model.currentQuestion();

            var processScore = function(){
                that.model.score = that.scoreLib.GetQuestionSetScore(that.model.questionset);
                
                that.view.CmdDisplayScore(question.score, that.model.score);
                
                switch (question.type) {
                    case 3:
                    case 4:
                        that.view.CmdUpdateMiscTextBoxs(question.correctAnswers, 
                                                question.answer,
                                                question.question, '');
                        break;
                }
            };

            question.attemptedAnswer = answer;
            
            switch (question.type) {
                case 0:
                case 1:  
                    that.scoreLib.GetScoreBasic(question,answer,processScore);
                    break;
                case 2:
                    // image question
                    break;
                case 3:
                    // multiple answers
                    that.scoreLib.GetScoreMultiAnswer(question,answer,processScore);
                    break;
                case 4:
                    // multiple answers
                    that.scoreLib.GetScoreOrderedMultiAnswer(question, answer,processScore);
                    break;
            }
        };

        that.view.QryAnswer(function(answer){
            gotAnswer(answer);
        },that);
    }
}