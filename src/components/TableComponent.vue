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
  
  <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{ContactIn}}</button>
  <ul class="dropdown-menu dropdown-menu-end">
    <li class="dropdown-item" @click="ContactIn='Все'">Все</li>
    <li class="dropdown-item" v-for="elem in ListTypeContact" @click="ContactIn=elem.NAME + ' ' + elem.LAST_NAME">{{ elem.NAME + " " + elem.LAST_NAME}}</li>
  </ul>

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
import {GetDataListMyWebstor,GetListConsuption,DeleteConsuption, GetContacts} from '../JScript/MyWebStorelist.js';

const TypeIn=ref("Все");
const ListTypeConsaption=ref([]);

const ContactIn=ref("Все");
const ListTypeContact=ref([]);

const searchIn=ref("");
const togle=ref(true);
const ListBXimport=ref([]);

const SearchListItem=computed(()=>{
var TimeList=ListBXimport.value.filter((value)=>value['NAME'].toLowerCase().includes(searchIn.value.toLowerCase()));
if (TypeIn.value!="Все") TimeList=TimeList.filter((value)=>value['TIP_RASKHODA_NAME']==TypeIn.value);
if (ContactIn.value!="Все") TimeList=TimeList.filter((value)=>value['FULLNAME']==ContactIn.value);
  return TimeList;  
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
  GetDataListMyWebstor({'IBLOCK_TYPE_ID': 'lists','IBLOCK_ID': '25'}).then((resultConsaptions)=>{
    var currentDeal=BX24.placement.info(); // получить текущую сделку
    //currentDeal.options["ID"]=15; // временное объявление сделки 
    if(currentDeal.options.hasOwnProperty("ID")) // если удалось определить сделку, то отфильтровать расходы по сделке
      resultConsaptions=resultConsaptions.filter((elementConsap)=> elementConsap.POLE_SVYAZ_SO_SDELKOY.replace("D_","")==currentDeal.options["ID"] ); 
    //получить ответственного
    GetContacts().then((resultContacts)=>{
      resultConsaptions.forEach(OneConsaption => { // перебираем расходы     
        resultContacts.forEach(OneContact => { // перебираем ответственных
        if(OneConsaption['OTVETSTVENNYY']==OneContact['ID']) // если нашел, то создать свойство fullname у расхода
           Object.defineProperty(OneConsaption,'FULLNAME',{
           value: OneContact['NAME'] +" "+OneContact['LAST_NAME'],
           configurable: true, 
           writable: true, 
          enumerable: true });
        });
        //получить тип расхода
        GetListConsuption().then((resultTypeConsaptions)=>{
          resultConsaptions.forEach(OneConsaption =>{ //перебираем расходы
            resultTypeConsaptions.forEach(TypeConsaption => { // перебираем типы расходов
            if(OneConsaption['TIP_RASKHODA']==TypeConsaption['id']) // если нашел тип расхода по его id создать свойтсво TIP_RASKHODA_NAME
              Object.defineProperty(OneConsaption,'TIP_RASKHODA_NAME',{
              value: TypeConsaption['name'],
              configurable: true, 
              writable: true, 
              enumerable: true });
            });
          });
          makeAnalytics(resultConsaptions,resultTypeConsaptions);
          ListBXimport.value=resultConsaptions;
          ListTypeConsaption.value=resultTypeConsaptions;
          ListTypeContact.value=resultContacts;
          togle.value=false;
        });
      }); 
    });
    if(resultConsaptions.length==0) {
      togle.value=false;
      makeAnalytics([],[]);
    }
  });
}

function makeAnalytics(data,TypesConspaptions){
  var AnalaticsState=[];
  var allsum=0;
  TypesConspaptions.forEach(OneTypeConspation=>{
    var sum=data.reduce((sum,OneConsaption)=>{
      if (OneConsaption['TIP_RASKHODA']==OneTypeConspation['id'])
        return sum+parseFloat(OneConsaption['SUMMA_RASKHODA'])
        else
        return sum;
    },0);
    AnalaticsState.push({
    name: OneTypeConspation['name'],
    sum: sum,
    });
    allsum+=sum;
  });
  AnalaticsState.push({name: "Всего", sum: allsum});
  myProps.getInfoAnalytics(AnalaticsState);
}

// async function makeAnalytics2(result,deal=null){
//     var dealTime=[];
//     await GetDeals().then((res)=>
//     res.forEach(elementdealinbx => {
//     if (deal==null) dealTime.push({id:elementdealinbx.ID, TITLE:elementdealinbx.TITLE});
//      else
//     if (elementdealinbx.ID==deal) { 
//     dealTime.push({id:elementdealinbx.ID, TITLE:elementdealinbx.TITLE});
//     }
//   }));
     
//     await GetListConsuption().then((res)=>{ ListTypeConsaption.value=res; });

//     dealTime.forEach(elementDeal => {
//     var arrayTypeConsaption=JSON.parse(JSON.stringify(ListTypeConsaption.value));
//     arrayTypeConsaption.forEach(elementTypeConsap => {
//     elementTypeConsap.sum=result.reduce((sum,elemConsap)=>{
//     if(elemConsap.POLE_SVYAZ_SO_SDELKOY.replace("D_","")==elementDeal.id && elemConsap.TIP_RASKHODA==elementTypeConsap.id)
//      return sum+parseFloat(elemConsap.SUMMA_RASKHODA);
//       else return sum;
//     },0);
//     });
//     arrayTypeConsaption.push({
//     name:"Общая Сумма",
//     sum: result.reduce((sum,elemConsap)=>{if (elemConsap.POLE_SVYAZ_SO_SDELKOY.replace("D_","")==elementDeal.id) return sum+parseFloat(elemConsap.SUMMA_RASKHODA); else return sum},0),
//     });
//     Object.defineProperty(elementDeal,"consuption",{value:arrayTypeConsaption,configurable: true, writable: true, enumerable: true});
//     });
//     dealTime.push({
//     TITLE:"Общая информация"
//     });
//     var arrayTypeConsaption=JSON.parse(JSON.stringify(ListTypeConsaption.value));
//     arrayTypeConsaption.forEach(elementTypeConsap => {
//     elementTypeConsap.sum=result.reduce((sum,elemConsap)=>{
//     if(elemConsap.TIP_RASKHODA==elementTypeConsap.id)
//      return sum+parseFloat(elemConsap.SUMMA_RASKHODA);
//       else return sum;
//     },0);
//     });
//     arrayTypeConsaption.push({
//     name:"Общая Сумма",
//     sum: result.reduce((sum,elemConsap)=>sum+parseFloat(elemConsap.SUMMA_RASKHODA),0),
//     });
//     Object.defineProperty(dealTime[dealTime.length-1],"consuption",{value:arrayTypeConsaption,configurable: true, writable: true, enumerable: true});
//     myProps.getInfoAnalytics(dealTime);
// }

const myProps = defineProps({getInfoAnalytics: Function, updateComponentTable: Function, EditConsup:Function})

</script>