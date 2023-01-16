sap.ui.define([
    "sap/m/MessageToast",
], function (MessageToast) {
    
    return {

        getLocalOpt:function(ruta){   
            console.log("ruta");
            console.log(ruta);
            return new Promise(function (resolve, reject) {
                $.ajax({
                    dataType: "json",
                    url:`${ruta}`,   
                    success: function(result) {
                        resolve(result);
                    },
                    error: function(e,xhr,textStatus,err,data) {
                        alert(`error:`);
                        resolve(e);
                    }
                });
            });
        },
        actualizar:function(ruta,data){   
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "PUT",
                    headers: {"Accept": "*/*","Content-Type": "application/json"},
                    url:`${ruta}`,
                    data: data,
                    success: function(result) {
                        resolve(result);
                    },
                    error: function(e,xhr,textStatus,err,data) {
                        alert(`error:`);
                        resolve(e);
                    }
                });
            });
        },
        eliminar:function(ruta){   
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "DELETE",
                    headers: {"Accept": "*/*","Content-Type": "application/json"},
                    url:ruta,
                    success: function(result) {
                        resolve(result);
                    },
                    error: function(e,xhr,textStatus,err,data) {
                        alert(`error:`);
                        resolve(e);
                    }
                });
            });
        }
        
        

    }
});