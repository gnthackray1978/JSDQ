function ScoreTracker(channel) {  
    
    this.results = [];

    // this.AddNewResult(23,'wcf','c#');
    // this.AddNewResult(75,'wcf','c#');
    // this.AddNewResult(56,'wcf','c#');
}

ScoreTracker.prototype.AddNewResult = function(score,type,subtype){
    this.results.push({
        score: score,
        type: type,
        subtype: subtype,
        date: new Date().toLocaleString()
    });
}; 

ScoreTracker.prototype.GetResults = function(type, subType, resultCallback){
    resultCallback(this.results);
}; 

ScoreTracker.prototype.ClearResults = function(){
    this.results = [];
};