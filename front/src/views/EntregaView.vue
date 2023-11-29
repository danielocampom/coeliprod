<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <template>
                <div style="max-width: 350px;" class="mx-auto p-1">
                    <vs-switch class="mt-3" v-model="buscar" @click="mostrarAct()">
                        <template #off>
                            <box-icon name='check'></box-icon> Ordenes Concluidas
                        </template>
                        <template #on>
                            <box-icon name='x' color="#fff"></box-icon> Prendas Concluidas
                        </template>
                    </vs-switch>
                </div>
                <b-row v-if="procesando">
                    <vs-alert class="mt-5" v-if="!mostraProcesos" shadow danger>
                        <template #title>
                            No se han encontrado datos
                        </template>
                    </vs-alert>
                    <b-col  class="mt-4" lg="3" md="4" sm="6" v-for="(dt, i) in getDatos[1]" :key="i">
                        <ProcesandoComponent @updatePage="updatePage" :data="{data:dt}"></ProcesandoComponent>
                    </b-col>
                </b-row>
                <b-row v-else>
                    <vs-alert class="mt-5" v-if="!mostraEntregas" shadow danger>
                        <template #title>
                            No se han encontrado datos
                        </template>
                    </vs-alert>
                    <b-col  class="mt-4" lg="3" md="4" sm="6" v-for="(dt, i) in getDatos[0]" :key="i">
                        <EntregasComponent @updatePage="updatePage" :data="{dt}"></EntregasComponent>
                        <!-- <EntregasComponent @updatePage="updatePage" :data="{idOrden: dt.idOrden, idCliente: dt.idCliente, nombreEstado: dt.nombreEstado, prendas: dt.prendas, idOrdenPrena: dt.idOrdenPrena, fechaEntrega:dt.fechaEntrega}"></EntregasComponent> -->
                    </b-col>
                </b-row>
                
            </template>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        
    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
// import CardAsignacionPrendaComponent from '@/components/cardAsignacionPrenda.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';
import EntregasComponent from '@/components/cardEntrega.vue';
import ProcesandoComponent from '@/components/cardProcesando.vue';


export default {
    name:"EntregaView",
    data: () => ({
        getDatos: [],
        procesando: false,
        mostraEntregas: false,
        mostraProcesos: false,
        buscar: false,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        loginComponent,
        EntregasComponent,
        ProcesandoComponent
        // CardAsignacionPrendaComponent,

    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    
        this.mostraPrendas()
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        mostrarAct(){
            if(!this.procesando){
                this.procesando = true
            }else{
                this.procesando = false
            }
            this.mostraPrendas()
        },
        async mostraPrendas(){
            this.getDatos = []
            fetchApi(this.url+`orden/terminados`, 'GET', this.$session.get('token'))
            .then(data => {
                
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    if(data.datos.length != 0){
                        data.datos.forEach( value => {
                           this.getDatos.push(value) 
                        })
                    }
                }else{
                    this.getDatos[0] = []
                    this.getDatos[1] = []
                    // this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
                if(this.getDatos[1].length){
                    this.mostraProcesos = true
                }
                
                if(this.getDatos[0].length){
                    this.mostraEntregas = true
                }

            })
            .catch(err => console.log(err))
        },
           
        updatePage(status){
            if(status == 200){
                this.mostraPrendas()
            }
        },
        openNotification( title, text, color, position = null, icon) {
          this.$vs.notification({
            progress: 'auto',
            icon,
            color,
            position,
            title: title,
            text: text
          })
        }
    }
}
</script>
<style>
body {
    font-family: "Poppins", sans-serif;
    height: 100vh;
    background: #f1f1f1 !important;
}
#modal-xl{
    margin-top: 5rem;
}
.card{
    border-radius: 1rem;
}
input {
    width: 100%;
}
.ml-5 .vs-card{
    margin-left: auto!important
}

.vs-card{
    padding: 0.5rem;
}
.vs-component--primary{
    /* height: 2rem !important; */
    /* background: radial-gradient(#939393, transparent); */
}
.vs-switch__circle{
    height: 1.5rem;
    width: 1.5rem;
}
</style>