<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <template>
                <b-tabs content-class="mt-3" align="center" >
                    <b-tab title="Por Procesar" active @click="updatePage(200)">
                        <b-row>
                            <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(cons, i) in consultas" :key="i">
                                <CardProcesoPrendaComponent @updatePage="updatePage" :data="cons"></CardProcesoPrendaComponent>
                            </b-col>
                        </b-row>            
                        <vs-alert class="mt-5" v-if="sinData" shadow danger>
                            <template #title>
                                No se han encontrado datos
                            </template>
                        </vs-alert>
                    </b-tab>
                    <b-tab title="Procesando"  @click="updatePage(200)" >
                        <b-row>
                            <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(cp, i) in consultasProcesando" :key="i">
                                <CardProcesandoPrendaComponent v-if="cp.idEstado" @updatePage="updatePage" :data="cp"></CardProcesandoPrendaComponent>
                            </b-col>
                        </b-row>            
                        <vs-alert class="mt-5" v-if="sinDataProcesando" shadow danger>
                            <template #title>
                                No se han encontrado datos
                            </template>
                        </vs-alert>
                    </b-tab>
                </b-tabs>
            </template>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        
    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import CardProcesoPrendaComponent from '@/components/cardProcesoPrenda.vue';
import CardProcesandoPrendaComponent from '@/components/cardProcesandoPrenda.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    data: () => ({
        consultas: [],
        sinData: false,
        sinDataProcesando: false,
        consultasProcesando: [],
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        CardProcesoPrendaComponent,
        CardProcesandoPrendaComponent,
        HeaderComponent,
        loginComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    
        this.mostratConsultas()
        
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        async mostratConsultas(){
            this.consultas = []
            this.consultasProcesando = []
            fetchApi(this.url+'orden/consulta', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach( value => {
                        if(value.idEstado == null){
                            this.consultas.push(value)
                            this.sinData = false

                        }else{
                            this.consultasProcesando.push(value)
                            this.sinDataProcesando = false

                        }
                    })
                    if(this.consultas.length == 0 ){
                        this.sinData = true
                    }
                    if(this.consultasProcesando.length == 0 ){
                        this.sinDataProcesando = true
                    }
                }else{
                    if(this.consultas.length == 0 ){
                        this.sinData = true
                    }
                    if(this.consultasProcesando.length == 0 ){
                        this.sinDataProcesando = true
                    }
                    // this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
                
            })

           
        },
        updatePage(status){
            if(status == 200){
                this.mostratConsultas()
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

.vs-input{
    width: 100%;
}

#vs-input--1785{
    width: 100%;
}

</style>