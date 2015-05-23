var gsheet ;

function sheetLoaded(spreadsheetdata) {
    gsheet = spreadsheetdata;
 
}



var GoogleLibs = function () {    
    this.startRow =1;
};

GoogleLibs.prototype.GetTestList =  function (callback) {
    console.log('GoogleLibs.GetTestList - fetching list of test');
    
    var that = this;
    
    var idx =0;

	var tplist = new UniqueList();
 	
	while(idx < gsheet.feed.entry.length)
    {
        // make zero based
        //var row = Number(gsheet.feed.entry[idx].gs$cell.row)-1;
        var col = Number(gsheet.feed.entry[idx].gs$cell.col)-1;
        
        if(col ==0 && idx >= that.startRow){
            tplist.Add(gsheet.feed.entry[idx].gs$cell.$t);
        }
        
        idx++;
    }
    
    idx=0;
    
    var listoftests =[];
    
    while(idx < tplist.D.length){
        listoftests.push({ key: tplist.D[idx], value: tplist.D[idx] });
        idx++;
    }
    
    callback(listoftests);
},

GoogleLibs.prototype.GetData =  function (callback) {
    
	var listofcategories = new UniqueList();
	var listofCSVData = [];

    var idx =0;
    
	while(idx < gsheet.feed.entry.length)
    {
        // make zero based
        var row = Number(gsheet.feed.entry[idx].gs$cell.row)-1;
        var col = Number(gsheet.feed.entry[idx].gs$cell.col)-1;
        
        if(idx >= this.startRow){
            if(listofCSVData[row] == undefined){
                listofCSVData[row] =[];
            }
             
            listofCSVData[row][col] = gsheet.feed.entry[idx].gs$cell.$t;
            
            if(col ==2){
                listofcategories.Add(gsheet.feed.entry[idx].gs$cell.$t);
            }
        }
        
        idx++;
    }
    
    callback(listofcategories, listofCSVData);
    
    	//gsheet
		
        // 		spreadsheetdata.feed.entry[0].gs$cell
        // Object {row: "1", col: "1", $t: "IsMale"}
        // spreadsheetdata.feed.entry.length
        // 231
};