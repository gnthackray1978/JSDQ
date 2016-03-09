var QuestionController = function (view, model,drive,channel) {
    this._channel = channel;;
    
    this.view = view;
    this.drive = drive;
    this.quizObj = model;
    
    this.scoreLib = new ScoreLib();
    this.questionLib = new QuestionLib();
    
    this.viewData = {
        categoryChanged : null,
        csvChanged : null,
        modeChanged :null,
        endTestLock :false,
        startTestLock :false,
        loginAllowed :false 
    };
    
    this.init();
    this.model = new QuizVM(channel);
    
    var that = this;

    this._channel.subscribe("QryStartTestEvt", function(data, envelope) {
        
        console.log('Take Test clicked');
        that.viewData.startTestLock =true;    

        if(!that.viewData.endTestLock)
            that.qryStartTestEvt(data.value);      
        
        setTimeout(function () {
            that.viewData.startTestLock =false; 
            console.log('unlocked');
        }, 5000);
        
    });
    
    this._channel.subscribe("QryEndTestEvt", function(data, envelope) {
        
        console.log('Finish Test clicked');
        that.viewData.endTestLock =true;
        
        if(!that.viewData.startTestLock)
            that.qryEndTestEvt(data.value);
            
        setTimeout(function () {
            that.viewData.endTestLock =false; 
            console.log('unlocked');
        }, 5000);
        
    });
    
    this._channel.subscribe("QryPrevQuestionEvt", function(data, envelope) {
        that.qryPrevQuestionEvt(data.value);
    });
    
    this._channel.subscribe("QryNextQuestionEvt", function(data, envelope) {
        that.qryNextQuestionEvt(data.value);
    });
    
    this._channel.subscribe("QrySubmitEvt", function(data, envelope) {
        that.qrySubmitEvt(data.value);
    });
    
    this._channel.subscribe("QryAnswerButtonPress", function(data, envelope) {
        that.qryAnswerButtonPress(data.value);
    });
    
    this._channel.subscribe("QryCorrectAnswerButtonPress", function(data, envelope) {
        that.qryCorrectAnswerButtonPress(data.value);
    });
    
    this._channel.subscribe("QrySelectTestBtn", function(data, envelope) {
        that.qrySelectTestBtn(data.value);
    });
    
    this._channel.subscribe("QryCatBtn", function(data, envelope) {
        that.qryCatBtn(data.value);
    });
    
    this._channel.subscribe("QryCsvBtn", function(data, envelope) {
        that.qryCsvBtn(data.value);
    });
    
    this._channel.subscribe("QryResetQuestionEvt", function(data, envelope) {
        that.qryResetQuestionEvt(data.value);
    });
    
    this._channel.subscribe("QryAnswer", function(data, envelope) {
        that.gotAnswer(data.value);
    });
    
    this._channel.subscribe("QryCSVChanged", function(data, envelope) {
        that.qryCSVChanged(data.value);
    });
    
    this._channel.subscribe("QryCategoryChanged", function(data, envelope) {
        that.qryCategoryChanged(data.value);
    });
    
    this._channel.subscribe("Login", function(data, envelope) {
        that.viewData.loginAllowed = data.value;
        
        if(data.value)
            that.view.CmdUpdateLogin(true,'Login');
        else
            that.view.CmdUpdateLogin(false,'LOGGED IN');
    });
    
    this._channel.subscribe("LoginClick", function(data, envelope) {
        if(that.viewData.loginAllowed)
            that.qryNA(data.value);
    });
};

