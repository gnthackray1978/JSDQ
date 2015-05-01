var QuestionController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryLoginEvt($.proxy(this.qryLoginEvt, this));// this.view.bindLoginEvt(this.login, this);
    this._view.QryStartTestEvt($.proxy(this.qryStartTestEvt, this));  // this.view.bindStartTestEvt(this.startTest, this);    
    this._view.QrySelectTestEvt($.proxy(this.qrySelectTestEvt, this));// this.view.bindSelectTestEvt(this.selectTest, this);
    this._view.QryTestHistorytEvt($.proxy(this.qryTestHistorytEvt, this));// this.view.bindTestHistorytEvt(this.testHistory, this);
    //this._view.QryEndTestEvt($.proxy(this.qryEndTestEvt, this));
    this._view.QryMainSelectBtn($.proxy(this.qryMainSelectBtn, this));// this.view.bindMainSelectBtn(this.endTest, this);//end test
    this._view.QryPrevQuestionEvt($.proxy(this.qryPrevQuestionEvt, this)); // this.view.bindPrevQuestionEvt(this.displayQuestion, this);
    this._view.QryNextQuestionEvt($.proxy(this.qryNextQuestionEvt, this)); //this.view.bindNextQuestionEvt(this.displayQuestion, this);
    this._view.QrySubmitEvt($.proxy(this.qrySubmitEvt, this)); // this.view.bindSubmitEvt(this.answerQuestion, this);
    this._view.QryAnswerButtonPress($.proxy(this.qryAnswerButtonPress, this)); // this.view.bindAnswerButtonPress(this.answerQuestion, this);
    this._view.QryCorrectAnswerButtonPress($.proxy(this.qryCorrectAnswerButtonPress, this)); // this.view.bindCorrectAnswerButtonPress(this.toggleAnswer, this);
    this._view.QrySelectTestBtn($.proxy(this.qrySelectTestBtn, this));
    this._view.QryCatBtn($.proxy(this.qryCatBtn, this));
    this._view.QryCsvBtn($.proxy(this.qryCsvBtn, this)); // this.view.bindCsvBtn(this.listcsvs, this);
    this._view.QryAnswer($.proxy(this.qryAnswer, this));
    //this._view.QryTabChanged($.proxy(this.qryTabChanged, this));
    this._view.QryCategoryChanged($.proxy(this.qryCategoryChanged, this));
    this._view.QryCSVChanged($.proxy(this.qryCSVChanged, this));
  //  this._view.QryModeChanged($.proxy(this.qryModeChanged, this));

};

QuestionController.prototype = {
    init:function(){
        
    },
    
    // qryEndTestEvt:function(evt){
    //     if (this.model !== null) {
    //         this.model.EndTestEvt(evt);
    //     }
    // },
    
    qryLoginEvt:function(evt){
        if (this.model !== null) {
            this.model.login(evt);
        }
    },
    qryStartTestEvt:function(evt){
        if (this.model !== null) {
            this.model.startTest(evt);
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
   
    qryMainSelectBtn:function(evt){
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
            this.model.SelectTestBtn(evt);
        }
    },
    qryCatBtn:function(evt){
        if (this.model !== null) {
            this.model.CatBtn(evt);
        }
    },
    qryCsvBtn:function(evt){
        if (this.model !== null) {
            this.model.listcsvs(evt);
        }
    },
    qryAnswer:function(evt){
        if (this.model !== null) {
            this.model.Answer(evt);
        }
    }
    ,
    // qryTabChanged:function(evt){
    //     if (this.model !== null) {
    //         this.model.TabChanged(evt);
    //     }
    // },
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
    // ,
    // qryModeChanged:function(evt){
    //     if (this.model !== null) {
    //         this.model.ModeChanged(evt);
    //     }
    // }
    
    
    
}