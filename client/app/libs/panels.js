


var Panels = function () { }


Panels.prototype = {

    masterShowTab: function (panel) {
        if (panel == 1) {
            $("#panelA").removeClass("hidePanel").addClass("displayPanel");
            $("#panelB").removeClass("displayPanel").addClass("hidePanel");
            $("#panelC").removeClass("displayPanel").addClass("hidePanel");
            $("#panelD").removeClass("displayPanel").addClass("hidePanel");
            $("#panelE").removeClass("displayPanel").addClass("hidePanel");
            $("#panelF").removeClass("displayPanel").addClass("hidePanel");
        }

        if (panel == 2) {
            $("#panelA").removeClass("displayPanel").addClass("hidePanel");
            $("#panelB").removeClass("hidePanel").addClass("displayPanel");
            $("#panelC").removeClass("displayPanel").addClass("hidePanel");
            $("#panelD").removeClass("displayPanel").addClass("hidePanel");
            $("#panelE").removeClass("displayPanel").addClass("hidePanel");
            $("#panelF").removeClass("displayPanel").addClass("hidePanel");
        }

        if (panel == 3) {

            $("#panelA").removeClass("displayPanel").addClass("hidePanel");
            $("#panelB").removeClass("displayPanel").addClass("hidePanel");
            $("#panelC").removeClass("hidePanel").addClass("displayPanel");
            $("#panelD").removeClass("displayPanel").addClass("hidePanel");
            $("#panelE").removeClass("displayPanel").addClass("hidePanel");
            $("#panelF").removeClass("displayPanel").addClass("hidePanel");
        }

        if (panel == 4) {

            $("#panelA").removeClass("displayPanel").addClass("hidePanel");
            $("#panelB").removeClass("displayPanel").addClass("hidePanel");
            $("#panelC").removeClass("displayPanel").addClass("hidePanel");
            $("#panelD").removeClass("hidePanel").addClass("displayPanel");
            $("#panelE").removeClass("displayPanel").addClass("hidePanel");
            $("#panelF").removeClass("displayPanel").addClass("hidePanel");
        }
        
        if (panel == 5) {

            $("#panelA").removeClass("displayPanel").addClass("hidePanel");
            $("#panelB").removeClass("displayPanel").addClass("hidePanel");
            $("#panelC").removeClass("displayPanel").addClass("hidePanel");
            $("#panelD").removeClass("displayPanel").addClass("hidePanel");
            $("#panelE").removeClass("hidePanel").addClass("displayPanel");
            $("#panelF").removeClass("displayPanel").addClass("hidePanel");
        }

        if (panel == 6) {

            $("#panelA").removeClass("displayPanel").addClass("hidePanel");
            $("#panelB").removeClass("displayPanel").addClass("hidePanel");
            $("#panelC").removeClass("displayPanel").addClass("hidePanel");
            $("#panelD").removeClass("displayPanel").addClass("hidePanel");
            $("#panelE").removeClass("displayPanel").addClass("hidePanel");
            $("#panelF").removeClass("hidePanel").addClass("displayPanel");
        }




    }
}