sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/v2/ODataModel",
	"./localService/mockserver",
	"./controller/services/OracleWS",
	"sap/ui/core/util/MockServer",
], function (UIComponent, ODataModel, mockserver,OracleWS,MockServer) {
	"use strict";
	const PATH_URL='https://capacitacion-a-default-rtdb.firebaseio.com/';
	window.oMockServer=new MockServer({
		rootUri: ""
	});
	window.sLocalServicePath="";

	return UIComponent.extend("sap.gantt.sample.GanttChart2OData.Component", {
		metadata: {
			rootView: {
				"id": "GanttChart2OData",
				"viewName": "sap.gantt.sample.GanttChart2OData.view.GanttChart2OData",
				"type": "XML",
				"async": true
			},

			dependencies: {
				libs: [
					"sap.gantt",
					"sap.ui.table",
					"sap.m"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"localService/metadata.xml",
						"localService/mockdata/ProjectElems.json",
						"localService/mockdata/Relationships.json",
						"localService/mockdata/CalendarIntervals.json",
						"localService/mockdata/Calendars.json",
						"localService/mockdata/WorkingTimes.json",
						"GanttChart2OData.view.xml",
						"localService/mockserver.js",
						"Component.js",
						"GanttChart2OData.controller.js"
					]
				}
			}
		},
		init:async function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			var sODataServiceUrl = "sap.gantt.GanttChart2OData/";

			// init our mock server
			var rpta = await this.callDataFromWS();
			console.log("rpta");
			console.log(rpta);
			this._oMockServer =await mockserver.init(sODataServiceUrl,rpta);

			// set model on component
			this.setModel(
				new ODataModel(sODataServiceUrl, {
					json: true,
					useBatch: true
				}), "data"
			);
		},
		exit: function () {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		},
		callDataFromWS: async function(){
			return await OracleWS.obtenerGET([],`${PATH_URL}base6.json`);
		}
	});
});
