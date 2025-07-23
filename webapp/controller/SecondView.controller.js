sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
], function (Controller, Fragment) {
    "use strict";

    return Controller.extend("sap.crudle.crudle.controller.SecondView", {
        onInit: function () {
            //Step 1: Get The Router Object
            this.oRouter = this.getOwnerComponent().getRouter();
            //We forefully pass this pointer to herculis (event handler)
            this.oRouter.getRoute("detail").attachPatternMatched(this.herculis, this);
        },
        onFilter: function () {
            //alert('this functionality is under construction, roger copy that');
            Fragment.load({
                name: "sap.crudle.crudle.fragments.popup",
                type: "XML",
                id: "supplier",
                controller: this //controller access is provided to the popup
            })
                //Asynchronous - call back and promise
                .then(function (oSupplier) {
                    oSupplier.setTitle("Select Supplier");
                    oSupplier.open();
                });
        },
        onF4Help: function () {
            //alert('this functionality is under construction, roger copy that');
            Fragment.load({
                name: "sap.crudle.crudle.fragments.popup",
                type: "XML",
                id: 'city',
                controller: this //controller access is provided to the popup
            })
                //Asynchronous - call back and promise
                .then(function (oPopup) {
                    oPopup.setTitle("Select City");
                    oPopup.open();
                });
        },
        onLinkPress: function (oEvent) {
            var sText = oEvent.getSource().getText();
            sText = 'https://google.com?q=' + sText;
            window.open(sText);
        },
        herculis: function (oEvent) {
            var sPath = this.extractPath(oEvent);
            this.getView().bindElement(sPath); // binding with /fruits/4 -
        },
        onBack: function () {
            this.getView().getParent().to("idView1");
        }
    });
});
