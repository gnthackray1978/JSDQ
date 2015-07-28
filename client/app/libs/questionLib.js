var QuestionLib = function () {
    this.listofcategories;
    this.listofCSVData =[];
};

QuestionLib.prototype.LoadInitialData = function (csv, cats, callback){
    this.listofcategories=cats;
    this.listofCSVData =csv;
    this.UpdateCategories(callback);
};

QuestionLib.prototype.GetCategoriesFromTest = function (action){
    action(this.listofcategories);
};

QuestionLib.prototype.UpdateCategories = function (action){
	// do we have selected test
	this.listofcategories = new UniqueList();
    
    if(this.listofCSVData){
        var idx=0;
        while(idx < this.listofCSVData.length){
            this.listofcategories.Add( this.listofCSVData[idx][2]);
            idx++;
        }
        action(this.listofcategories);
    }
};
	
	
// get questions from db
QuestionLib.prototype.CreateQuestionSet = function () {
    console.log('creating question set');
    var csvData = this.listofCSVData;
    var selectedcategory = this.selectedcategory;
    
    var questionColIdx = 3;
    var multiAnswerStartIdx = 4;
    var idx = 1;
    
    var results = {
        questionset :[],
        answerset :[]
    };
   
    while (idx < csvData.length) {
            var cols = csvData[idx];

            if (cols[2] == selectedcategory) {
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
                        results.answerset.push('');

                    }


                    results.questionset.push({ question: cols[questionColIdx], 
                                            answer: answer, 
                                            type: questionType, 
                                            constAnswers: constAnswers, 
                                            score: 0, 
                                            attemptedAnswer:'',
                                            correctAnswers:[]
                                          });
                } else {

                 
                    results.questionset.push({ question: cols[questionColIdx], 
                                            answer: cols[multiAnswerStartIdx], 
                                            type: questionType, 
                                            constAnswers: cols[multiAnswerStartIdx], 
                                            score: 0, 
                                            attemptedAnswer:'',
                                            correctAnswers:[]
                                          });
                    results.answerset.push('');
                }
            }


            idx++;
        }
    
    return results;
}