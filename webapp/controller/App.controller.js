sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (Controller) => {
  "use strict";

  return Controller.extend("sap.crudle.crudle.controller.App", {
    onInit() {
      const oRouter = this.getOwnerComponent().getRouter();

      oRouter.getRoute("detail").attachPatternMatched(this._onFruitMatched, this);
    },

    _onFruitMatched(oEvent) {
      const fruitId = oEvent.getParameter("arguments").fruitId;
      const sPath = "/fruits/" + fruitId;
      console.log("🍌 Matched Fruit ID:", fruitId);
      console.log("🍎 Binding path:", sPath);

      // Get detail view by ID and bind it
      const oSplitApp = this.byId("appCon");
      const oDetailPage = oSplitApp.getDetailPages().find(page => page.getViewName().includes("SecondView"));

      if (oDetailPage && oDetailPage.bindElement) {
        oDetailPage.bindElement(sPath);
        console.log("✅ Bound SecondView to", sPath);
      } else {
        console.warn("⚠️ Could not find SecondView to bind");
      }
    }
  });
});
