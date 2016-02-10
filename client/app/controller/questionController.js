var QuestionController = function (view, model,drive,channel) {
    this._channel = channel;;
    
    this.view = view;
    this.drive = drive;
    this.model = model;
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
    
    var that = this;
    
    //this.view.QryStartTestEvt(this.qryStartTestEvt, this); 
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
    
    
    //this.view.QryEndTestEvt(this.qryEndTestEvt, this);
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
    
    //this.view.QryTestHistorytEvt(this.qryTestHistorytEvt, this);
    this._channel.subscribe("QryTestHistoryEvt", function(data, envelope) {
        that.qryTestHistorytEvt(data.value);
    });
    
    
    //this.view.QryPrevQuetionEvt(this.qryPrevQuestionEvt, this);
    this._channel.subscribe("QryPrevQuestionEvt", function(data, envelope) {
        that.qryPrevQuestionEvt(data.value);
    });
    
    //this.view.QryNextQuestionEvt(this.qryNextQuestionEvt, this); 
    this._channel.subscribe("QryNextQuestionEvt", function(data, envelope) {
        that.qryNextQuestionEvt(data.value);
    });
    
    
    //this.view.QrySubmitEvt(this.qrySubmitEvt, this); 
    this._channel.subscribe("QrySubmitEvt", function(data, envelope) {
        that.qrySubmitEvt(data.value);
    });
    
    //this.view.QryAnswerButtonPress(this.qryAnswerButtonPress, this);
    this._channel.subscribe("QryAnswerButtonPress", function(data, envelope) {
        that.qryAnswerButtonPress(data.value);
    });
    
    //this.view.QryCorrectAnswerButtonPress(this.qryCorrectAnswerButtonPress, this); 
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
    
    //this.view.QrySelectTestBtn(this.qrySelectTestBtn, this);
    this._channel.subscribe("QrySelectTestBtn", function(data, envelope) {
        that.qrySelectTestBtn(data.value);
    });
    
    //this.view.QryCatBtn(this.qryCatBtn, this);
    this._channel.subscribe("QryCatBtn", function(data, envelope) {
        that.qryCatBtn(data.value);
    });
    
    //this.view.QryCsvBtn(this.qryCsvBtn, this); 
    this._channel.subscribe("QryCsvBtn", function(data, envelope) {
        that.qryCsvBtn(data.value);
    });
    
    //this.view.QryCategoryChanged(this.qryCategoryChanged, this);
    // this._channel.subscribe("QryCategoryChanged", function(data, envelope) {
    //     that.qryCategoryChanged(data.value);
    // });
    
    // this.view.QryCSVChanged(this.qryCSVChanged, this);
    // this._channel.subscribe("QryCSVChanged", function(data, envelope) {
    //     that.qryCSVChanged(data.value);
    // });
    
    // this.view.QryModeChanged(this.qryModeChanged, this);
    // this._channel.subscribe("QryModeChanged", function(data, envelope) {
    //     that.qryModeChanged(data.value);
    // });
    
    //this.view.QryResetQuestionEvt(this.qryResetQuestionEvt, this);
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
            that._view.CmdUpdateLogin(true,'Login');
        else
            that._view.CmdUpdateLogin(false,'LOGGED IN');
    });
    
    //this.view.QryNA(this.qryNA,this);
    this._channel.subscribe("LoginClick", function(data, envelope) {
        if(that.viewData.loginAllowed)
            that.qryNA(data.value);
    });
};

QuestionController.prototype = {
    init:function(){
        
    },
    
    qryNA:function(evt){
        if (this.model !== null) {
            this.model.GoogleSheetTestLogin(evt);
        }
    },

//seems to be unused    
    // qryModeChanged:function(evt){
    //     if (this.model !== null) {
    //         this.model.ModeChanged(evt);
    //     }
    // },
    
     
    
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
            this.view.CmdSetTab(5, function () { });
        }
    },
    
    qryCsvBtn:function(evt){
        // button in ui commented out
        if (this.model !== null) {
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
        
        this._channel.publish( "RequestAnswer", { value: undefined});
        
        // var that = this;

        // that.view.QryAnswer(function(answer){
        //     that.gotAnswer(answer);
        // },that);
    },
    
    gotAnswer : function(answer){

        var question = that.model.currentQuestion();

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
    }
};