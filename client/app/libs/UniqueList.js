var UniqueList = function () {    
    this.D =[];
};

UniqueList.prototype.Add =  function (val) {
    
    var idx =0;
    var found =false;
    
    while(idx < this.D.length){
        if(this.D[idx] === val){
            found = true;
        }
        idx++;
    }
    
    if(!found)
        this.D.push(val);
};

