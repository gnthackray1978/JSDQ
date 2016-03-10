var QuizVM = function (channel) {
    this._channel = channel;
    
    this.currentQuestion ='';
    this.answerSoFar ='';
    this.answerBox ='';
    this.testName ='';
    this.catName ='';
    this.mainBody ='';
    this.imagePath = '';
    this.correctAnswer ='';
    this.percentageCorrect =0;
    this.questionScore=0;
    this.loginName ='';
    this.tabIdx =0;
    this.headerIdx=1;
    
    this.visibleAnswer=false;
    this.visibleImage=false;
    
    this.isMultipleChoice =false;
    this.multiChoiceQuestion='';
    this.multiChoiceConstantAnswer ='';
    this.multiChoiceIdx=0;
  
    this.catList =[];
    this.csvList =[];
    
};

