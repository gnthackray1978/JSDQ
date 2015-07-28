var QuestionLib = function () {

};

QuestionLib.prototype.ParseCats = function (csv, callback){

    var listofcategories = new UniqueList();
    
    if(csv){
        var idx=0;
        while(idx < csv.length){
            listofcategories.Add( csv[idx][2]);
            idx++;
        }
        callback(csv, listofcategories);
    }
};

QuestionLib.prototype.GetCategoriesFromTest = function (action){
    action(this.listofcategories);
};

	
// get questions from db
QuestionLib.prototype.CreateQuestionSet = function (rawCSVData, selectedcategory) {
    console.log('creating question set');
    var csvData = rawCSVData;
   
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