<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5 container">
            <b-form-textarea
                id="text-area"
                placeholder="Querys"
                v-model="query"
                rows="8"
            ></b-form-textarea>
            <vs-button
                block
                size="large"
            >
                <box-icon name='play' color="#fff"></box-icon>
                Ejecutar
            </vs-button>

            <vs-alert class="mt-5" :color="color" v-if="resultado">
                <template #title>
                    {{ msg }}
                </template>
            </vs-alert>
        </b-container>
        <br>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import { refreshSession } from "@/service/service.js"

export default {
    data: () => ({
        query: '',
        resultado: false,
        msg : '',
        color: '',
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        this.resultado = true
        this.msg = "Sin datos, ingrese el codigo el codigo de barras"
        this.color = "danger"
        // this.getLogs()
    },
    methods: {
        
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        
        // async getLogs(){
        //     fetchApi(this.url+'utils/logs/ms-coeli-error-10-15-2023.log', 'GET', this.$session.get('token'))
        //     .then(data => {
        //         this.prendas = []
        //         if(data.status == 401){ this.activarReboot = true }
        //         if(data.status == 200){
        //             console.log(data)
        //         }
        //         this.refresh()
        //     })
        // },
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

