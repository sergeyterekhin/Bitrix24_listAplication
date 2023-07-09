<template>
    <td>{{ dataRow.ID }}</td>
    <td v-if="dataRow.TIP_RASKHODA_NAME">{{ dataRow.TIP_RASKHODA_NAME}}</td>
    <td v-else><div class="spinner-grow spinner-grow-sm" role="status"><span class="visually-hidden"></span></div></td>
    <td>{{ dataRow.NAZNACHENIE_PLATEZHA }}</td>
    <td>{{ dataRow.PLANIRUEMAYA_DATA_OPLATY }}</td>
    <td>{{ dataRow.FAKTICHESKAYA_DATA_OPLATY }}</td>
    <td>{{ parseFloat(dataRow.SUMMA_RASKHODA).toFixed(2)}} ₽</td>
    <td v-if="dataRow.DealTitle">{{ dataRow.DealTitle}}</td>
    <td v-else><div class="spinner-grow spinner-grow-sm" role="status"><span class="visually-hidden"></span></div></td>
    <td v-if="dataRow.ContactFullName">{{ dataRow.ContactFullName}}</td>
    <td v-else><div class="spinner-grow spinner-grow-sm" role="status"><span class="visually-hidden"></span></div></td>
    <td class="text-center">
        <div class=" btn-group">
            <button
            type="button"
            @click="deleteRow(dataRow.ID)"
            class="btn btn-secondary btn-sm">
            <img class="text-white" src="../../public/trash3.svg" />
            </button>
            <button 
            type="button"
            class="btn btn-secondary btn-sm"
            data-bs-toggle="modal" 
            data-bs-target="#staticBackdrop"
            @click="updateRow(dataRow)">
            <img src="../../public/pencil-square.svg" />
        </button>
        </div>
    </td>
</template>

<script setup>
import {defineProps, onMounted} from 'vue';
import {GetContacts, GetDeals,GetListConsuption} from '../JScript/MyWebStorelist.js';
onMounted(()=>{
   GetContacts(myProps.dataRow.OTVETSTVENNYY).then((res)=>{
    myProps.dataRow.ContactFullName=res.NAME+" "+res.LAST_NAME;
    });
    GetDeals(myProps.dataRow.POLE_SVYAZ_SO_SDELKOY).then((res)=>{
    myProps.dataRow.DealTitle=res.TITLE;
    });
    GetListConsuption(myProps.dataRow.TIP_RASKHODA).then((res)=>{
    myProps.dataRow.TIP_RASKHODA_NAME=res;
    });
});


const myProps=defineProps({
  dataRow: Object, // получает данные от родителя
  deleteRow: Function,
  updateRow: Function
})
</script>