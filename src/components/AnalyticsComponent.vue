<template>
<div class="card mb-3 analytic">
    <div v-if="!analytics" class="card-body pb-0">
        <div class="d-flex justify-content-center m-5">
                <div class="spinner-border" role="status">
                    <span class="sr-only"></span>
                </div>
            </div>
    </div>   
    <div v-else class="card-body pb-0">
     <h6 class="card-title text-center" >Общая информация</h6>
     <ul class="list-group list-group-flush">
    <li v-for="elementConsaptionAnalytics in analytics" class="list-group-item">
        {{elementConsaptionAnalytics.name}}: {{parseFloat(elementConsaptionAnalytics.sum).toFixed(2)}} ₽</li>
    </ul>    
        <!-- <small
        class="d-inline-flex px-2 py-1 mr-5 text-success-emphasis bg-success-subtle border border-success-subtle rounded-2"
        v-for="elementConsaptionAnalytics in elementAnalytics.consuption"
        >{{elementConsaptionAnalytics.name}}:{{elementConsaptionAnalytics.sum}}</small> -->
</div>
</div>
</template>

<script setup>
defineProps({analytics: Object})
</script>