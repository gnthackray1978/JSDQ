

var BasicQuestioner = function () {
    this.selectedcategory = '';
    this.selectedCSV = 3;
    this.listoftests = [];
    this.rawCSVData =[];
    this.categories =[];
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
    
    setQuestionData:function(data){
        this.questionset = data.questionset;
    	this.answerset = data.answerset;
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
    }

};
