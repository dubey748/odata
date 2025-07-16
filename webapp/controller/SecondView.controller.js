sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("sap.crudle.crudle.controller.SecondView", {
        onInit: function () {
            // Initialization if needed
        },
        onPrevPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this)
            oRouter.navTo('RouteMain')
        }
    });
});
