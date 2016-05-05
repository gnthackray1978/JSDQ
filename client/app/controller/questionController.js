/*global QuizVM ScoreLib */

var QuestionController = function (quizObj,drive,channel) {
    this._channel = channel;;
    
    //this.view = view;
    this.drive = drive;
    this.quizObj = quizObj;
    
    this.scoreLib = new ScoreLib();
    this.questionLib = new QuestionLib();
    this.scoreTracker = new ScoreTracker(channel);
    
    
    this.viewData = {
        categoryChanged : null,
        csvChanged : null,
        modeChanged :null,
        endTestLock :false,
        startTestLock :false,
        loginAllowed :false,
        loggedIn: false
    };
    
    
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
        that.viewData.loggedIn = data.value;
        
        if(data.value)
        {
            that.model.loginMessage = 'Log In';
            
        }
        else
        {
            that.model.loginMessage = 'Log Out';
        }
            
        that.updateView();
    });
    
    this._channel.subscribe("LoginData", function(data, envelope) {
         
        that.model.loginName = data.value.displayName;
        
        that.updateView();
    });
    
    this._channel.subscribe("LoginClick", function(data, envelope) {
        
        that.qryNA(data.value);
    });
    
    this._channel.subscribe("QryCreateTestEvt", function(data, envelope) {
        that.qryCreateTestEvt(data.value);
    });
    
    this.init();
};

QuestionController.prototype = {
    
    init:function(){
        var that = this;
        
        this.scoreTracker.GetResults('','',function(results){
           that.model.results = results;
           that.updateView();
        });
       
    },
    
    updateView:function(){
        this._channel.publish( "UpdateView", { value: this.model});
    },
    
    qryNA:function(evt){
        if(this.viewData.loggedIn)
            this.drive.LogInGoogle();
        else
            this.drive.LogOutGoogle();
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

    			that.updateView();
    			
            }
        }
    },
    qryEndTestEvt:function(evt){
     
    	var that = this;
    	
    	this.scoreTracker.AddNewResult(this.model.percentageCorrect,this.model.catName, this.model.testName);
    	
    	this.scoreTracker.GetResults('','',function(results){
    	   that.model.tabIdx = -1;
           that.model.headerIdx = 1;
           that.model.results = results;
           that.updateView();
        });
        
        
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
    qryCreateTestEvt:function(evt){
        this.model.tabIdx = 6;
        this.updateView();
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
            
            this.updateView();
        }
    },
    qrySelectTestBtn:function(evt){
        this.model.tabIdx = 2;
        this.updateView();
    },
    qryCatBtn:function(evt){
        this.model.tabIdx = 5;
        this.updateView();
    },
    
    qryCsvBtn:function(evt){
        // button in ui commented out
        if (this.quizObj !== null) {
            console.log('listing csvs(tests)');
            var that = this;
            
            that.drive.SearchForQuizFolder('quiz', function(quizlist){
                console.log('fetched list of quizs: '+quizlist);
                that.quizObj.listoftests = quizlist;
                
                that.model.csvList = that.quizObj.listoftests;
                that.model.tabIdx = 4;
                that.updateView();
            });
            
        }
    },
    
    qryCategoryChanged:function(evt){
        if (this.quizObj !== null) {
            this.quizObj.selectedcategory = evt;
            
            this.model.catName = this.quizObj.selectedcategory;
            this.updateView();
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
                    
                    that.model.catList = cats.D;
                    that.updateView();
                });
                
            });
            
            that.model.testName = that.quizObj.SelectedTestName().value;
            that.updateView();
        }
    },
    
    qryResetQuestionEvt:function(evt){
        if (this.quizObj !== null) {
            
            this.quizObj.ResetQuestion(evt);
            
    	    this.quizObj.score = this.scoreLib.GetQuestionSetScore(this.quizObj.questionset);
    	    
    	    
    	    this.model.questionScore = this.quizObj.currentQuestion().score;
    
            this.model.percentageCorrect = this.quizObj.score;
    	    
            this.updateView();
            
    	    this.displayQuestion();
        }
    },
    
    displayQuestion: function (pos) {

        this.quizObj.currentQuestionState = [];
        this.quizObj._changeCurrentQuestion(pos);
        this.quizObj.isAnswerDisplayed = false;
        
        this.model.isMultipleChoice =false; //make sure this is reset
        this.model.correctAnswer = '';
        this.model.answerSoFar = '';

        if (this.quizObj.currentQuestionSetLength() > 0) {
            var question = this.quizObj.currentQuestion();
                         
            this.model.questionScore = question.score;

            var attemptedAnswer = question.attemptedAnswer;

            switch (question.type) {
                case 0:
                    this.model.visibleImage =false;
                    this.model.visibleAnswer =true;
                    this.model.answerBox = attemptedAnswer;
                    this.model.mainBody = question.question;
                    
                    break;
                case 1:
                    this.model.multiChoiceQuestion = question.question;
                    this.model.multiChoiceConstantAnswer = question.constAnswers;
                    this.model.multiChoiceIdx = parseInt(attemptedAnswer) + 1;
                    this.model.isMultipleChoice =true; 
                    
                    break;
                case 2:
                    this.model.answerBox = attemptedAnswer;
                    this.model.visibleImage =true;
                    this.model.imagePath = question.question;
    
                    break;
                case 3:// multi answer
                    this.model.visibleAnswer =true;
                    this.model.visibleImage =false;
                    this.model.mainBody = question.question;
                    this.model.answerBox = attemptedAnswer;
    
                    this.model.answerSoFar = question.correctAnswers;
                    break;
                case 4:// multi ordered answer
                    this.model.visibleAnswer =true;
                    this.model.visibleImage =false;
                    this.model.mainBody = question.question;
                    this.model.answerBox = attemptedAnswer;
                    break;
            }
            this.model.currentQuestion = (this.quizObj.currentQuestionIdx + 1) + ' of ' + this.quizObj.currentQuestionSetLength();

        } else {
            this.model.mainBody = 'no questions';
            this.model.visibleAnswer =false;
        }

        this.updateView();
  
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
            
            that.model.questionScore = question.score;
    
            that.model.percentageCorrect = that.quizObj.score;
            
            switch (question.type) {
                case 3:
                case 4:
                    that.model.answerSoFar =question.correctAnswers;
                    
                    break;
            }
            
            that.updateView();
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