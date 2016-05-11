var ENUM_STATES = {
    LOGGEDIN: -1,
    LOGGEDOUT: -2,
    INTEST: 0,
    CATEGORYSELECT :5,
    TESTSELECT:4,
    TESTCREATE :6
};

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
    this.loginMessage ='';
    
    this.MSTATE = ENUM_STATES.LOGGEDIN;
  //  this.headerIdx=1;
    
    this.visibleAnswer=false;
    this.visibleImage=false;
    
    this.isMultipleChoice =false;
    this.multiChoiceQuestion='';
    this.multiChoiceConstantAnswer ='';
    this.multiChoiceIdx=0;
  
    this.catList =[];
    this.csvList =[];
    this.results =[];
    
};

