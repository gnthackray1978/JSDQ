

var BasicQuestioner = function (view,drive) {
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
    this._drive = drive;
};


BasicQuestioner.prototype = {
    
   
    SelectedTestName: function(){
        var that = this;
        
        var idx =0;
        while(idx < that.listoftests.length){
            if(that.listoftests[idx].key == that.selectedCSV){
                return that.listoftests[idx];
            }
            idx++;
        }
        return {key: -1 , url : '', value:'test not found'};
    },
    
    validTestSelected:function(){
        return (this.selectedCSV !=='' && this.selectedcategory !== '');
    },
    
    ResetQuestion:function(e){
        var question = this.questionset[this.currentQuestionIdx];
        
	    question.score =0;
	    question.correctAnswers = [];
	    question.attemptedAnswer =[];
	    question.answer = JSON.parse(JSON.stringify(question.constAnswers));

	},

// 	init: function () {
//         this._getTestList(true, function () {});
//     },

    _getColumns: function (row) {

        var cols = [];

        var tpSplit = row.split(',');

        $.each(tpSplit, function () {
            if ($.trim(this) != '') cols.push(String(this));
        });

        return cols;
    },

	// get categories from db
// 	_getTestList: function ( action) {
// 	    var that = this;
	    
//         that._drive.SearchForQuizFolder('quiz', function(quizlist){
//             console.log('fetched list of quizs: '+quizlist);
//             that.listoftests = quizlist;
//             action();
//         });
        
//     },

	_getCategoriesFromTest : function (action){
	    // do we have selected test
	    
	    this.listofcategories = new UniqueList();
	    
	    if(this.listofCSVData){
	        var idx=0;
	        while(idx < this.listofCSVData.length){
                this.listofcategories.Add( this.listofCSVData[idx][2]);
                idx++;
	        }
	        action();
	    }
	    
	},
	
    currentQuestionAnswer: function (){
        return this.questionset[this.currentQuestionIdx].answer;
    },
    
    currentQuestion: function (){
        return this.questionset[this.currentQuestionIdx];
    },

    currentQuestionSetLength: function(){
        if (this.questionset !== undefined && this.questionset.length > 0) 
            return this.questionset.length;
        else
            return 0;
    },
    
    // get questions from db
    createquestionset: function () {
        console.log('creating question set');

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

    _changeCurrentQuestion: function(pos){
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
                    scoreLib.GetScoreBasic(question,answer,processScore);
                    break;
                case 2:
                    // image question
                    break;
                case 3:
                    // multiple answers
                    scoreLib.GetScoreMultiAnswer(question,answer,processScore);
                    break;
                case 4:
                    // multiple answers
                    scoreLib.GetScoreOrderedMultiAnswer(question, answer,processScore);
                    break;
            }
        };

        that.view.QryAnswer(function(answer){
            gotAnswer(answer);
        },that);
    },

    displayQuestion: function (pos) {

        this.currentQuestionState = [];
        this._changeCurrentQuestion(pos);
        
        this.view.CmdDisplayCorrectAnswer('');
        this.view.CmdUpdateAnswerSoFar('');
    
        this.isAnswerDisplayed = false;
        
        if (this.currentQuestionSetLength() > 0) {
            var question = this.currentQuestion();
                         
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
            this.view.CmdUpdateCurrentQuestionLabel(this.currentQuestionIdx + 1, this.currentQuestionSetLength());

        } else {
            this.view.CmdDisplayNoQuestion();
        }


        //  $('#mainbody').html(content);
        //how long did it take to work out i needed to call this - on a containing div not the content!!
        $("#rqs").trigger('create');

    }

};
