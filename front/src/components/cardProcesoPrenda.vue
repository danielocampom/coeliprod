<template>
    <div>
        <b-card  v-if="render">
            <b-skeleton animation="throb" width="85%"></b-skeleton>
            <b-skeleton animation="throb" width="55%"></b-skeleton>
            <b-skeleton animation="throb" width="70%"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2" v-if="$session.get('roles') == 'SISTEMAS' || $session.get('roles') == 'ADMIN' "></b-skeleton>
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
                    <vs-input
                        class="mt-3"
                        v-model="cantidad"
                        label-placeholder="cantidad"
                    />
                    <div class="con-selects" v-if="data.idTipoLavado">
                        <b-skeleton class="mt-3" type="input" v-if="lavadorasAll.length == 0"></b-skeleton>
                        <vs-select style="max-width:100%!important;"  class="mt-3" v-else success label-placeholder="Lavadora" color="success"  v-model="tipoLavadora" >
                            <vs-option  v-for="(lavadora, i) in lavadorasAll" :key="i" :label="lavadora.lavadora" :value="lavadora.idLavadora">
                                {{lavadora.lavadora}}
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
                        <div v-for="(prenda, i) in detail" :key="i">
                            <hr v-if="i>0">
                            <b-card>
                                <div class="d-flex flex-row bd-highlight mb-3">
                                    <div class="p-2 bd-highlight">
                                        <h4 class="mt-2">{{ prenda.prenda.nombre }}</h4>
                                    </div>
                                </div>
                                cantidad: <b>{{ prenda.cantidad }}</b> <br>
                                tipo de lavado:<b> {{prenda.detalle.nombre}} ({{ prenda.detalle.codigo }})</b> 
                                <br>
                                <strong class="mt-5">Pasos:</strong>
                                <hr>
                                <b-row align-h="start">
                                    <b-col class="mt-4" v-for="(paso, i) in prenda.detalle.pasos" :key="i">
                                        <div class="d-flex flex-row bd-highlight mb-3">
                                            <div class="bd-highlight">
                                                <b-card :title="paso.nombre" :sub-title="paso.descripcion">
                                                </b-card>
                                            </div>
                                            <div v-if="prenda.detalle.pasos.length != i+1" class="bd-highlight">
                                                <box-icon name='right-arrow-alt' animation='flashing' class="mt-5" size='lg' ></box-icon>
                                            </div>
                                        </div>
                                    </b-col>
                                </b-row>
                            </b-card>
                        </div>
                    </div>
                </template>
    
                <template #modal-footer="{ ok }">
                    <vs-button danger @click="ok()">
                            Salir
                    </vs-button>
                </template>
                
            </b-modal>
            <vs-button v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN'].includes(role))" block flat danger @click="cancelPredas = !cancelPredas"> Cancelar Prenda </vs-button>
            <vs-dialog blur v-model="cancelPredas">
                <template #header>
                    <h4 class="not-margin">
                        Eliminar <b>{{data.prenda}}</b>
                    </h4>
                </template>
                <div class="con-form">
                    <p>Cantidad <b>{{ data.cantidadPrendas }}</b></p>
                    <template>
                        <div class="mt-2 center content-inputs">
                            <vs-input danger type="text" v-model="motivoElim" label-placeholder="Describe el motivo">
                                <template #icon>
                                    <box-icon name='rename'></box-icon>
                                </template>
                            </vs-input>
                        </div>
                        <div class="mt-2 center content-inputs">
                            <vs-input danger type="number" v-model="cantidadElim" label-placeholder="Digita una cantidad">
                                <template #icon>
                                    <box-icon name='dialpad-alt' ></box-icon>
                                </template>
                            </vs-input>
                        </div>
                    </template>
                </div>

                <template #footer>
                    <div class="con-footer mt-4">
                        <vs-button danger
                            block
                            flat
                            @click="comfirm=!comfirm">
                            Eliminar
                        </vs-button>
                    </div>
                </template>
            </vs-dialog>
        </b-card>
        <vs-dialog v-model="comfirm">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Eliminar las prendas?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="cancelPrednas"/>
        </vs-dialog>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import ConfirmComponent from '@/components/confirm.vue'
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
        comfirm: false,
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
        ConfirmComponent,
        loginComponent
    },
    mounted(){
        let fecha=new Date(this.data.fechaIngreso);
        
        this.date = this.calcularTiempoTranscurrido(fecha);
        // console.log(fechaHora)
        this.mostraLavadoras()
        setTimeout(() => {
            this.render = false
            this.mostrarDetailPrendas(this.data.idPrenda, this.data.cantidadPrendas)
        }, 1000)  
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
            fetchApi(this.url+`lavadora/findByTipoLavado/${this.data.idTipoLavado}`, 'GET', this.$session.get('token'))
            // fetchApi(this.url+`lavadora/findByEstado/1`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach(element => {
                        this.lavadorasAll.push({"idLavadora": element.idLavadora, "lavadora": element.nombreLvd})
                    });
                }else{
                    this.lavadorasAll = [{"idLavadora": 0, "lavadora": 'Sin Lavadoras'}]
                }
            })
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
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha iniciado el proceso correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostrarDetailPrendas(this.data.idPrenda, this.data.cantidadPrendas)
                this.$emit('updatePage', '200')

            }else{
                this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
        async mostrarDetailPrendas(id, cantidad){
            this.detail = []
            if(id){
                fetchApi(this.url+`prenda/findById/${id}`, 'GET', this.$session.get('token'))
                .then(data => {
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        let t = this
                        fetchApi(this.url+`proceso/findById/${data.datos.proceso}`, 'GET', this.$session.get('token'))
                        .then(dt => {
                            if(dt.status == 200){
                                t.detail.push({"prenda": data.datos, "detalle": dt.datos,"id": id, cantidad:cantidad})
                                dt.datos.pasos.forEach( data => this.idPasos.push(data.id))
                            }
                        })
                    }
                })
            }
        },
        async cancelPrednas(status){
            if(status == 200){
                let token = this.$session.get('token')

                let prenEliminadas = parseInt(this.data.cantidadPrendas)-parseInt(this.cantidadElim)

                if(prenEliminadas < 0){
                    this.openNotification( `No puedes Eliminar mas prendas de la cantidad asignada `, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

                }else{
                    let json = {
                        "mensaje": this.motivoElim,
                        "nuevaCantidad": prenEliminadas,
                        "idOrdenPrenda": this.data.idOrdenPrenda
                    };
                    
    
                    let res = await fetch(this.url+"orden/cancela",{
                        method: "PUT",
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
                        this.comfirm = false
                        this.cancelPredas = false
                        this.openNotification(`Exito: ${data.mensaje}`, `Se han Eliminado Exitosamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                        this.$emit('updatePage', '200')
                    }else{
                        this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

                    }
                }
            }
        },
        async updatePage(status){
            if(status == 200){
                this.mostrarDetailPrendas(this.data.idPrenda, this.data.cantidadPrendas)
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