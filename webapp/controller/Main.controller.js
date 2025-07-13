sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("sap.crudle.crudle.controller.Main", {
        onInit: function () {
            var dataModel = new JSONModel();
            dataModel.loadData("/model/mockData/crudle.json", null, false);

            var workItems = [];
            var statuses = [];

            if (dataModel.getProperty("/workItems")) {
                workItems = dataModel.getProperty("/workItems");
            }

            if (dataModel.getProperty("/statuses")) {
                statuses = dataModel.getProperty("/statuses");
            }

            var initialModel = {
                newItem: {
                    id: "",
                    name: "",
                    assignedWork: "",
                    status: ""
                },
                workItems: workItems,
                statuses: statuses,
                currentEditIndex: -1
            };

            var oModel = new JSONModel(initialModel);
            this.getView().setModel(oModel);
        },
        onAdd: function () {
            var oModel = this.getView().getModel();
            var newItem = oModel.getProperty("/newItem");
            var index = oModel.getProperty("/currentEditIndex");
            var workItems = oModel.getProperty("/workItems") || [];

            if (index > -1) {
                // 🔁 Update existing item
                workItems[index] = Object.assign({}, newItem);
                oModel.setProperty("/workItems", workItems);

                // Reset state
                oModel.setProperty("/currentEditIndex", -1);
            } else {
                // ➕ Add new item
                var itemToAdd = Object.assign({}, newItem);
                workItems.push(itemToAdd);
                oModel.setProperty("/workItems", workItems);
            }

            // Clear form
            oModel.setProperty("/newItem", {
                id: "",
                name: "",
                assignedWork: "",
                status: ""
            });
        },
        onDelete: function (oEvent) {
            var oModel = this.getView().getModel();
            var workItems = oModel.getProperty("/workItems");
            var oContext = oEvent.getSource().getBindingContext();
            var index = oContext.getPath().split("/").pop(); // Get index

            // Remove the item
            workItems.splice(index, 1);
            oModel.setProperty("/workItems", workItems);
        },
        onEdit: function (oEvent) {
            var oModel = this.getView().getModel();
            var oContext = oEvent.getSource().getBindingContext();
            var index = oContext.getPath().split("/").pop();

            var selectedItem = oModel.getProperty(oContext.getPath());

            // Set selected item to form (input fields)
            oModel.setProperty("/newItem", Object.assign({}, selectedItem));

            // Store index to know which item to update
            oModel.setProperty("/currentEditIndex", index);
        }

    });
});
