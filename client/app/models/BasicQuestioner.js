

var BasicQuestioner = function (view) {
    this.view = view;
    this.selectedcategory = '';
    this.selectedCSV = 3;
    this.listoftests = [];
    this.listofcategories = new UniqueList();
    this.listofCSVData =[];
    this.questionset = [];
    this.answerset = [];
    // used for multi answer questions
    this.currentQuestionState = [];
    this.isAnswerDisplayed = false;
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.questionscore = 0;
};


BasicQuestioner.prototype = {
    
     GoogleSheetTestLogin: function(e){
         console.log('Google Sheet Test Login');
         
         
         
     },
    
     ModeChanged: function(e){
         console.log('mode changed');
     },
     
     CategoryChanged: function(cat){
        console.log('cat changed: ' + cat);
        
        var that = this;

        that.selectedcategory = cat;
        that.view.CmdSetCatName(cat);
    },
    
    CSVChanged: function(csv){
        console.log('csv changed: ' + csv);
        
        
        var that = this;

        that.selectedCSV = csv;

        that.readCSV();
        
        that.view.CmdSetTestName(csv);
        
        
    },
    
    endTest: function () {
        console.log('end test');
        var that = this;
        
    	that.view.CmdSwitchHeaderContent(1, function () {
			that.view.CmdSetTab(2,function(){});
		});
    },

    startTest: function () {
        console.log('start test');
        var that = this;
		if(that.selectedCSV !==''){
			that.resetTest();
			that.view.CmdSwitchHeaderContent(0, function () {
				that.view.CmdSetTab(0,function(){});
			});
        }
    },
  
	resetTest:function(){
	    this.createquestionset();
	},
	
    ResetQuestion:function(e){
	    this.questionset[this.currentQuestionIdx].score =0;
	    this.questionset[this.currentQuestionIdx].correctAnswers = [];
	    this.questionset[this.currentQuestionIdx].attemptedAnswer =[];
	    this.questionset[this.currentQuestionIdx].answer = '';
	    
	    this._calculateScore();
	    
	    this.displayQuestion();
	},

    selectTest: function () {
        var that = this;
        that.view.CmdSetTab(4, function () {});
    },
	
    testHistory: function () {
        var that = this;
        that.view.switchtab(5, function () {});
    },
    
	init: function () {
        this._getTestList(true, function () {});
    },
	
    writelog: function (message) {
        //  $('#debug').append(message+'.');
    },

    _getColumns: function (row) {

        var cols = [];

        var tpSplit = row.split(',');

        $.each(tpSplit, function () {
            if ($.trim(this) != '') cols.push(String(this));
        });

        return cols;
    },

	// get categories from db
	_getTestList: function ( action) {

        //console.log('fetching list of test');
        
        var googleLibs = new GoogleLibs();
    	var that = this;
    	
        googleLibs.GetTestList(function(listoftests){
            that.listoftests = listoftests;
            action();
        });

        action();
    },

	_getCategoriesFromTest : function (action){
	    // do we have selected test
	    
	    this.listofcategories = new UniqueList();
	    
	    if(this.listofCSVData){
	        var idx=0;
	        
	        while(idx < this.listofCSVData.length){
	             if(this.listofCSVData[idx][0] == this.selectedCSV)
	                this.listofcategories.Add( this.listofCSVData[idx][2]);
	             
	             idx++;
	        }
	        
	        action();
	    }
	    
	},
	
     
    toggleAnswer: function () {
        
        if (this.isAnswerDisplayed == true) {
            this.view.CmdDisplayCorrectAnswer('');
            this.isAnswerDisplayed = false;

        } else {
            this.view.CmdDisplayCorrectAnswer(this.questionset[this.currentQuestionIdx].answer);
            this.isAnswerDisplayed = true;
        }
    },

    questionSelectionsEnabled: function () {
        console.log('Question Selections Enabled');
        this.view.CmdSetTab(2, function () { });
    },

    listtests: function () {
        console.log('listing csvs(tests)');
        var that = this;
        
        this._getTestList(function(){
            that.view.CmdDisplayCSVList(that.listoftests, that);
            that.view.CmdSetTab(4, function () { });
        });
    },
 
    listcats: function () {
        console.log('listing categories');
        var that = this;
        
        this._getCategoriesFromTest(function(){
            that.view.CmdDisplayCategoryList(that.listofcategories.D, that);
            that.view.CmdSetTab(1, function () { });
        });
    },

    //all questions for 1 csv including different categories
    readCSV : function(){
    	var googleLibs = new GoogleLibs();
    	var that = this;
    	googleLibs.GetData(function(cats, csv){
    	    that.listofcategories = cats;
    	    that.listofCSVData = csv;
    	})
    },
    
    
    // get questions from db
    createquestionset: function () {
        //0 standard type
        //
        console.log('creating question set');

        $('#mainbody').html('');
        $('#perc-correct').html('');
        $('#question-score').html('');
        $('#answer-so-far').html('');

        var questionColIdx = 3;
        var multiAnswerStartIdx = 4;
        var idx = 1;
        this.questionset = [];
        this.answerset = [];

      
        while (idx < this.listofCSVData.length) {

                //  this.writelog(idx);

                var cols = this.listofCSVData[idx];

                if (cols[2] == this.selectedcategory) {

                    var questionType = 0; // default option

                    // questions with multiple answers
                    if (cols.length > multiAnswerStartIdx+1) {

                        var colIdx = multiAnswerStartIdx;
                        var answer = []; // this can get over written
                        var constAnswers = []; // to use a permanent answer collection

                        while (colIdx < cols.length) {
                            answer.push(cols[colIdx]);
                            constAnswers.push(cols[colIdx]);
                            colIdx++;
                        }

                        if (colIdx > multiAnswerStartIdx) {
                            switch ($.trim(answer[0])) {
                                case 'MA':
                                    questionType = 3; // multi answer
                                    break;
                                case 'MS':
                                    questionType = 4; // multi ordered answer
                                    break;
                                default:
                                    questionType = 1; //question is multiple choice
                                    break;
                            }
                        }

                        // questiontype is multiple choice
                        if (questionType != 1) {
                            answer.splice(0, 1);
                            constAnswers.splice(0, 1);
                        } else {
                            this.answerset.push('');

                        }


                        this.questionset.push({ question: cols[questionColIdx], 
                                                answer: answer, 
                                                type: questionType, 
                                                constAnswers: constAnswers, 
                                                score: 0, 
                                                attemptedAnswer:'',
                                                correctAnswers:[]
                                              });
                    } else {

                     
                        this.questionset.push({ question: cols[questionColIdx], 
                                                answer: cols[multiAnswerStartIdx], 
                                                type: questionType, 
                                                constAnswers: cols[multiAnswerStartIdx], 
                                                score: 0, 
                                                attemptedAnswer:'',
                                                correctAnswers:[]
                                              });
                        this.answerset.push('');
                    }
                }


                idx++;
            }

        this.displayQuestion(0);

 
    },

    
    // scoring and answering functionality
    
    _calculateScore: function(){
        var that = this;
        var idx = 0;
        var working = 0;
        while (idx < that.questionset.length) {
            working += that.questionset[idx].score;
            idx++;
        }
        that.score = Math.floor(((100 / (that.questionset.length * 100)) * working));
    },

    answerQuestion: function () {
        var that = this;

        var gotAnswer = function(answer){

            var question =  that.questionset[that.currentQuestionIdx];

            var processScore = function(){
                that._calculateScore();
                
                that.view.CmdDisplayScore(question.score, that.score);
                
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
            
            var scoreLib = new ScoreLib();
                        
            switch (question.type) {
                case 0:
                case 1:  
                    scoreLib.getScoreBasic(answer,processScore);
                    break;
                case 2:
                    // image question
                    break;
                case 3:
                    // multiple answers
                    scoreLib.getScoreMultiAnswer(question,answer,processScore);
                    break;
                case 4:
                    // multiple answers
                    scoreLib.getScoreOrderedMultiAnswer(question, answer,processScore);
                    break;
            }
        };

        that.view.QryAnswer(function(answer){
            gotAnswer(answer);
        },that);
    },

    displayQuestion: function (pos) {

        this.currentQuestionState = [];

        this.writelog('dq' + pos);

        switch (pos) {
            case 1:
                if (this.questionset.length - 1 > this.currentQuestionIdx)
                    this.currentQuestionIdx++;
                break;
            case -1:
                if (this.currentQuestionIdx > 0)
                    this.currentQuestionIdx--;
                break;
           
        }
        
        this.view.CmdDisplayCorrectAnswer('');
        this.view.CmdUpdateAnswerSoFar('');
        //test crap
        //test crap1
        //monkey
        //apple
        this.isAnswerDisplayed = false;
        
        if (this.questionset !== undefined && this.questionset.length > 0) {
            var type = this.questionset[this.currentQuestionIdx].type;

            //this.questionset[this.currentQuestionIdx].answer = this.questionset[this.currentQuestionIdx].constAnswers;

            this.view.CmdDisplayScore(this.questionset[this.currentQuestionIdx].score);

            //this.questionscore = 0;

            var attemptedAnswer = this.questionset[this.currentQuestionIdx].attemptedAnswer;

            switch (type) {
                case 0:
                    this.view.CmdDisplayStandardQuestion(this.questionset[this.currentQuestionIdx].question,attemptedAnswer);
                    break;
                case 1:
                    this.view.CmdDisplayMultipleChoice(this.questionset[this.currentQuestionIdx].question, 
                                                        this.questionset[this.currentQuestionIdx].constAnswers, 
                                                        parseInt(attemptedAnswer) + 1);
                    break;
                case 2:
                    this.view.CmdDisplayImageQuestion(this.questionset[this.currentQuestionIdx].question, attemptedAnswer);
                    break;
                case 3:// multi answer
                    this.view.CmdDisplayMultiAnswerQuestion(this.questionset[this.currentQuestionIdx].question, attemptedAnswer);
                    this.view.CmdDisplayAnswerSoFar(this.questionset[this.currentQuestionIdx].correctAnswers);
                    break;
                case 4:// multi ordered answer
                    this.view.CmdDisplaySortedMultiAnswerQuestion(this.questionset[this.currentQuestionIdx].question, attemptedAnswer);
                    break;
            }
            this.view.CmdUpdateCurrentQuestionLabel(this.currentQuestionIdx + 1, this.questionset.length);

        } else {
            this.view.CmdDisplayNoQuestion();
        }


        //  $('#mainbody').html(content);
        //how long did it take to work out i needed to call this - on a containing div not the content!!
        $("#rqs").trigger('create');

    }

};
