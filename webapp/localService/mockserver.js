sap.ui.define([
	"sap/ui/core/util/MockServer",
	"../controller/services/OracleWS",
], function (MockServer,OracleWS) {
	"use strict";
	const PATH_URL='https://capacitacion-a-default-rtdb.firebaseio.com/';
	/* window.oMockServer;
	window.sLocalServicePath; */
	return {

		init: function (sODataServiceUrl,datos) {
			console.log("init MOK");
			//var oMockServer, sLocalServicePath;

			// create
			oMockServer = new MockServer({
				rootUri: sODataServiceUrl
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 10
			});

			sLocalServicePath = sap.ui.require.toUrl("sap/gantt/sample/GanttChart2OData/localService");
			// simulate
			oMockServer.simulate(sLocalServicePath + "/metadata.xml", {
				sMockdataBaseUrl : sLocalServicePath + "/mockdata",
				bGenerateMissingMockData: true
			});

			// start
			/* console.log("oMockServer 0");
			console.log(oMockServer);

			oMockServer._oMockdata=[]
			console.log("oMockServer 1");
			console.log(oMockServer); */

			oMockServer._oMockdata=datos;
			console.log("oMockServer 2");
			console.log(oMockServer);
			
			oMockServer.start();
			return oMockServer;
		}

	};

});
