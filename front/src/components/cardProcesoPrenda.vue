<template>
    <div>
        <b-card  v-if="render">
            <b-skeleton animation="throb" width="85%"></b-skeleton>
            <b-skeleton animation="throb" width="55%"></b-skeleton>
            <b-skeleton animation="throb" width="70%"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2" v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN'].includes(role))"></b-skeleton>
        </b-card>        
        <b-card :style="{ 'border-left': `solid 5px #0d6efd !important` }" v-else :title="data.nomCliente" :sub-title="data.prenda">
            <strong>{{ data.descripcionEstado }}</strong>
            <p>{{ date }}</p>
            Numero Orden {{ data.idOrdenLavado }}
            <br>
            <div class="badge bg-primary text-wrap float-end" >
                {{ data.nombrePaso }}
            </div>

            <strong class="fw-light">Cantidad: {{ data.cantidadPrendas }}</strong>
            <vs-button block flat primary @click="modalIniciar =! modalIniciar" > Iniciar </vs-button>
            <vs-dialog blur  v-model="modalIniciar">
                <template #header>
                    <h4 class="not-margin">
                        Iniciar <b>Proceso</b>
                    </h4>
                </template>

                <div class="con-form">
                    <strong class="fw-light">Cantidad total de prendas: {{ data.cantidadPrendas }}</strong>

                    <vs-input
                        class="mt-5"
                        v-model="cantidad"
                        label-placeholder="cantidad a ingresar"
                    />
                    <div class="con-selects" v-if="data.idTipoLavado">
                        <b-skeleton class="mt-3" type="input" v-if="lavadorasAll.length == 0"></b-skeleton>
                        <vs-select style="max-width:100%!important;"  class="mt-3" v-else success label-placeholder="Lavadora" color="success"  v-model="tipoLavadora" >
                            <vs-option  v-for="(lavadora, i) in lavadorasAll" :key="i" :label="lavadora.lavadora" :value="lavadora.idLavadora">
                                {{lavadora.lavadora}}  Max.: {{ lavadora.maxima }}  Min.: {{ lavadora.minima }}
                            </vs-option>
                        </vs-select>
                        
                    </div>
                    
                </div>
                <template #footer>
                    <div class="footer-dialog">
                        <vs-button block @click="iniciar()">
                            Iniciar
                        </vs-button>
                    </div>
                </template>
            </vs-dialog>
            <vs-button block flat success @click="modalShowDetail=!modalShowDetail"> Detalles </vs-button>
            <b-modal size="lg" centered v-model="modalShowDetail">
                <template #modal-header="{ close }">
                    <h5>Detalles </h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <template >
                    <b-card v-if="detail.length == 0">
                        <div class="d-flex flex-row bd-highlight mb-3">
                            <div class="p-2 bd-highlight">
                                <b-skeleton animation width="85%"></b-skeleton>
                            </div>
                        </div>
    
                        <b-skeleton type="input"></b-skeleton>
                        <br>
                        <b-skeleton type="input"></b-skeleton>
                        <br>
    
                        <b-row cols-sm="12" cols-md="6" cols-lg="4" class="mt-4">
                            <b-col>
                                <b-card>
                                    <b-skeleton animation width="85%"></b-skeleton>
                                    <b-skeleton animation width="55%"></b-skeleton>
                                    <b-skeleton animation width="70%"></b-skeleton>
                                </b-card>
                            </b-col>
                            <b-col>
                                <b-card>
                                    <b-skeleton animation width="85%"></b-skeleton>
                                    <b-skeleton animation width="55%"></b-skeleton>
                                    <b-skeleton animation width="70%"></b-skeleton>
                                </b-card>
                            </b-col>
                            <b-col>
                                <b-card>
                                    <b-skeleton animation width="85%"></b-skeleton>
                                    <b-skeleton animation width="55%"></b-skeleton>
                                    <b-skeleton animation width="70%"></b-skeleton>
                                </b-card>
                            </b-col>
                            
                            <b-col>
                                <b-card>
                                    <b-skeleton animation width="85%"></b-skeleton>
                                    <b-skeleton animation width="55%"></b-skeleton>
                                    <b-skeleton animation width="70%"></b-skeleton>
                                </b-card>
                            </b-col>
                        </b-row>
    
                    </b-card>
                    <div v-else>
                        <b-card>
                            <div class="d-flex flex-row bd-highlight mb-3">
                                <div class="p-2 bd-highlight">
                                    <h4 class="mt-2">{{ detail.cliente }}</h4>
                                    <strong>{{ detail.nombre }}</strong>
                                </div>
                            </div>
                            cantidad: <b>{{ detail.cantidadBolsa }}</b> <br>
                            tipo de lavado:<b> {{detail.proceso.nombre}} ({{ detail.proceso.codigo}})</b> 
                            <br>
                            <strong class="mt-5">Pasos:</strong>
                            <hr>
                            <b-row align-h="start">
                                <b-col class="mt-4" v-for="(paso, i) in detail.proceso.pasos" :key="i">
                                    <div class="d-flex flex-row bd-highlight mb-3">
                                        <div class="bd-highlight">
                                            <b-card :title="paso.nombre" :sub-title="paso.descripcion">
                                            </b-card>
                                        </div>
                                        <div v-if="detail.proceso.pasos.length != i+1" class="bd-highlight">
                                            <box-icon name='right-arrow-alt' animation='flashing' class="mt-5" size='lg' ></box-icon>
                                        </div>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-card>
                    </div>
                </template>
    
                <template #modal-footer="{ ok }">
                    <vs-button danger @click="ok()">
                            Salir
                    </vs-button>
                </template>
                
            </b-modal>
            
        </b-card>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import loginComponent from './cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"

