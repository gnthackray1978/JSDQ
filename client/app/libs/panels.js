


var Panels = function () { }


Panels.prototype = {

    masterShowTab: function (panel) {
        if (panel == 1) {
            $("#pnlQuestions").removeClass("hidePanel").addClass("displayPanel");
            $("#pnlCategories").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlCSVList").removeClass("displayPanel").addClass("hidePanel");
            $("#panelD").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlWebCategories").removeClass("displayPanel").addClass("hidePanel");
            $("#panelF").removeClass("displayPanel").addClass("hidePanel");
        }

        if (panel == 2) {
            $("#pnlQuestions").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlCategories").removeClass("hidePanel").addClass("displayPanel");
            $("#pnlCSVList").removeClass("displayPanel").addClass("hidePanel");
            $("#panelD").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlWebCategories").removeClass("displayPanel").addClass("hidePanel");
            $("#panelF").removeClass("displayPanel").addClass("hidePanel");
        }

        if (panel == 3) {

            $("#pnlQuestions").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlCategories").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlCSVList").removeClass("hidePanel").addClass("displayPanel");
            $("#panelD").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlWebCategories").removeClass("displayPanel").addClass("hidePanel");
            $("#panelF").removeClass("displayPanel").addClass("hidePanel");
        }

        if (panel == 4) {

            $("#pnlQuestions").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlCategories").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlCSVList").removeClass("displayPanel").addClass("hidePanel");
            $("#panelD").removeClass("hidePanel").addClass("displayPanel");
            $("#pnlWebCategories").removeClass("displayPanel").addClass("hidePanel");
            $("#panelF").removeClass("displayPanel").addClass("hidePanel");
        }
        
        if (panel == 5) {

            $("#pnlQuestions").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlCategories").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlCSVList").removeClass("displayPanel").addClass("hidePanel");
            $("#panelD").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlWebCategories").removeClass("hidePanel").addClass("displayPanel");
            $("#panelF").removeClass("displayPanel").addClass("hidePanel");
        }

        if (panel == 6) {

            $("#pnlQuestions").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlCategories").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlCSVList").removeClass("displayPanel").addClass("hidePanel");
            $("#panelD").removeClass("displayPanel").addClass("hidePanel");
            $("#pnlWebCategories").removeClass("displayPanel").addClass("hidePanel");
            $("#panelF").removeClass("hidePanel").addClass("displayPanel");
        }




    }
}