sap.ui.define([
    "sap/m/MessageToast",
], function (MessageToast) {
    
    return {

        savePOST:function(dataList,ulr){   
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "POST",
                    url:ulr,   
                    data: JSON.stringify(dataList),
                    headers: {"Accept": "*/*","Content-Type": "application/json"},
                    success: function(result) {
                        resolve(result);
                    },
                    error: function(e,xhr,textStatus,err,data) {
                        alert(`error:`);
                        console.log(e);
                        resolve({estado:false,error:e});
                    }
                });
            });
        },
        obtenerGET:function(filtro,ulr){  
            //console.log(filtro); 
            //console.log(ulr); 
            return new Promise(async function (resolve, reject) {
                $.ajax({
                    type: "GET",
                    url:ulr,
                    data: filtro,
                    success: function(result) {
                        resolve(result);
                    },
                    error: function(e,xhr,textStatus,err,data) {
                        console.log(`error:`);
                        console.log(e);
                        resolve({estado:false,error:e});
                    }
                });
            });
        },
        deletePEPinOracle:function(){   

            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "DELETE",
                    url:ulr,
                    headers: {"Accept": "*/*","Content-Type": "application/json"},
                    success: function(result) {
                        console.log("result: ");
                        console.log(result);
                        resolve(result);
                    },
                    error: function(e,xhr,textStatus,err,data) {
                        alert(`error:`);
                        console.log(e);
                        resolve({estado:false,error:e});
                    }
                });
            });
        },
        

    }
});