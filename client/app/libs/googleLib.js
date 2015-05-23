var gsheet ;

function sheetLoaded(spreadsheetdata) {
    gsheet = spreadsheetdata;
 
}



var GoogleLibs = function () {    

};


GoogleLibs.prototype.GetData =  function (callback) {
    
	var listofcategories = new UniqueList();
	var listofCSVData = [];

    var idx =0;
    
	while(idx < gsheet.feed.entry.length)
    {
        // make zero based
        var row = Number(gsheet.feed.entry[idx].gs$cell.row)-1;
        var col = Number(gsheet.feed.entry[idx].gs$cell.col)-1;
        
        if(listofCSVData[row] == undefined){
            listofCSVData[row] =[];
        }
         
        listofCSVData[row][col] = gsheet.feed.entry[idx].gs$cell.$t;
        
        if(col ==2){
            listofcategories.Add(gsheet.feed.entry[idx].gs$cell.$t);
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