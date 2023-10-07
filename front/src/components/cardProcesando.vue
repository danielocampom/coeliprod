<template>
    <div>
        <b-container class="bv-example-row">
            <b-card  v-if="render">
                <b-skeleton animation="throb" width="85%"></b-skeleton>
                <b-skeleton animation="throb" width="100%"></b-skeleton>
                <b-skeleton animation="throb" width="70%"></b-skeleton>
                <b-skeleton type="button" width="100%" class="mb-2"></b-skeleton>
                <b-skeleton type="button" width="100%"></b-skeleton>
            </b-card>        
            <b-card v-else :title="data.nomCliente+' '+data.prenda" :style="{ 'border-left': `solid 5px #0d6efd !important` }">
                <div class="badge bg-success text-wrap float-end" >
                    {{ data.estado }}
                </div>
                <p class="fw-light text-muted">id Orden {{ data.idOrden }}.</p>
                <p>{{ date }}</p>
                cantidad de prendas
                <div class="badge bg-success text-wrap float-end" >
                    {{ data.cantidad }}
                </div>
                <br>
                <br>
            </b-card>
            <div v-if="activarReboot">
                <loginComponent :login="activarReboot"></loginComponent>
            </div>
        </b-container>
    </div>
</template>

<script>
// import ConfirmComponent from '@/components/confirm.vue'
import loginComponent from './cardLogin.vue';
import { refreshSession } from "@/service/service.js"
import moment from 'moment';

export default {
    name:"ProcesandoComponent",
    props: {
        data: Object,
    },
    data: () => ({
        date: '',

        render: true,
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        // ConfirmComponent,
        loginComponent
    },
    mounted(){
        moment.locale('es');  
        let fechaIngreso = this.data.fechaAlta.split('T')
        let horaIngreso = fechaIngreso[1].split('.')[0]
        let fechaHora = fechaIngreso[0]+" "+horaIngreso
        this.date = moment(fechaHora).startOf('hour').fromNow()
        setTimeout(() => {
            this.render = false
        }, 1000)   
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
       
        async updatePage(status){
            if(status == 200){
                this.mostraActivos()
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

</style>
<style lang="stylus">
getColor(colorx, alpha = 1)
    unquote("rgba(var(--vs-"+colorx+"), "+alpha+")")
getVar(var)
    unquote("var(--vs-"+var+")")

.content-tooltip
  .body
    display flex
    align-items flex-start
    justify-content center
    .vs-avatar-content
      margin-top -30px
      border 3px solid getVar('theme-layout')
      box-shadow 0px 4px 15px 0px rgba(0,0,0,.1)
    .text
      display flex
      align-items center
      justify-content center
      flex-direction column
      font-size .55rem
      padding 10px
      font-weight normal
      span
        font-weight bold
        font-size .7rem
  footer
    display flex
    align-items center
    justify-content center
  h4
    padding 8px
    margin 0px
    text-align left
  p
    text-align left
    padding 0px
    margin 0px
    line-height 1rem
    padding-bottom 5px
    padding-left 8px
</style>