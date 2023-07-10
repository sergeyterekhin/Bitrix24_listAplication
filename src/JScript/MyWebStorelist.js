    let paramsBasicTable={
        'IBLOCK_TYPE_ID': 'lists',
        'IBLOCK_ID': '25'
    };

    async function GetListConsuption(id=null){
    return await new Promise((resolve,reject)=>{
            BX24.callMethod('lists.field.get', paramsBasicTable,
                (res) => {
                    if (res.error()) {
                        resolve(null);
                    }
                    else {
                        if (id==null) {
                            let tmarray=[];
                            let ObjPropinArray=Object.keys(res.data()["PROPERTY_101"].DISPLAY_VALUES_FORM);
                            for(let i=0;i<ObjPropinArray.length;i++){
                                tmarray.push({
                                    id:ObjPropinArray[i],
                                    name: res.data()["PROPERTY_101"].DISPLAY_VALUES_FORM[ObjPropinArray[i]],
                                });
                            }
                            resolve(tmarray);
                        }
                        else resolve(res.data()["PROPERTY_101"].DISPLAY_VALUES_FORM[id]);
                    }
                });
        });
    }

    async function MakeBeautifulObject(uglyObj) {
        let PrettyObj=[];
        let CellsName=null;
        await new Promise((resolve,reject)=>{
            BX24.callMethod('lists.field.get', paramsBasicTable,
                (res) => {
                    if (res.error()) {
                        resolve(null);
                    }
                    else {
                        resolve(res.data());
                    }
                });
        }).then((res)=> CellsName=res );
        uglyObj.forEach(element => {
        var TMobj=new Object();
            for (let propName in CellsName){
            if (CellsName[propName].CODE!= null) 
              TMobj[CellsName[propName].CODE]=element[propName][Object.keys(element[propName]).shift()];
            }
            TMobj["ID"]=element.ID;
        PrettyObj.push(TMobj);      
        });
        return PrettyObj;
    }
    
    async function GetDataListMyWebstor(param) {
        return await new Promise((resolve, reject) => {
            BX24.callMethod('lists.element.get', param,
                (res) => {
                    if (res.error()) {
                        resolve(null);
                    }
                    else {
                        resolve(MakeBeautifulObject(res.data()));
                    }
                });
        });
    }
    async function DeleteConsuption(id){
        var param=Object.assign({},paramsBasicTable);
        Object.defineProperty(param,'ELEMENT_ID',{value: id, configurable: true, writable: true, enumerable: true})
        return await new Promise((resolve,reject)=>{
            BX24.callMethod('lists.element.delete',param,(result)=>
            {
                 if(result.error()){
                 console.log("Ошибка удаления");
                    reject("Ошибка");
                 }
                else
                resolve("Успешно!");
            })
            });    
    }
    async function SendUpdateConsuption(data,id){
        var param=Object.assign({},paramsBasicTable);
        var tmObj={
        "NAME":"null",
        'PROPERTY_101':data.type_consuption,
        'PROPERTY_105':data.plan_date,
        'PROPERTY_107':data.actual_date,
        'PROPERTY_109':data.total_consuption,
        'PROPERTY_111':"D_"+data.id_deal,
        'PROPERTY_113':data.id_contact,
        'PROPERTY_121':data.target_price,
        }
        Object.defineProperty(param,"FIELDS",{value: tmObj, configurable: true, writable: true, enumerable: true});
        Object.defineProperty(param,'ELEMENT_ID',{value: id, configurable: true, writable: true, enumerable: true});
        console.log(param);
        return await new Promise((resolve,reject)=>{
        BX24.callMethod('lists.element.update',param,(result)=>
        {
             if(result.error())
             reject({name:"Ошибка изменения расхода!",type:"error"});
            else
            resolve({name:"Расход успешно изменен!",type:"success"});
        })
        });
    }

    async function GetCurrentUser(){
     return await new Promise((resolve,reject)=>{BX24.callMethod('user.current', {}, function(res){
            resolve(res.data());
        })
      });
    }

    async function SendNewConsuption(data){
        var param=Object.assign({},paramsBasicTable);
        var tmObj={
        "NAME":"null",
        'PROPERTY_101':data.type_consuption,
        'PROPERTY_105':data.plan_date,
        'PROPERTY_107':data.actual_date,
        'PROPERTY_109':data.total_consuption,
        'PROPERTY_111':"D_"+data.id_deal,
        'PROPERTY_113':data.id_contact,
        'PROPERTY_121':data.target_price,
        }
        Object.defineProperty(param,"FIELDS",{value: tmObj, configurable: true, writable: true, enumerable: true});
        Object.defineProperty(param,'ELEMENT_CODE',{value: (new Date().toISOString()).replace(/[-:.]/g,""), configurable: true, writable: true, enumerable: true});
        console.log(param);
        return await new Promise((resolve,reject)=>{
        BX24.callMethod('lists.element.add',param,(result)=>
        {
             if(result.error())
             reject({name:"Ошибка добавления расхода!",type:"error"});
            else
            resolve({name:"Расход успешно добавлен!",type:"success"});
        })
        });
    }

    async function GetContacts(id=null){
    if (id==null) { 
        return await new Promise((resolve, reject) => {
        BX24.callMethod('user.get', {},
            (res) => {
                if (res.error()) {
                    resolve(null);
                }
                else {
                    resolve(res.data());
                }
            });
    });
    }
    else {
        return await new Promise((resolve, reject) => {
            BX24.callMethod('user.get', {"ID":id},
                (res) => {
                    if (res.error()) {
                        resolve(null);
                    }
                    else {
                        resolve(res.data().pop());
                    }
                });
        });
    }
    }

    async function GetDeals(id=null){
        if (id==null) { 
            return await new Promise((resolve, reject) => {
            BX24.callMethod('crm.deal.list', {},
                (res) => {
                    if (res.error()) {
                        resolve(null);
                    }
                    else {
                        resolve(res.data());
                    }
                });
        });
        }
        else {
            id=id.replace("D_","");
            return await new Promise((resolve, reject) => {
                BX24.callMethod('crm.deal.get', {"ID":id},
                    (res) => {
                        if (res.error()) {
                            resolve(null);
                        }
                        else {
                            resolve(res.data());
                        }
                    });
            });
        }
    }

