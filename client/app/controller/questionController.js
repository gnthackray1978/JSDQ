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
    
    this._channel.subscribe("QryTestHistoryEvt", function(data, envelope) {
        that.qryTestHistorytEvt(data.value);
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
        
        debounce(function () {
            that.qryCorrectAnswerButtonPress(data.value);
        }, 500);
    
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
    
    this._channel.subscribe("QryAnswer", function(data, envelope) {
        that.gotAnswer(data.value);
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
            this.view.CmdSetTab(4, function () {});
        }
    },
    qryTestHistorytEvt:function(evt){
        if (this.quizObj !== null) {
            this.view.switchtab(5, function () {});
        }
    },
    
   
    
    qryStartTestEvt:function(evt){
        if (this.quizObj !== null) {
            var that = this;
            console.log('start test');
            
    		if(that.quizObj.validTestSelected()){
    		    
                that.view.CmdResetAnswers();
    		   	
    		   	var selectedCat = that.quizObj.selectedcategory;
    		   	var rawCSVData = that.quizObj.rawCSVData;
    		   	
    		   	var qdata = that.questionLib.CreateQuestionSet(rawCSVData,selectedCat);
    		   	
    			that.quizObj.setQuestionData(qdata);
    			
    			that.displayQuestion(0);
    			
    			that.view.CmdSwitchHeaderContent(0, function () {
    				that.view.CmdSetTab(0,function(){});
    			});
            }
        }
    },
    qryEndTestEvt:function(evt){
        if (this.quizObj !== null) {
            var that = this;
        	that.view.CmdSwitchHeaderContent(1, function () {
    			that.view.CmdSetTab(-1,function(){});
    		});
        }
    },
    qryPrevQuestionEvt:function(evt){
        if (this.quizObj !== null) {
            this.displayQuestion(evt);
        }
    },
    qryNextQuestionEvt:function(evt){
        if (this.quizObj !== null) {
            this.displayQuestion(evt);
        }
    },
    qrySubmitEvt:function(evt){
        if (this.quizObj !== null) {
            this.answerQuestion(evt);
        }
    },
    qryAnswerButtonPress:function(evt){
        if (this.quizObj !== null) {
            this.answerQuestion(evt);
        }
    },
    qryCorrectAnswerButtonPress:function(evt){
        if (this.quizObj !== null) {
            if (this.quizObj.isAnswerDisplayed == true) {
                this.view.CmdDisplayCorrectAnswer('');
                this.quizObj.isAnswerDisplayed = false;
            } else {
                this.view.CmdDisplayCorrectAnswer(this.quizObj.currentQuestionAnswer());
                this.quizObj.isAnswerDisplayed = true;
            }
        }
    },
    qrySelectTestBtn:function(evt){
        if (this.quizObj !== null) {
            this.view.CmdSetTab(2, function () { });
        }
    },
    qryCatBtn:function(evt){
        //button in ui commented out
        if (this.quizObj !== null) {
            console.log('listing categories');
            this.view.CmdSetTab(5, function () { });
        }
    },
    
    qryCsvBtn:function(evt){
        // button in ui commented out
        if (this.quizObj !== null) {
            console.log('listing csvs(tests)');
            var that = this;
            
            that.drive.SearchForQuizFolder('quiz', function(quizlist){
                console.log('fetched list of quizs: '+quizlist);
                that.quizObj.listoftests = quizlist;
                that.view.CmdDisplayCSVList(that.quizObj.listoftests,that.qryCSVChanged, that);
                that.view.CmdSetTab(4, function () { });
            });
            
        }
    },
    
    qryCategoryChanged:function(evt){
        if (this.quizObj !== null) {
            this.quizObj.selectedcategory = evt;
            this.view.CmdSetCatName(this.quizObj.selectedcategory);
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
                    that.view.CmdDisplayCategoryList(cats.D,that.qryCategoryChanged, that);
                });
                
            });
            
            that.view.CmdSetTestName(that.quizObj.SelectedTestName().value);
        }
    },
    
    qryResetQuestionEvt:function(evt){
        if (this.quizObj !== null) {
            
            this.quizObj.ResetQuestion(evt);
            
    	    this.quizObj.score = this.scoreLib.GetQuestionSetScore(this.quizObj.questionset);
    	    
    	    this.view.CmdDisplayScore(this.quizObj.currentQuestion().score, this.quizObj.score);
    	    
    	    this.displayQuestion();
        }
    },
    
    displayQuestion: function (pos) {

        this.quizObj.currentQuestionState = [];
        this.quizObj._changeCurrentQuestion(pos);
        
        this.view.CmdDisplayCorrectAnswer('');
        this.view.CmdUpdateAnswerSoFar('');
    
        this.quizObj.isAnswerDisplayed = false;
        
        if (this.quizObj.currentQuestionSetLength() > 0) {
            var question = this.quizObj.currentQuestion();
                         
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
            this.view.CmdUpdateCurrentQuestionLabel(this.quizObj.currentQuestionIdx + 1, this.quizObj.currentQuestionSetLength());

        } else {
            this.view.CmdDisplayNoQuestion();
        }


        //  $('#mainbody').html(content);
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
            
            that.view.CmdDisplayScore(question.score, that.quizObj.score);
            
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
    }
};