var QuestionController = function (view, model,drive) {
    this.view = view;
    this.drive = drive;
    this.model = model;
    
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
    		    
                $('#mainbody').html('');
                $('#perc-correct').html('');
                $('#question-score').html('');
                $('#answer-so-far').html('');
    		    
    			that.model.createquestionset();
    			
    			that.model.displayQuestion(0);
    			
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
            this.model.displayQuestion(evt);
        }
    },
    qryNextQuestionEvt:function(evt){
        if (this.model !== null) {
            this.model.displayQuestion(evt);
        }
    },
    qrySubmitEvt:function(evt){
        if (this.model !== null) {
            this.model.answerQuestion(evt);
        }
    },
    qryAnswerButtonPress:function(evt){
        if (this.model !== null) {
            this.model.answerQuestion(evt);
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
            //this.model.listcats(evt);
            console.log('listing categories');
            var that = this;
            
            this.model._getCategoriesFromTest(function(){
                that.view.CmdDisplayCategoryList(that.model.listofcategories.D,that.qryCategoryChanged, that);
                that.view.CmdSetTab(5, function () { });
            });
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
    
    // 	_getTestList: function ( action) {
	   // var that = this;
	    
    //     that._drive.SearchForQuizFolder('quiz', function(quizlist){
    //         console.log('fetched list of quizs: '+quizlist);
    //         that.listoftests = quizlist;
    //         action();
    //     });
        
    // },
    
    
    // qryAnswer:function(evt){
    //     if (this.model !== null) {
    //         this.model.Answer(evt);
    //     }
    // },
    qryCategoryChanged:function(evt){
        if (this.model !== null) {
            this.model.selectedcategory = evt;
            this.view.CmdSetCatName(this.model.selectedcategory);
        }
    },
    qryCSVChanged:function(evt){
        if (this.model !== null) {
            this.model.selectedCSV = evt;
            this.model.readCSV();
            
            var that = this;
             
            that._drive.ReadSheet(that.SelectedTestName(), function(csv,cats){
                that.listofCSVData = csv;
                that.listofcategories = cats;
            });
            
            this.view.CmdSetTestName(this.model.SelectedTestName());
        }
    },
    
    qryResetQuestionEvt:function(evt){
        if (this.model !== null) {
            
            this.model.ResetQuestion(evt);
            
    	    this.model._calculateScore();
    	    
    	    this.view.CmdDisplayScore(this.model.currentQuestion().score, this.model.score);
    	    
    	    this.model.displayQuestion();
        }
    }
    
}