
var MatchLib = function (answer, solution, type) {    
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
    
    this.answer = String(this.answer).toLowerCase();
    
    this.solution = String(this.solution).toLowerCase();
    
    if (this._equals(this.answer,this.solution)) {
            this.matchCallback(true);
        } else {
            this.matchCallback(false);
    }
        
        
};

MatchLib.prototype._equals =  function (answer,solution) {
     if ($.trim(answer) == $.trim(solution)) {
            return true;
        } else {
            return false;
    }
},

MatchLib.prototype._multiAnswer =  function () {
    console.log('multi answer matching: ' + this.answer + ' == ' + this.solution);
    var remainingAnswers = [];
    var correctAnswers = [];
    var idx = 0;

    while (idx < this.answer.length) {

        if (this._equals(this.answer[idx], this.solution)) {
            correctAnswers.push(this.solution);
        } else {
            remainingAnswers.push(this.answer[idx]);
        }
        idx++;
    }
    
    this.matchCallback(correctAnswers,remainingAnswers);
        
        
};