export {GetDataListMyWebstor,GetContacts,GetDeals,GetListConsuption,SendNewConsuption,DeleteConsuption,SendUpdateConsuption,GetCurrentUser}

// function BXMyWebStoreList() {
//     let paramsBasicTable={
//         'IBLOCK_TYPE_ID': 'lists',
//         'IBLOCK_ID': '25'
//     };
//     this.changeBasicParam=(obj)=> paramsBasicTable=obj;

//     async function MakeBeautifulObject(uglyObj) {
//         let PrettyObj=[];
//         let CellsName=null;
//         await new Promise((resolve,reject)=>{
//             BX24.callMethod('lists.field.get', paramsBasicTable,
//                 (res) => {
//                     if (res.error()) {
//                         resolve(null);
//                     }
//                     else {
//                         resolve(res.data());
//                     }
//                 });
//         }).then((res)=> CellsName=res );
//         uglyObj.forEach(element => {
//         var TMobj=new Object();
//             for (let propName in CellsName){
//             if (CellsName[propName].CODE!= null) 
//               TMobj[CellsName[propName].CODE]=element[propName][Object.keys(element[propName]).shift()];
//             }
//             TMobj["ID"]=element.ID;
//         PrettyObj.push(TMobj);      
//         });
//         return PrettyObj;
//     }
    
//     this.GetDataListMyWebstor =async function GetDataListMyWebstor(param) {
//         return await new Promise((resolve, reject) => {
//             BX24.callMethod('lists.element.get', param,
//                 (res) => {
//                     if (res.error()) {
//                         resolve(null);
//                     }
//                     else {
//                         resolve(MakeBeautifulObject(res.data()));
//                     }
//                 });
//         });
//     }

//     this.GetContacts=async function GetContacts(id=null){
//     if (id==null) { 
//         return await new Promise((resolve, reject) => {
//         BX24.callMethod('crm.contact.list', {},
//             (res) => {
//                 if (res.error()) {
//                     resolve(null);
//                 }
//                 else {
//                     resolve(res.data());
//                 }
//             });
//     });
//     }
//     else {
//         id=id.replace("C_","");
//         return await new Promise((resolve, reject) => {
//             BX24.callMethod('crm.contact.get', {"ID":id},
//                 (res) => {
//                     if (res.error()) {
//                         resolve(null);
//                     }
//                     else {
//                         resolve(res.data());
//                     }
//                 });
//         });
//     }

    
//     }
// }

// let StoreBX=new BXMyWebStoreList();
// export {StoreBX}