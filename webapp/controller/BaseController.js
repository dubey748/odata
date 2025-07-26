sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/crudle/crudle/util/formatter'
], function(Controller, Formatter) {
    'use strict';
    return Controller.extend("sap.crudle.crudle.controller.BaseController",{
        formatter: Formatter,
        extractPath: function(oEvent){
            var fruitId = oEvent.getParameter("arguments").fruitId;
            return '/fruits/' + fruitId;
        },
        readMessage: function(key, param1){
            var oResourceModel=this.getOwnerComponent().getModel("i18n");
            var oResourceBundle=oResourceModel.getResourceBundle();
            return oResourceBundle.getText(key, [param1]);
        }
    });
});