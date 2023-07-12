<template>
    <td>{{ dataRow.ID }}</td>
    <td>{{ dataRow.TIP_RASKHODA_NAME}}</td>
    <td>{{ dataRow.NAME }}</td>
    <td>{{ dataRow.PLANIRUEMAYA_DATA_OPLATY }}</td>
    <td>{{ dataRow.FAKTICHESKAYA_DATA_OPLATY }}</td>
    <td>{{ parseFloat(dataRow.SUMMA_RASKHODA).toFixed(2)}} ₽</td>
    <td>{{ dataRow.FULLNAME}}</td>
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
import {defineProps} from 'vue';
const myProps=defineProps({
  dataRow: Object, // получает данные от родителя
  deleteRow: Function,
  updateRow: Function
})
</script>