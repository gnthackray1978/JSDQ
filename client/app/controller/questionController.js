var QuestionController = function (view, model) {
    this.view = view;

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
    this.view.QryAnswer(this.qryAnswer,this);
};

QuestionController.prototype = {
    init:function(){
        
    },
    
    qryModeChanged:function(evt){
        if (this.model !== null) {
            this.model.ModeChanged(evt);
        }
    },
    
     
    
    qrySelectTestEvt:function(evt){
        if (this.model !== null) {
            this.model.selectTest(evt);
        }
    },
    qryTestHistorytEvt:function(evt){
        if (this.model !== null) {
            this.model.testHistory(evt);
        }
    },
    qryStartTestEvt:function(evt){
        if (this.model !== null) {
            this.model.startTest(evt);
        }
    },
    qryEndTestEvt:function(evt){
        if (this.model !== null) {
            this.model.endTest(evt);
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
            this.model.toggleAnswer(evt);
        }
    },
    qrySelectTestBtn:function(evt){
        if (this.model !== null) {
            this.model.questionSelectionsEnabled(evt);
        }
    },
    qryCatBtn:function(evt){
        //button in ui commented out
        if (this.model !== null) {
            this.model.listcats(evt);
        }
    },
    qryCsvBtn:function(evt){
        // button in ui commented out
        if (this.model !== null) {
            this.model.listtests(evt);
        }
    },
    qryAnswer:function(evt){
        if (this.model !== null) {
            this.model.Answer(evt);
        }
    },
    qryCategoryChanged:function(evt){
        if (this.model !== null) {
            this.model.CategoryChanged(evt);
        }
    },
    qryCSVChanged:function(evt){
        if (this.model !== null) {
            this.model.CSVChanged(evt);
        }
    }
    
}