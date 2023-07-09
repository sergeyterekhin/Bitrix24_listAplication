<template>
    <button type="button"
     class="btn btn-outline-success col-12" 
     data-bs-toggle="modal" 
     data-bs-target="#staticBackdrop">
        Добавить
    </button>

    <div 
    class="modal fade"
     id="staticBackdrop"
     data-bs-backdrop="static" 
     data-bs-keyboard="false" 
     tabindex="-1"        
     aria-labelledby="staticBackdropLabel" 
     aria-hidden="true">

        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5>Запланировать расход за «{{ consuption.form.target_price }}»</h5>
                    <button type="button" @click="ClearCons('all')" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <form @submit.prevent.stop="SendForm">
                <div class="modal-body">
                
                    <label class="form-label">{{ consuption.name_label.type_consuption }}</label>
                    <select class="form-select"
                    :class="{'is-invalid': consuption.error.type_consuption!=null}"
                    v-model="consuption.form.type_consuption"
                    >
                        <option 
                        selected 
                        disabled
                        :value=null
                        >Выберите...</option>
                        <option 
                        v-for="tcons in ListTypeConsuption" 
                        :value="tcons.id"
                        >{{ tcons.name }}</option>

                    </select>
                    <div class="invalid-feedback">{{ consuption.error.type_consuption }}</div>

                    <label class="form-label">{{ consuption.name_label.target_price }}</label>
                    <input 
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': consuption.error.target_price!=null}"
                    v-model="consuption.form.target_price"
                    >
                    <div class="invalid-feedback">{{ consuption.error.target_price }}</div>

                    <label class="form-label">{{ consuption.name_label.total_consuption }}</label>
                    <input 
                    type="number"
                    step="0.01"
                    class="form-control" 
                    :class="{'is-invalid': consuption.error.total_consuption!=null}"
                    v-model="consuption.form.total_consuption"
                    >
                    <div class="invalid-feedback">{{ consuption.error.total_consuption }}</div>

                    <div class=" container-fluid p-0">
                        <label>Дата оплаты:</label>
                        <div class="row date-input">
                            <div class="col">
                                <label class="form-label">{{ consuption.name_label.plan_date }}</label>
                                <input 
                                type="datetime-local"
                                class="form-control"
                                :class="{'is-invalid': consuption.error.plan_date!=null}"
                                v-model="consuption.form.plan_date" 
                                >
                                <div class="invalid-feedback">{{ consuption.error.plan_date }}</div>
                            </div>
                            

                            <div class="col">
                                <label class="form-label">{{ consuption.name_label.actual_date }}</label>
                                <input 
                                type="datetime-local"
                                class="form-control"
                                :class="{'is-invalid': consuption.error.actual_date!=null}"
                                v-model="consuption.form.actual_date"
                                >
                                <div class="invalid-feedback">{{ consuption.error.actual_date }}</div>
                            </div>
                        </div>
                    </div>

                    <label class="form-label">{{ consuption.name_label.id_deal }}</label>
                    <select 
                    class="form-select"
                    :class="{'is-invalid': consuption.error.id_deal!=null}" 
                    v-model="consuption.form.id_deal" 
                    >
                        <option selected disabled :value="null">Выберите...</option>
                        <option v-for="deal in ListDeal" :value="deal.ID">{{ deal.TITLE }}</option>
                    </select>
                    <div class="invalid-feedback">{{ consuption.error.id_deal }}</div>

                    <label class="form-label">{{ consuption.name_label.id_contact }}</label>
                    <select 
                    class="form-select" 
                    :class="{'is-invalid': consuption.error.id_contact!=null}"
                    v-model="consuption.form.id_contact" 
                    >
                        <option disabled :value="null">Выберите...</option>
                        <option 
                        v-for="contact in ListContact" 
                        :value="contact.ID"
                        >{{ contact.NAME +" "+contact.LAST_NAME}}</option>
                    </select>
                    <div class="invalid-feedback">{{ consuption.error.id_contact }}</div>
                
                </div>

                <div class="modal-footer">
                    <p 
                    v-if="globalStatus"
                    :class="{
                        'text-danger':globalStatus.type=='error',
                        'text-success': globalStatus.type=='success'
                    }"
                    >{{globalStatus.name}}</p>

                    <button type="button" class="btn btn-secondary" @click="ClearCons('all')" data-bs-dismiss="modal">Отмена</button>

                    <input type="submit" class="btn btn-success" 
                    value="Добавить"
                    v-if="!flagSend"
                    />

                    <div v-else class="spinner-grow" role="status">
                    <span class="sr-only"></span>
                    </div>

                </div>
            </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import {GetContacts, GetDeals,GetListConsuption,SendNewConsuption,SendUpdateConsuption} from '../JScript/MyWebStorelist.js';
