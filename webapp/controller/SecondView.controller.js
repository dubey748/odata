sap.ui.define([
    "sap/crudle/crudle/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/MessageStrip"
], function (Controller, Fragment, Filter, FilterOperator, MessageBox, MessageToast, MessageStrip) {

    "use strict";
    return Controller.extend("sap.crudle.crudle.controller.SecondView", {
        onInit: function () {
            console.log("Ab:SecondView");
        },
        selectedField: null,
        onConfirm: function (oEvent) {
            var sId = oEvent.getSource().getId()
            if (sId.indexOf('city') !== -1) {
                var oSelectedItem = oEvent.getParameter("selectedItem")
                var stext = oSelectedItem.getLabel()
                this.selectedField.setValue(stext)

            }
            else {
                var oTable = this.getView().byId("filterTab")
                var sSelectedItems = oEvent.getParameter("selectedItems")
                var aFilters = []
                for (let index = 0; index < sSelectedItems.length; index++) {
                    const element = sSelectedItems[index];
                    const sText = element.getLabel()
                    aFilters.push(new Filter('name', FilterOperator.EQ, sText))

                }
                var oFilter = new Filter({
                    filters: aFilters,
                    and: false
                })
                oTable.getBinding("items").filter(oFilter)
            }
        },
        onSearchPopup: function (oEvent) {
            var oVal = oEvent.getParameter("value")
            var oBinding = oEvent.getParameter("itemsBinding")
            var oFilter = new Filter('name', FilterOperator.Contains, oVal)
            oBinding.filter(oFilter)
        },
        oSupplierPopup: null,
        onFilter: function () {

            //alert('this functionality is under construction, roger copy that');
            if (!this.oSupplierPopup) {
                var that = this
                Fragment.load({
                    name: "sap.crudle.crudle.fragments.popup",
                    type: "XML",
                    id: "supplier",
                    controller: this //controller access is provided to the popup
                })
                    //Asynchronous - call back and promise
                    .then(function (oSupplier) {
                        that.oSupplierPopup = oSupplier
                        that.oSupplierPopup.setTitle("Select Supplier");
                        that.getView().addDependent(that.oSupplierPopup)
                        that.oSupplierPopup.bindAggregation("items", {
                            path: '/supplier',
                            template: new sap.m.DisplayListItem({
                                label: '{name}',
                                value: '{city}'
                            })
                        })
                        that.oSupplierPopup.open();
                    });
            }
            else {
                this.oSupplierPopup.open();
            }
        },
        oCityPopup: null,
        onF4Help: function (oEvent) {
            this.selectedField = oEvent.getSource()
            //alert('this functionality is under construction, roger copy that');
            if (!this.oCityPopup) {
                var that = this
                Fragment.load({
                    name: "sap.crudle.crudle.fragments.popup",
                    type: "XML",
                    id: 'city',
                    controller: this //controller access is provided to the popup
                })
                    //Asynchronous - call back and promise
                    .then(function (oPopup) {
                        that.oCityPopup = oPopup
                        that.oCityPopup.setTitle("Select City");
                        that.getView().addDependent(that.oCityPopup)
                        that.oCityPopup.bindAggregation("items", {
                            path: '/cities',
                            template: new sap.m.DisplayListItem({
                                label: '{name}',
                                value: '{famousFor}'
                            })
                        })
                        that.oCityPopup.setMultiSelect(false)
                        that.oCityPopup.open();
                    });
            }
            else {
                this.oCityPopup.open();
            }
        },
        onLinkPress: function (oEvent) {
            var sText = oEvent.getSource().getText();
            sText = 'https://google.com?q=' + sText;
            window.open(sText);
        },
        herculis: function (oEvent) {
            var fruitId = oEvent.getParameter("arguments").fruitId;
            var sPath = "/fruits/" + fruitId;
            console.log("🍉 Manual herculis path:", sPath);
            this.getView().bindElement(sPath);
        }
        ,
        onBack: function () {
            this.getView().getParent().to("idView1");
        },
        handleConfirm: function (status) {
            if (status == 'OK') {
                MessageToast.show(this.readMessage("XMSG_ORDERL", "9099"))
            }
            else {
                MessageToast.show(this.readMessage("XMSG_CANCEL"))
            }
        },
        onOrder: function (params) {
            MessageBox.confirm(this.readMessage("XMSG_CONFIRMATION"), {
                title: "Confirmation",
                onClose: this.handleConfirm.bind(this)
            }
            )
        },
        onCancel: function () {
            MessageToast.show("Order canceled");
        }
    });
});
