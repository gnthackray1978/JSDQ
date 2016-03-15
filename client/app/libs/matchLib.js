
var MatchLib = function (answer, solution, type) {    
   
    this.isToLower =true;
    
    
    this.type = type;
    
    this.answer = answer;
    
    this.solution = solution;
    
    
};

MatchLib.prototype.Match =  function (callback) {
    this.matchCallback = callback;
    
    switch(this.type){
        case 1:
            this._basicMatch();
            break;
        case 2:
            this._multiAnswer();
            break;
        default:
            this._basicMatch();
    }
};


MatchLib.prototype._basicMatch =  function () {
    console.log('basic matching: ' + this.answer + ' == ' + this.solution);
    
    if (this._arrayEqual(this.answer,this.solution,2)) {
            this.matchCallback(true);
        } else {
            this.matchCallback(false);
    }
};

MatchLib.prototype._equals =  function (answer,solution) {
     console.log('_equals: ' + answer + ' == ' + solution);
     if(this.isToLower){
        answer = String(answer).toLowerCase();
        solution = String(solution).toLowerCase();
     }
    
     if ($.trim(answer) == $.trim(solution)) {
            return true;
        } else {
            return false;
    }
},

MatchLib.prototype._arrayEqual =  function (answer,solution,charCount) {
     
    var that =this;
    var answerParts  =answer.split(' ');

    var solutionParts  =solution.split(' ');
    
    if(answerParts.length != solutionParts.length){
        return false;
    }
    
    var aIdx =0;
    var matchCount =0;
    
    var part = function(part, charCount){
        
        if(part.length > charCount){
            return part.substring(0,charCount);
        }
        
        return part;
    };
    
    while(aIdx < solutionParts.length){
        if(that._equals(part(answerParts[aIdx],charCount),part(solutionParts[aIdx],charCount)))
        {
            matchCount++;
        }
        
        aIdx++;
    }
      
    if(matchCount == solutionParts.length)  {
        return true;
    }
    else
    {
        return false;
    }
    
      
},

MatchLib.prototype._arrayUnsortedEqual =  function (answer,solution) {
     
    var that =this;
    var answerParts  =answer.split(' ');
    var solutionParts  =solution.split(' ');
    
    var inSolution = function(data){
        var idx =0;
        
        while(idx < solutionParts.length){
            if(that._equals(solutionParts[idx],data))
                return true;
            idx++;
        }
        
        return false;
    };

    var aIdx =0;
    var foundCount =0;
    
    while(aIdx < solutionParts.length){
        if(inSolution(answerParts[aIdx]))
            foundCount++;
        
        aIdx++;
    }
      
    if(foundCount == solution.length)  {
        return true;
    }
    else
    {
        return false;
    }
    
      
},


MatchLib.prototype._multiAnswer =  function () {
    console.log('multi answer matching: ' + this.answer + ' == ' + this.solution);
    var remainingAnswers = [];
    var correctAnswers = [];
    
    
    var checkAnswer = function(charCount){
        remainingAnswers = [];
        correctAnswers = [];
    
        var idx = 0;
        while (idx < this.answer.length) {
    
            if (this._arrayEqual(this.answer[idx], this.solution,charCount)) {
                correctAnswers.push(this.solution);
            } else {
                remainingAnswers.push(this.answer[idx]);
            }
            idx++;
        }
    }
    
    
    var charCount =2;
    
    while(charCount < this.solution.length && correctAnswers.length != 1)
    {
        checkAnswer(charCount);
        
        charCount++;
    }
    
    this.matchCallback(correctAnswers,remainingAnswers);
        
        
};