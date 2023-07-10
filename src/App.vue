<template>
   <div class="container-fluid tb"> 
    <ModalFormComponent :updateComponentTable="updateComponentTableFunc" :editConsuption="editConsuptionParent" />
        <div class="row mb-2">
            <div class="card">
              <TableComponent :updateComponentTable="updateComponentTable" :getInfoAnalytics="getInfoAnalytics" :EditConsup="editConsuptionFunc"/>
            </div>
        </div>
        <div class="row justify-content-end">
        
          <div class="col-4 p-0">
              <AnalyticsComponent :analytics="AnalyticsComponentValue" />
            </div>
        </div>
   </div>

   
</template>

<script setup>
const AnalyticsComponentValue=ref(null);
const updateComponentTableFunc=ref(null);
const editConsuptionFunc=ref(null);

function editConsuptionParent(func){
editConsuptionFunc.value=func;
}

function updateComponentTable(func){
updateComponentTableFunc.value=func;
}

function getInfoAnalytics(value){
AnalyticsComponentValue.value=value;
}

import TableComponent from './components/TableComponent.vue';
import AnalyticsComponent from './components/AnalyticsComponent.vue';
import ModalFormComponent from './components/ModalFormComponent.vue'
import { ref } from 'vue';
</script>
