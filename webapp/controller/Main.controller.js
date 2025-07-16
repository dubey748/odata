sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("sap.crudle.crudle.controller.Main", {
        onInit: function () {
            const dataModel = new JSONModel();
            dataModel.loadData("/model/mockData/crudle.json", null, false);

            const initialModel = {
                newItem: { id: "", name: "", assignedWork: "", status: "" },
                workItems: dataModel.getProperty("/workItems") || [],
                statuses: dataModel.getProperty("/statuses") || [],
                historyLog: dataModel.getProperty("/historyLog") || [],
                filteredHistoryLog: [],
                currentEditIndex: -1,
                selectedTaskId: ""
            };

            this.getView().setModel(new JSONModel(initialModel));
        },

        onAdd: function () {
            const oModel = this.getView().getModel();
            const newItem = oModel.getProperty("/newItem");
            const index = oModel.getProperty("/currentEditIndex");
            const workItems = oModel.getProperty("/workItems");
            const historyLog = oModel.getProperty("/historyLog");

            let action;
            const clonedItem = Object.assign({}, newItem);

            if (index > -1) {
                workItems[index] = clonedItem;
                action = "Updated";
                oModel.setProperty("/currentEditIndex", -1);
            } else {
                workItems.push(clonedItem);
                action = "Created";
            }

            oModel.setProperty("/workItems", workItems);
            historyLog.push({
                action,
                item: clonedItem,
                timestamp: this._getFormattedTimestamp()
            });
            oModel.setProperty("/historyLog", historyLog);

            this._updateFilteredHistory();

            oModel.setProperty("/newItem", {
                id: "", name: "", assignedWork: "", status: ""
            });
        },

        onDelete: function (oEvent) {
            const oModel = this.getView().getModel();
            const workItems = oModel.getProperty("/workItems");
            const historyLog = oModel.getProperty("/historyLog");

            const oContext = oEvent.getSource().getBindingContext();
            const index = oContext.getPath().split("/").pop();
            const deletedItem = Object.assign({}, workItems[index]);

            workItems.splice(index, 1);
            oModel.setProperty("/workItems", workItems);

            historyLog.push({
                action: "Deleted",
                item: deletedItem,
                timestamp: this._getFormattedTimestamp()
            });
            oModel.setProperty("/historyLog", historyLog);

            this._updateFilteredHistory();
        },

        onSelect: function (oEvent) {
            const oModel = this.getView().getModel();
            let oContext = oEvent.getParameter("listItem")?.getBindingContext()
                || oEvent.getSource().getBindingContext();

            if (!oContext) return;

            const selectedItem = oContext.getObject();
            const workItems = oModel.getProperty("/workItems");

            const index = workItems.findIndex(item => item.id === selectedItem.id);

            oModel.setProperty("/newItem", Object.assign({}, selectedItem));
            oModel.setProperty("/currentEditIndex", index);
            oModel.setProperty("/selectedTaskId", selectedItem.id);

            this._updateFilteredHistory();
        },

        _getFormattedTimestamp: function () {
            return new Date().toLocaleString();
        },

        formatHistoryEntry: function (action, item, timestamp) {
            if (!item) return "";

            const id = item.id || "N/A";
            const assignee = item.name || "Unknown";
            const status = item.status || "Unknown";

            return `Task (ID: ${id}) was ${action} by "${assignee}"\nStatus: ${status} on ${timestamp}`;
        },

        _updateFilteredHistory: function () {
            const oModel = this.getView().getModel();
            const selectedId = oModel.getProperty("/selectedTaskId");
            const allHistory = oModel.getProperty("/historyLog") || [];

            const filtered = selectedId
                ? allHistory.filter(entry => entry.item?.id === selectedId)
                : [];

            oModel.setProperty("/filteredHistoryLog", filtered);
        },

        // Routing Logic
        onNextPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteSecond");
        }
    });
});