export default {
    name:"CardProcesoPrendaComponent",
    props: {
        data: Object,
    },
    data: () => ({
        date: '',
        cantidad: '',
        motivoElim: '',
        cantidadElim: '',
        tipoLavadora: '',
        lavadorasAll: [],
        opciones: false,
        modalIniciar: false,
        cancelPredas: false,
        borderColor: '',

        
        detail: [],
        pasos: [],
        idPasos: [],  
        modalShowDetail: false,
        render: true,
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        loginComponent
    },
    mounted(){
        let fecha=new Date(this.data.fechaInicio);
        
        this.date = this.calcularTiempoTranscurrido(fecha);
        this.mostraLavadoras()
        
        setTimeout(() => {
            this.render = false
            this.mostrarDetailPrendas(this.data.idPrenda)
        }, 100)  
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        calcularTiempoTranscurrido(fechaInicial){
            const fechaActual = new Date();
            const diferencia = fechaActual - fechaInicial;

            if (diferencia < 0) {
                return "La fecha proporcionada es en el futuro.";
            }

            const segundos = Math.floor(diferencia / 1000);
            const minutos = Math.floor(segundos / 60);
            const horas = Math.floor(minutos / 60);
            const dias = Math.floor(horas / 24);
            const meses = Math.floor(dias / 30.44); // Promedio de días en un mes
            const años = Math.floor(meses / 12);

            if (años > 0) {
                return `${años} año${años > 1 ? 's' : ''}, ${meses % 12} m${meses % 12 > 1 ? 'es' : ''}, ${dias % 30} d${dias % 30 > 1 ? 's' : ''}, ${horas % 24} h${horas % 24 > 1 ? 's' : ''}, ${minutos % 60} min${minutos % 60 > 1 ? 's' : ''}, ${segundos % 60} seg${segundos % 60 > 1 ? 's' : ''}`;
            } else if (meses > 0) {
                return `${meses} m${meses > 1 ? 'es' : ''}, ${dias % 30} d${dias % 30 > 1 ? 's' : ''}, ${horas % 24} h${horas % 24 > 1 ? 's' : ''}, ${minutos % 60} min${minutos % 60 > 1 ? 's' : ''}, ${segundos % 60} seg${segundos % 60 > 1 ? 's' : ''}`;
            } else if (dias > 0) {
                return `${dias} d${dias > 1 ? 's' : ''}, ${horas % 24} h${horas % 24 > 1 ? 's' : ''}, ${minutos % 60} min${minutos % 60 > 1 ? 's' : ''}, ${segundos % 60} seg${segundos % 60 > 1 ? 's' : ''}`;
            } else if (horas > 0) {
                return `${horas} h${horas > 1 ? 's' : ''}, ${minutos % 60} min${minutos % 60 > 1 ? 's' : ''}, ${segundos % 60} seg${segundos % 60 > 1 ? 's' : ''}`;
            } else if (minutos > 0) {
                return `${minutos} min${minutos > 1 ? 's' : ''}, ${segundos % 60} seg${segundos % 60 > 1 ? 's' : ''}`;
            } else {
                return `${segundos} seg${segundos > 1 ? 's' : ''}`;
            }
        },
        async mostraLavadoras(){
            if(this.data.idTipoLavado){
                fetchApi(this.url+`lavadora/findByTipoLavado/${this.data.idTipoLavado}`, 'GET', this.$session.get('token'))
                // fetchApi(this.url+`lavadora/findByEstado/1`, 'GET', this.$session.get('token'))
                .then(data => {
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        data.datos.forEach(element => {
                            this.lavadorasAll.push({"idLavadora": element.idLavadora, "lavadora": element.nombreLvd, maxima: element.programasLavado[0].cantidadMaxima, minima: element.programasLavado[0].cantidadMinima})
                        });
                    }else{
                        this.lavadorasAll = [{"idLavadora": 0, "lavadora": 'Sin Lavadoras'}]
                    }
                })
            }else{
                this.lavadorasAll = [{"idLavadora": 0, "lavadora": 'Sin Lavadoras'}]
            }
        },
        async iniciar(){
            let token = this.$session.get('token')

            let json = {
                "idOrdenPrenda": this.data.idOrdenPrenda,
                "cantidad": this.cantidad,
                "idPasoProceso": this.data.idPaso,
                "idLavadora": this.tipoLavadora
            };
            let res = await fetch(this.url+"orden/proceso",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
                body: JSON.stringify(json)
            })
            let data = await res.json()

            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.refresh()
                this.modalIniciar = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha iniciado el proceso correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostrarDetailPrendas(this.data.idPrenda)
                this.$emit('updatePage', '200')

            }else{
                this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
        async mostrarDetailPrendas(id){
            this.detail = []
            if(id){
                fetchApi(this.url+`prenda/findById/${id}`, 'GET', this.$session.get('token'))
                .then(data => {
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        this.detail = data.datos
                    }
                })
            }
        },
        
        async updatePage(status){
            if(status == 200){
                this.mostrarDetailPrendas(this.data.idPrenda)
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
    min-height: 9rem; 
    min-width: 12rem;
}
input {
    width: 90%;
}
.vs-select .vs-select--state-null{
    max-width: 100% !important;
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