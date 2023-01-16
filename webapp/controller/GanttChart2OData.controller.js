sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/gantt/simple/Relationship",
	"sap/gantt/AdhocLine",
	"../controller/services/OracleWS",
	"sap/ui/model/json/JSONModel",
	"../controller/services/Local",
	"sap/ui/core/UIComponent",
	"../localService/mockserver",
], function (Controller, MockServer, ODataModel, Relationship, AdhocLine,OracleWS,JSONModel,Local,UIComponent,mockserver) {
	"use strict";

	var oContextMenu = new sap.m.Menu({
		items: [
			new sap.m.MenuItem({
				text: "Delete",
				icon: ""
			}),
			new sap.m.MenuItem({
				text: "Edit Relationship Type",
				items: [
					new sap.m.MenuItem({
						text: "FinishToFinish"
					}),
					new sap.m.MenuItem({
						text: "FinishToStart"
					}),
					new sap.m.MenuItem({
						text: "StartToFinish"
					}),
					new sap.m.MenuItem({
						text: "StartToStart"
					})
				]
			})
		],
		itemSelected: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var oParent = oItem.getParent();
			var clearIcon = function (oParent) {
				oParent.getItems().forEach(function (oItem) { oItem.setIcon(""); });
			};
			clearIcon(oParent);

			var oShape = oContextMenu.selectedShape;
			var sShapeId = oShape.getShapeId();
			var oDataModel = oShape.getModel("data");
			if (oItem.getText() === "Delete") {
				oDataModel.remove("/Relationships('" + sShapeId + "-1')", {
					refreshAfterChange: false
				});

			} else {
				var sType = sap.gantt.simple.RelationshipType[oItem.getText()];
				oDataModel.setProperty("/Relationships('" + sShapeId + "-1')/RelationType", sType, true);
							}
			oContextMenu.close();
		},
		closed: function(oEvent) {
			var clearIcon = function (oParent) {
				oParent.getItems().forEach(function (oItem) { oItem.setIcon(""); });
			};

			clearIcon(oContextMenu.getItems()[1]);
		}
	});

	const PATH_URL='https://capacitacion-a-default-rtdb.firebaseio.com/';
	var oModel1;
	return Controller.extend("sap.gantt.sample.GanttChart2OData.controller.GanttChart2OData", {
		onInit: async function() {
			console.log("onInit");

			/* var get1=await OracleWS.obtenerGET([],`${PATH_URL}base1.json`);
			var get2=await OracleWS.obtenerGET([],`${PATH_URL}base2.json`);
			var get3=await OracleWS.obtenerGET([],`${PATH_URL}base3.json`);
			var get4=await OracleWS.obtenerGET([],`${PATH_URL}base4.json`);
			var get5=await OracleWS.obtenerGET([],`${PATH_URL}base5.json`);
			var informacion={
				"ProjectElems":get1,
				"Relationships":get2,
				"WorkingTimes":get3,
				"CalendarInterval":get4,
				"Calendars":get5
			};
			console.log(informacion);
			oModel1 = new sap.ui.model.json.JSONModel(informacion);
			console.log(oModel1);
			this.getView().setModel(oModel1, "data"); */



			var oViewModel = new sap.ui.model.json.JSONModel({
				alert: false
			});
			this.getView().setModel(oViewModel, "oViewModel");
		},

		onAfterRendering: function () {
			console.log("onAfterRendering");
			var oTableGantt = this.getView().byId("gantt1");
			this.oAlertCheckbox = new sap.m.CheckBox('alert', {
				text: 'Alert',
				enabled: true,
				select: this.onAlertClicked.bind(this)
			});
			oTableGantt.addEventDelegate({onAfterRendering: function() {
				var oGanttOverflowToolbar = oTableGantt.getChartOverflowToolbar();
				if (oGanttOverflowToolbar) {
					oGanttOverflowToolbar.addContent(this.oAlertCheckbox);
				}
			}.bind(this)});
		},

		onShapeDrop: function(oEvent) {
			console.log("onShapeDrop");

			var oTableGantt = this.getView().byId("gantt1");
			var oDataModel = oTableGantt.getModel("data");
			console.log("oDataModel");
			console.log(oDataModel);
			var oNewDateTime = oEvent.getParameter("newDateTime");
			var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
			var sLastDraggedShapeUid = oEvent.getParameter("lastDraggedShapeUid");
			var oOldStartDateTime = oDraggedShapeDates[sLastDraggedShapeUid].time;
			var oOldEndDateTime = oDraggedShapeDates[sLastDraggedShapeUid].endTime;
			var iMoveWidthInMs = oNewDateTime.getTime() - oOldStartDateTime.getTime();
			if (oTableGantt.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.End) {
				iMoveWidthInMs = oNewDateTime.getTime() - oOldEndDateTime.getTime();
			}

			var getBindingContextPath = function (sShapeUid) {
				var oParsedUid = sap.gantt.misc.Utility.parseUid(sShapeUid);
				return oParsedUid.shapeDataName;
			};

			Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
				var sPath = getBindingContextPath(sShapeUid);
				var oOldDateTime = oDraggedShapeDates[sShapeUid].time;
				var oOldEndDateTime = oDraggedShapeDates[sShapeUid].endTime;
				var oNewDateTime = new Date(oOldDateTime.getTime() + iMoveWidthInMs);
				var oNewEndDateTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);
				oDataModel.setProperty(sPath + "/StartDate", oNewDateTime, true);
				oDataModel.setProperty(sPath + "/EndDate", oNewEndDateTime, true);
			});
		},

		onShapeResize: function(oEvent) {
			console.log("onShapeResize");

				var oShape = oEvent.getParameter("shape");
				var aNewTime = oEvent.getParameter("newTime");
				var sBindingPath = oShape.getBindingContext("data").getPath();
				var oTableGantt = this.getView().byId("gantt1");
				var oDataModel = oTableGantt.getModel("data");
				oDataModel.setProperty(sBindingPath + "/StartDate", aNewTime[0], true);
				oDataModel.setProperty(sBindingPath + "/EndDate", aNewTime[1], true);
		},

		onShapeContextMenu: function(oEvent) {
			console.log("onShapeContextMenu");

			var oShape = oEvent.getParameter("shape");
			var iPageX = oEvent.getParameter("pageX");
			var iPageY = oEvent.getParameter("pageY");

			if (oShape instanceof Relationship) {
				var sType = oShape.getType();
				oContextMenu.getItems()[1].getItems().filter(function (item) { return item.getText() == sType; })[0].setIcon("sap-icon://accept");
				// oContextMenu.getItems()[1].getItems()[iType].setIcon("sap-icon://accept");
				oContextMenu.selectedShape = oShape;
				var oPlaceHolder = new sap.m.Label();
				var oPopup = new sap.ui.core.Popup(oPlaceHolder, false, true, false);
				var eDock = sap.ui.core.Popup.Dock;
				var sOffset = (iPageX + 1) + " " + (iPageY + 1);
				oPopup.open(0, eDock.BeginTop, eDock.LeftTop, null , sOffset);
				oContextMenu.openBy(oPlaceHolder);
			}
		},
		onShapePress: function(oEvent){
			console.log("onShapePress");

			var oShape = oEvent.getParameter('shape');
			var oGantt = this.getView().byId("gantt1");
			var oContainer = oGantt.getParent();
			if (oShape){
				oContainer.setStatusMessage(oShape.getTitle());
			} else {
				oContainer.setStatusMessage("");
			}
		},

		onShapeConnect: function(oEvent) {
			console.log("onShapeConnect");

			var oTableGantt = this.getView().byId("gantt1");
			var sFromShapeUid = oEvent.getParameter("fromShapeUid");
			var sToShapeUid = oEvent.getParameter("toShapeUid");
			var iType = oEvent.getParameter("type");

			var fnParseUid = sap.gantt.misc.Utility.parseUid;
			var oDataModel = oTableGantt.getModel("data");

			var oParsedUid = fnParseUid(sFromShapeUid);
			var sShapeId = oParsedUid.shapeId;
			var sRowId = fnParseUid(oParsedUid.rowUid).rowId;
			var mParameters = {
				context: oDataModel.getContext("/ProjectElems('" + sRowId + "')"),
				success: function (oData) {
					oDataModel.read("/ProjectElems('" + sRowId + "')", {
						urlParameters: {
							"$expand": "Relationships"
						}
					});
				},
				refreshAfterChange: false
			};

			var sRelationshipID = "rls-temp-" + new Date().getTime();
			var oNewRelationship = {
				"ObjectID": sRelationshipID + "-1",
				"RelationID": sRelationshipID,
				"ParentObjectID": sRowId,
				"PredecTaskID": sShapeId,
				"SuccTaskID": fnParseUid(sToShapeUid).shapeId,
				"RelationType": iType
			};
			oDataModel.create('/Relationships', oNewRelationship, mParameters);
		// oDataModel.submitChanges();
		},

		handleExpandShape: function (oEvent) {
			console.log("handleExpandShape");

			var oTableGantt = this.getView().byId("gantt1");
			var oTable = oTableGantt.getTable();
			var aSelectedRows = oTable.getSelectedIndices();
			oTable.expand(aSelectedRows);
		},

		handleCollapseShape: function (oEvent) {
			console.log("handleCollapseShape");

			var oTableGantt = this.getView().byId("gantt1");
			var oTable = oTableGantt.getTable();
			var aSelectedRows = oTable.getSelectedIndices();
			oTable.collapse(aSelectedRows);
		},

		handleAdhocLineTimeChange: function(oEvent) {
			console.log("handleAdhocLineTimeChange");

			var oTableGantt = this.getView().byId("gantt1");
			oTableGantt.addAdhocLine(new AdhocLine({
				stroke: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
				strokeWidth: 2,
				strokeDasharray: "5, 1",
				timeStamp: oEvent.getParameter("value"),
				description: "Adhoc line description"
			}));
		},

		checkStatus: function(sStartDate, sEndDate) {
			console.log("checkStatus");
			//console.log(`start: ${sStartDate}, end: ${sEndDate}`);

			// get the days difference between the start date and the end date
			var	iDaysDiff = (sEndDate - sStartDate) / (24 * 60 * 60 * 1000),
				bMoreThanFourWeeks = iDaysDiff > (7 * 4);
			return bMoreThanFourWeeks;
		},

		onAlertClicked: function () {
			console.log("onAlertClicked");

			var bAnimate = sap.ui.getCore().byId("alert").getSelected();
			this.getView().getModel("oViewModel").setProperty("/alert", bAnimate);
		},

		onGanttSidePanel: function(oEvent) {
			console.log("onGanttSidePanel");

			oEvent.getParameters().updateSidePanelState.enable();
		},
		readValue: async function(){
			var sODataServiceUrl = "sap.gantt.GanttChart2OData/";
			var opts= await Local.getLocalOpt('./data/test3.json');
			window.oMockServer._oMockdata=opts;
			
			this.getView().setModel(
				new ODataModel(sODataServiceUrl, {
					json: true,
					useBatch: true
				}), "data"
			);
		},
		readValue2: async function(){
			//var oModel = new sap.ui.model.json.JSONModel();
			//oModel.loadData("./localService/mockdata/Calendars.json");
			/* var opts1= await Local.getLocalOpt('./localService/mockdata/Calendars.json');
			var opts2= await Local.actualizar('./localService/mockdata/Calendars.json',{});
			var opts3= await Local.eliminar('./localService/mockdata/Calendars.json'); */
			/* var oModel = new sap.ui.model.json.JSONModel("./localService/mockdata/Calendars.json");
			console.log(oModel);
			sap.ui.getCore().setModel(oModel);
			console.log(oModel); */
			console.log(__dirname);
			/* console.log(opts2);
			console.log(opts3); */
			//console.log(object);
			//console.log(yourModel.getProperty("./localService/mockdata/Calendars.json"));
		}
	});
});
