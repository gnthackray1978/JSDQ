var ListHelper = function () {    

};

ListHelper.prototype.Addlinks =  function (dupeEvents, func, context) {
    
        for (var i = 0; i < dupeEvents.length; i++) {

           // if ($("#" + dupeEvents[i].key).length >0) {

            try {
                
          
                $("#" + dupeEvents[i].key).off("click", "**");
                
                
       //     $("#" + dupeEvents[i].key).die("click");

            //console.log('creating event for : ' + dupeEvents[i].key);

            var somecrap = function (idx, val) {
                //probably not efficient to do this multiple times
                //this can be a future optimization.

                $( "body" ).on( "click", "#" + dupeEvents[idx].key,  $.proxy(function () {
                    var va = val;

                    //console.log('clicked with : ' + va);

                    if (va !== null)
                        func.call(context, va);
                    else
                        func.call(context);

                    return false;
                }, context) );
            
                
                //$("#" + dupeEvents[idx].key).live("click", $.proxy(function () {
                //    var va = val;

                //    //console.log('clicked with : ' + va);

                //    if (va !== null)
                //        func.call(context, va);
                //    else
                //        func.call(context);

                //    return false;
                //}, context));
                



            };

            somecrap(i, dupeEvents[i].value);


            } catch (e) {
                console.log('couldnt find: ' + "#" + dupeEvents[i].key);
            }
            //} else {
            //    
            //}
        }

    };