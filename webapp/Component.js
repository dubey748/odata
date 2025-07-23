sap.ui.define([
    'sap/ui/core/UIComponent'
], function (UIComponent) {
    'use strict';
    return UIComponent.extend("sap.crudle.crudle.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
            //this line will call the base class constructor
            UIComponent.prototype.init.apply(this);
            //Step 1: inside the manifest.json file add - rootView, routing sections
            //Step 2: Get the router object
            var oRouter = this.getRouter();
            //Step 3: Initialize the router
            oRouter.initialize();
        },
    });
});