<template>
   <div class="container-fluid tb">
        <div class="row">
            <div class="col-2">
              <AnalyticsComponent :analytics="AnalyticsComponentValue" />
              <ModalFormComponent :updateComponentTable="updateComponentTableFunc" :editConsuption="editConsuptionParent"/>
            </div>
            <div class=" col-10 card">
              <TableComponent :updateComponentTable="updateComponentTable" :getInfoAnalytics="getInfoAnalytics" :EditConsup="editConsuptionFunc"/>
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
