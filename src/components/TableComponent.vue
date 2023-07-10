<template>
<table class="table table-hover">
    <thead class="headTable">
        <tr>
            <th>ID</th>
            <th>тип расхода</th>
            <th>назначение платежа</th>
            <th>планируемая дата оплаты</th>
            <th>фактическая дата оплаты</th>
            <th>сумма расхода</th>
            <th>№ Сделки</th>
            <th>Ответственный</th>
            <th></th>
        </tr>
    </thead>
    <tbody class="align-middle text-center">

        <tr v-if="togle">
        <td colspan="9"><div class="d-flex justify-content-center">
                <div class="spinner-border inTbSpin" role="status">
                    <span class="sr-only"></span>
                </div>
            </div>
        </td>
        </tr>
        <tr v-else v-for="elem in SearchListItem">
        <RowComponent :dataRow="elem" :deleteRow="deleteConsuption" :updateRow="EditConsup"/>
        </tr>

    </tbody>
</table>
<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text date-input">Поиск</span>
  </div>
  <input type="text" class="form-control" aria-label="Small" v-model="searchIn" placeholder="Введите назначение платежа..." aria-describedby="inputGroup-sizing-sm">
  
  <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{TypeIn}}</button>
  <ul class="dropdown-menu dropdown-menu-end">
    <li class="dropdown-item" @click="TypeIn='Все'">Все</li>
    <li class="dropdown-item" v-for="elem in ListTypeConsaption" @click="TypeIn=elem.name">{{ elem.name }}</li>
  </ul>

   <button type="button"
     class="btn btn-outline-success" 
     data-bs-toggle="modal" 
     data-bs-target="#staticBackdrop">
        Добавить
    </button>

  
</div>
</template>
<script setup>
import { onMounted, ref, defineProps, computed} from 'vue';
import RowComponent from '../components/RowTableComponent.vue';
import {GetDataListMyWebstor,GetListConsuption,DeleteConsuption, GetDeals} from '../JScript/MyWebStorelist.js';

const TypeIn=ref("Все");
const ListTypeConsaption=ref(null);
const searchIn=ref("");
const togle=ref(true);
const ListBXimport=ref(null);

const SearchListItem=computed(()=>{
if (TypeIn.value=="Все") 
return ListBXimport.value.filter((value)=>value['NAZNACHENIE_PLATEZHA'].toLowerCase().includes(searchIn.value.toLowerCase()));
else
return ListBXimport.value.filter((value)=>value['NAZNACHENIE_PLATEZHA'].toLowerCase().includes(searchIn.value.toLowerCase()) && value['TIP_RASKHODA_NAME']==TypeIn.value);
});

onMounted(()=>{
myProps.updateComponentTable(updateComponent);
updateComponent();
});

function deleteConsuption(id){
DeleteConsuption(id).then((res)=>{
updateComponent();
});
}

function updateComponent(){
togle.value=true;
searchIn.value="";
GetDataListMyWebstor({'IBLOCK_TYPE_ID': 'lists','IBLOCK_ID': '25'}).then((result)=>{
//получить текущую сделку
var currentDeal=BX24.placement.info();
//currentDeal.options["ID"]=1;
//ЕСЛИ не удалось получить текущую сделку
if(!currentDeal.options.hasOwnProperty("ID")){
ListBXimport.value=result;
makeAnalytics(result);
}
//ЕСЛИ удалось получить текущую сделку 
else{
ListBXimport.value=result.filter((elementConsap)=>elementConsap.POLE_SVYAZ_SO_SDELKOY.replace("D_","")==currentDeal.options["ID"]);
makeAnalytics(result.filter((elementConsap)=>elementConsap.POLE_SVYAZ_SO_SDELKOY.replace("D_","")==currentDeal.options["ID"]),currentDeal.options["ID"]);
}
togle.value=!togle.value;    
});
}

async function makeAnalytics(result,deal=null){
    var dealTime=[];
    await GetDeals().then((res)=>
    res.forEach(elementdealinbx => {
    if (deal==null) dealTime.push({id:elementdealinbx.ID, TITLE:elementdealinbx.TITLE});
     else
    if (elementdealinbx.ID==deal) { 
    dealTime.push({id:elementdealinbx.ID, TITLE:elementdealinbx.TITLE});
    }
  }));
     
    await GetListConsuption().then((res)=>{ ListTypeConsaption.value=res; });

    dealTime.forEach(elementDeal => {
    var arrayTypeConsaption=JSON.parse(JSON.stringify(ListTypeConsaption.value));
    arrayTypeConsaption.forEach(elementTypeConsap => {
    elementTypeConsap.sum=result.reduce((sum,elemConsap)=>{
    if(elemConsap.POLE_SVYAZ_SO_SDELKOY.replace("D_","")==elementDeal.id && elemConsap.TIP_RASKHODA==elementTypeConsap.id)
     return sum+parseFloat(elemConsap.SUMMA_RASKHODA);
      else return sum;
    },0);
    });
    arrayTypeConsaption.push({
    name:"Общая Сумма",
    sum: result.reduce((sum,elemConsap)=>{if (elemConsap.POLE_SVYAZ_SO_SDELKOY.replace("D_","")==elementDeal.id) return sum+parseFloat(elemConsap.SUMMA_RASKHODA); else return sum},0),
    });
    Object.defineProperty(elementDeal,"consuption",{value:arrayTypeConsaption,configurable: true, writable: true, enumerable: true});
    });
    dealTime.push({
    TITLE:"Общая информация"
    });
    var arrayTypeConsaption=JSON.parse(JSON.stringify(ListTypeConsaption.value));
    arrayTypeConsaption.forEach(elementTypeConsap => {
    elementTypeConsap.sum=result.reduce((sum,elemConsap)=>{
    if(elemConsap.TIP_RASKHODA==elementTypeConsap.id)
     return sum+parseFloat(elemConsap.SUMMA_RASKHODA);
      else return sum;
    },0);
    });
    arrayTypeConsaption.push({
    name:"Общая Сумма",
    sum: result.reduce((sum,elemConsap)=>sum+parseFloat(elemConsap.SUMMA_RASKHODA),0),
    });
    Object.defineProperty(dealTime[dealTime.length-1],"consuption",{value:arrayTypeConsaption,configurable: true, writable: true, enumerable: true});
    myProps.getInfoAnalytics(dealTime);
}

const myProps = defineProps({getInfoAnalytics: Function, updateComponentTable: Function, EditConsup:Function})

</script>