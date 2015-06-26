var ScoreLib = function () {    
};

ScoreLib.prototype.GetScoreForSet= function (questionSet,callback) {

   
    var idx = 0;
    var working = 0;
    while (idx < questionSet.length) {
        working += questionSet[idx].score;
        idx++;
    }
    var score = Math.floor(((100 / (questionSet.length * 100)) * working));
    
    callback(score);
    
};


ScoreLib.prototype.GetScoreBasic= function (question,answer,callback) {
        
    var mlib = new MatchLib(answer, question.answer,1);
   
    mlib.Match(function(correct){
        if(correct){
            question.score = 100;
        } 
        else {
            question.score = 0;
        }
        
        callback();
    });
}


ScoreLib.prototype.GetScoreMultiAnswer = function (question,attemptedAnswer, callback) {
        
    var questionObj = question;
    var answers = questionObj.answer;
    var originalAnswers = questionObj.constAnswers;
    var mlib = new MatchLib(answers, attemptedAnswer,2);
    mlib.Match(function(correctAnswers, remainingAnswers){
        
        if(correctAnswers.length >0){
            questionObj.correctAnswers.push(correctAnswers); 
        }
        
        questionObj.answer = remainingAnswers;

        questionObj.score = Math.floor(((100 / originalAnswers.length) * 
                        questionObj.correctAnswers.length));

        callback();
    });
}

ScoreLib.prototype.GetScoreOrderedMultiAnswer = function (question, answer,callback) {
    var questionObj = question;
    var answers = questionObj.answer;
    var originalAnswers = questionObj.constAnswers;

    var remainingAnswers = answers;

    // if (this.performMatch(answers[0], answer)) {
    //     this.currentQuestionState.push(answer);
    //     remainingAnswers.splice(0, 1);
    // }

    var mlib = new MatchLib(answers[0], answer,1);
    
    mlib.Match(function(result){
        if(result){
            questionObj.correctAnswers.push(answer);
            remainingAnswers.splice(0, 1);
        }
        
        questionObj.answer = remainingAnswers;

        questionObj.score = Math.floor(((100 / originalAnswers.length) * 
            questionObj.correctAnswers.length));

        callback();
    });

}