const ListContact=ref({});
const ListDeal=ref({});
const ListTypeConsuption=ref({});
const flagSend=ref(false);
const globalStatus=ref();
const InEdit=ref(false);
const myProps=defineProps({
updateComponentTable:Function,
editConsuption: Function
});
const consuption=reactive({
form:{
type_consuption: null,
target_price: null,
plan_date:null,
actual_date: null,
total_consuption: null,
id_deal:null,
id_contact:null
},

error:{
type_consuption: null,
target_price: null,
plan_date:null,
actual_date: null,
total_consuption: null,
id_deal:null,
id_contact:null
},

name_label:{
type_consuption: "Тип расхода",
target_price: "Назначение платежа",
plan_date:"Планируемая",
actual_date: "Фактическая",
total_consuption: "Сумма расхода",
id_deal:"Сделка",
id_contact:"Ответственный"
}
});

const SendForm=()=>{
    ClearCons("error");
    if(checkValidate()){
    flagSend.value=true;
     if (InEdit.value===false){
        SendNewConsuption(consuption.form).then((success)=>{
            ClearCons();
            updateComponent();
            myProps.updateComponentTable();
            globalStatus.value=success;
            flagSend.value=false;
        },
        (error)=>{
            globalStatus.value=error;
            flagSend.value=false;
        });
     } else {
        SendUpdateConsuption(consuption.form,InEdit.value).then((success)=>{
            updateComponent();
            myProps.updateComponentTable();
            globalStatus.value=success;
            flagSend.value=false;
        },
        (error)=>{
            globalStatus.value=error;
            flagSend.value=false;
        });
    }
    };
}

function EditData(data){
InEdit.value=data.ID;
consuption.form.type_consuption= data.TIP_RASKHODA;
consuption.form.target_price= data.NAZNACHENIE_PLATEZHA;
var dtPLANIRUEMAYA=data.PLANIRUEMAYA_DATA_OPLATY.split(/[.: ]+/);
var dtFAKTICHESKAYA=data.FAKTICHESKAYA_DATA_OPLATY.split(/[.: ]+/);
consuption.form.plan_date=dtPLANIRUEMAYA[2]+"-"+dtPLANIRUEMAYA[1]+"-"+dtPLANIRUEMAYA[0]+"T"+dtPLANIRUEMAYA[3]+":"+dtPLANIRUEMAYA[4];
consuption.form.actual_date=dtFAKTICHESKAYA[2]+"-"+dtFAKTICHESKAYA[1]+"-"+dtFAKTICHESKAYA[0]+"T"+dtFAKTICHESKAYA[3]+":"+dtFAKTICHESKAYA[4];
consuption.form.total_consuption= data.SUMMA_RASKHODA;
consuption.form.id_deal=data.POLE_SVYAZ_SO_SDELKOY.replace("D_","");
consuption.form.id_contact=data.OTVETSTVENNYY.replace("C_","");
}

function checkValidate(){
    var flag=true;
    for(var key in consuption.form){
       if(consuption.form[key]==null || consuption.form.key==""){
        flag=false;
        consuption.error[key]="Поле "+consuption.name_label[key]+" не должно быть пустым. ";
       }
    }
    return flag; 
}

function ClearCons(typeClear="all"){
    switch (typeClear) {
        case "error":
        for(var key in consuption.error){
            consuption.error[key]=null;
        }  
        break;
        
        case "form":
        for(var key in consuption.form){
        consuption.form[key]=null;
        }  
        break;
        case "all":
        InEdit.value=false;
        for(var key in consuption.form){
        consuption.form[key]=null;
        consuption.error[key]=null;
        }  
        globalStatus.value=null;
        break;

        default:
        
        for(var key in consuption.form){
        consuption.form[key]=null;
        consuption.error[key]=null;
        }       
        break;
    }    
}

onMounted(()=>{
myProps.editConsuption(EditData);
updateComponent();
});

function updateComponent(){
GetContacts().then((res)=>{
ListContact.value=res;
});
GetDeals().then((res)=>{
    ListDeal.value=res;
});
GetListConsuption().then((res)=>{
ListTypeConsuption.value=res;
});
}

</script>