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
            var historyLog = []

            if (dataModel.getProperty("/workItems")) {
                workItems = dataModel.getProperty("/workItems");
            }

            if (dataModel.getProperty("/statuses")) {
                statuses = dataModel.getProperty("/statuses");
            }
            if (dataModel.getProperty("/historyLog")) {
                historyLog = dataModel.getProperty("/historyLog");
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
                currentEditIndex: -1,
                historyLog: historyLog
            };

            var oModel = new JSONModel(initialModel);
            this.getView().setModel(oModel);
        },
        onAdd: function () {
            var oModel = this.getView().getModel();
            var newItem = oModel.getProperty("/newItem");
            var index = oModel.getProperty("/currentEditIndex");
            var workItems = oModel.getProperty("/workItems") || [];
            var historyLog = oModel.getProperty("/historyLog") || []; // ✅ Declare historyLog properly

            let action = "";

            if (index > -1) {
                // 🔁 Update existing item
                workItems[index] = Object.assign({}, newItem);
                oModel.setProperty("/workItems", workItems);
                action = "Updated";

                // Reset state
                oModel.setProperty("/currentEditIndex", -1);
            } else {
                // ➕ Add new item
                var itemToAdd = Object.assign({}, newItem);
                workItems.push(itemToAdd);
                oModel.setProperty("/workItems", workItems);
                action = "Created";
            }

            // Clone item for logging
            var itemToLog = Object.assign({}, newItem);

            // ✅ Push into historyLog correctly
            historyLog.push({
                action: action,
                item: itemToLog,
                timestamp: this._getFormattedTimestamp()
            });

            // ✅ Update historyLog back into the model
            oModel.setProperty("/historyLog", historyLog);

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
            var historyLog = oModel.getProperty("/historyLog") || [];
            // Get index from the clicked row
            var oContext = oEvent.getSource().getBindingContext();
            var index = oContext.getPath().split("/").pop(); // Get index

            // Store the item before deleting
            var deletedItem = Object.assign({}, workItems[index]);
            // Remove the item
            workItems.splice(index, 1);
            oModel.setProperty("/workItems", workItems);
            historyLog.push({
                action: "Deleted",
                item: deletedItem,
                timestamp: this._getFormattedTimestamp()
            });
            oModel.setProperty("/historyLog", historyLog);
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
        },
        _getFormattedTimestamp: function () {
            var now = new Date();
            return now.toLocaleString();
        },
        formatHistoryEntry: function (action, item, timestamp) {
            if (!item) return "";

            const id = item.id || "N/A";
            const assignee = item.name || "Unknown";
            const status = item.status || "Unknown";

            return `Task (ID: ${id}) was ${action} by "${assignee}"\nStatus: ${status} on ${timestamp}`;
        }

    });
});