QuestionController.prototype = {
    init:function(){
        
    },
    
    qryNA:function(evt){
        if (this.quizObj !== null) {
            this.quizObj.GoogleSheetTestLogin(evt);
        }
    },

    qrySelectTestEvt:function(evt){
        if (this.quizObj !== null) {
            this.model.tabIdx = 4;
            this.view.UpdateView(this.model);
        }
    },

    qryStartTestEvt:function(evt){
        if (this.quizObj !== null) {
            var that = this;
            
            that.model.questionScore = 0;
            that.model.percentageCorrect = 0;
            that.model.answersofar ='';
            that.model.mainBody ='';
            that.model.tabIdx = 0;
            that.model.headerIdx = 0;
            
            console.log('start test');
            
    		if(that.quizObj.validTestSelected()){

    		   	var selectedCat = that.quizObj.selectedcategory;
    		   	var rawCSVData = that.quizObj.rawCSVData;
    		   	
    		   	var qdata = that.questionLib.CreateQuestionSet(rawCSVData,selectedCat);
    		   	
    			that.quizObj.setQuestionData(qdata);

    			that.displayQuestion(0);

    			that.view.UpdateView(that.model);
    			
            }
        }
    },
    qryEndTestEvt:function(evt){
        this.model.tabIdx = -1;
        this.model.headerIdx = 1;
    	this.view.UpdateView(this.model);
    },
    qryPrevQuestionEvt:function(evt){
        this.displayQuestion(evt);
    },
    qryNextQuestionEvt:function(evt){
        this.displayQuestion(evt);
    },
    qrySubmitEvt:function(evt){
        this.answerQuestion(evt);
    },
    qryAnswerButtonPress:function(evt){
        this.answerQuestion(evt);
    },
    qryCorrectAnswerButtonPress:function(evt){
        if (this.quizObj !== null) {
            if (this.quizObj.isAnswerDisplayed == true) {
                this.model.correctAnswer = '';
                this.quizObj.isAnswerDisplayed = false;
            } else {
                this.model.correctAnswer = this.quizObj.currentQuestionAnswer();
                this.quizObj.isAnswerDisplayed = true;
            }
            
            this.view.UpdateView(this.model);
        }
    },
    qrySelectTestBtn:function(evt){
        this.model.tabIdx = 2;
        this.view.UpdateView(this.model);
    },
    qryCatBtn:function(evt){
        this.model.tabIdx = 5;
        this.view.UpdateView(this.model);
    },
    
    qryCsvBtn:function(evt){
        // button in ui commented out
        if (this.quizObj !== null) {
            console.log('listing csvs(tests)');
            var that = this;
            
            that.drive.SearchForQuizFolder('quiz', function(quizlist){
                console.log('fetched list of quizs: '+quizlist);
                that.quizObj.listoftests = quizlist;
                
                //that.view.CmdDisplayCSVList(that.quizObj.listoftests, that);
                that.model.csvList = that.quizObj.listoftests;
                that.model.tabIdx = 4;
                that.view.UpdateView(that.model);
            });
            
        }
    },
    
    qryCategoryChanged:function(evt){
        if (this.quizObj !== null) {
            this.quizObj.selectedcategory = evt;
            
            this.model.catName = this.quizObj.selectedcategory;
            this.view.UpdateView(this.model);
        }
    },
    
    qryCSVChanged:function(evt){
        var that = this;
        
        if (that.quizObj !== null) {
            that.quizObj.selectedCSV = evt;
            that.drive.ReadSheet(that.quizObj.SelectedTestName().url, function(csv,cats){
                that.questionLib.ParseCats(csv, function(csv,cats){
                    that.quizObj.rawCSVData = csv;
                    that.quizObj.categories = cats;
                    //that.view.CmdDisplayCategoryList(cats.D, that);
                    that.model.catList = cats.D;
                    that.view.UpdateView(that.model);
                });
                
            });
            
            that.model.testName = that.quizObj.SelectedTestName().value;
            that.view.UpdateView(that.model);
        }
    },
    
    qryResetQuestionEvt:function(evt){
        if (this.quizObj !== null) {
            
            this.quizObj.ResetQuestion(evt);
            
    	    this.quizObj.score = this.scoreLib.GetQuestionSetScore(this.quizObj.questionset);
    	    
    	    
    	    this.model.questionScore = this.quizObj.currentQuestion().score;
    
            this.model.percentageCorrect = this.quizObj.score;
    	    
            this.view.UpdateView(this.model);
            
    	    this.displayQuestion();
        }
    },
    
    displayQuestion: function (pos) {

        this.quizObj.currentQuestionState = [];
        this.quizObj._changeCurrentQuestion(pos);
        
        this.model.isMultipleChoice =false; //make sure this is reset
        
        
        //this.view.CmdDisplayCorrectAnswer('');
        this.model.correctAnswer = '';
//        this.view.CmdUpdateAnswerSoFar('');
        
        this.model.answerSoFar = '';
    
    
        this.quizObj.isAnswerDisplayed = false;
        
        if (this.quizObj.currentQuestionSetLength() > 0) {
            var question = this.quizObj.currentQuestion();
                         
            //this.view.CmdDisplayQuestionScore(question.score);
            this.model.questionScore = question.score;

            var attemptedAnswer = question.attemptedAnswer;

            switch (question.type) {
                case 0:
                    //this.view.CmdDisplayStandardQuestion(question.question,attemptedAnswer);
                    this.model.visibleImage =false;
                    this.model.visibleAnswer =true;
                    this.model.answerBox = attemptedAnswer;
                    this.model.mainBody = question.question;
                    
                    break;
                case 1:
                    // this.view.CmdDisplayMultipleChoice(question.question, 
                    //                                     question.constAnswers, 
                    //                                     parseInt(attemptedAnswer) + 1);
                    
                    this.model.multiChoiceQuestion = question.question;
                    this.model.multiChoiceConstantAnswer = question.constAnswers;
                    this.model.multiChoiceIdx = parseInt(attemptedAnswer) + 1;
                    this.model.isMultipleChoice =true; 
                    
                    break;
                case 2:
                    //this.view.CmdDisplayImageQuestion(question.question, attemptedAnswer);
                    this.model.answerBox = attemptedAnswer;
                    this.model.visibleImage =true;
                    this.model.imagePath = question.question;
    
                    break;
                case 3:// multi answer
                    //this.view.CmdDisplayMultiAnswerQuestion(question.question, attemptedAnswer);
                    this.model.visibleAnswer =true;
                    this.model.visibleImage =false;
                    this.model.mainBody = question.question;
                    this.model.answerBox = attemptedAnswer;
    
                    //this.view.CmdDisplayAnswerSoFar(question.correctAnswers);
                    this.model.answerSoFar = question.correctAnswers;
                    break;
                case 4:// multi ordered answer
                    //this.view.CmdDisplaySortedMultiAnswerQuestion(question.question, attemptedAnswer);
                    this.model.visibleAnswer =true;
                    this.model.visibleImage =false;
                    this.model.mainBody = question.question;
                    this.model.answerBox = attemptedAnswer;
                    break;
            }
            //this.view.CmdUpdateCurrentQuestionLabel(this.quizObj.currentQuestionIdx + 1, this.quizObj.currentQuestionSetLength());
            this.model.currentQuestion = (this.quizObj.currentQuestionIdx + 1) + ' of ' + this.quizObj.currentQuestionSetLength();

        } else {
            this.model.mainBody = 'no questions';
            this.model.visibleAnswer =false;
        }

        this.view.UpdateView(this.model);
  
        //how long did it take to work out i needed to call this - on a containing div not the content!!
        $("#rqs").trigger('create');

    },
    
    answerQuestion: function () {
        
        this._channel.publish( "RequestAnswer", { value: undefined});
    },
    
    gotAnswer : function(answer){
        var that = this;
        
        var question = that.quizObj.currentQuestion();

        var processScore = function(){
            that.quizObj.score = that.scoreLib.GetQuestionSetScore(that.quizObj.questionset);
            
            //that.view.CmdDisplayScore(question.score, that.quizObj.score);
            
            that.model.questionScore = question.score;
    
            that.model.percentageCorrect = that.quizObj.score;
            
            switch (question.type) {
                case 3:
                case 4:
                    that.model.answerSoFar =question.correctAnswers;
                    //that.model.answerBox = '';
                    //that.model.mainBody = '';
                    
                    // that.view.CmdUpdateMiscTextBoxs(question.correctAnswers, 
                    //                         question.answer,
                    //                         question.question, '');
                    break;
            }
            
            that.view.UpdateView(that.model);
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
    }
};