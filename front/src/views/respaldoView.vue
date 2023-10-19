<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-3">
            <template>
                <b-row  class="mt-5">
                    <b-col lg="4" md="6" sm="12">
                        <b-card  style="max-width: 400px;" class="mb-4 mx-auto" >
                            <b-row class="mt-1">
                                <b-col lg="8" md="8" sm="12"  class="p-1">
                                    <vs-input state="dark" @keyup="searchWasher()" dark v-model="buscarTxt" label-placeholder="Buscar Lavadora">
                                        <template #icon>
                                            <box-icon name='wind' dark></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col lg="4" md="4" sm="12"  class="p-1">
                                    <vs-button
                                        primary 
                                        flat
                                        block 
                                        :active="btnBuscar == 1"
                                        @click="searchWasher()"
                                    >
                                        <box-icon name='search-alt-2' color="#195bff"></box-icon> Buscar
                                    </vs-button>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                    <b-col lg="4" md="6" sm="12">
                        <b-card style="max-width: 400px;" class="mb-4 mx-auto" >
                            <b-row class="mt-1">
                                <b-col lg="6" md="6" sm="12" class="p-1"> 
                                    <modalListCapacidades></modalListCapacidades>
                                </b-col>
                                <b-col lg="6" md="6" sm="12" class="p-1">
                                    <vs-button flat block icon @click="activeModalAddLavado=!activeModalAddLavado">
                                        <box-icon name='clipboard' color="#195bff" ></box-icon> Agregar Capacidades 
                                    </vs-button>
                                    <vs-dialog v-model="activeModalAddLavado">
                                        <template #header>
                                        <h4 class="not-margin">
                                            Registrar <b>Capacidad</b>
                                        </h4>
                                        </template>
                            
                                        <div class="con-form">
                                            <vs-input success class="mt-3" type="text" v-model="nomLavado" label-placeholder="nombre">
                                                <template #icon>
                                                    <box-icon name='rename'></box-icon>
                                                </template>
                                            </vs-input>
                                            <vs-input success class="mt-3" type="text" v-model="desLavado" label-placeholder="descripcion">
                                                <template #icon>
                                                    <box-icon name='rename'></box-icon>
                                                </template>
                                            </vs-input>
    
                                            <vs-input success class="mt-3" type="text" v-model="canMin" label-placeholder="Cantidad Minima">
                                                <template #icon>
                                                    <box-icon name='dialpad-alt' ></box-icon>
                                                </template>
                                            </vs-input>
                                            <vs-input success class="mt-3" type="text" v-model="canMax" label-placeholder="Cantidad Maxima">
                                                <template #icon>
                                                    <box-icon name='dialpad-alt' ></box-icon>
                                                </template>
                                            </vs-input>
                                        </div>
                                        <br>
                                        <template #footer>
                                            <div class="footer-dialog">
                                                <vs-button block success
                                                    flat
                                                    :btnGuardar="btnGuardar == 1"
                                                    @click="addCapacidad()">
                                                    Guardar
                                                </vs-button>
                                            </div>
                                        </template>
                                    </vs-dialog>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                    <b-col lg="4" md="6" sm="12">
                        <b-card style="max-width: 400px;" class="mb-4 mx-auto">
                            <b-row class="mt-1">
                                <b-col lg="6" md="6" sm="12" class="p-1">
                                    <vs-switch class="mt-3" v-model="buscarAct" @click="mostrarActInact()">
                                        <template #off>
                                            <box-icon name='check'></box-icon> Activos
                                        </template>
                                        <template #on>
                                            <box-icon name='x' color="#fff"></box-icon> Inactivos
                                        </template>
                                    </vs-switch>
                                </b-col>
                                <b-col lg="6" md="6" sm="12" class="p-1">
                                    <vs-button flat block icon @click="activeModal=!activeModal">
                                        <box-icon name='wind' color="#195bff" ></box-icon> Agregar Lavadora
                                    </vs-button>
                                    
                                    <b-modal size="xl" centered v-model="activeModal">
                                        <template #modal-header="{ close }">
                                            <h5>Agregar Lavadora</h5>
                                            <vs-button circle icon floating danger @click="close()">
                                                <box-icon name='x' color="#fff"></box-icon>
                                            </vs-button>
                                        </template>
                                        <template>
                                            <div class="con-form">
                                                <b-card>
                                                    <b-row>
                                                        <b-col class="mt-4" lg="6" md="6" sm="12">
                                                            <vs-input success type="text" v-model="nombreLav" placeholder="Lavadora">
                                                                <template #icon>
                                                                    <box-icon name='wind'></box-icon>
                                                                </template>
                                                            </vs-input>
                                                        </b-col>
                                                        <b-col class="mt-5" lg="6" md="6" sm="12">
                                                            <div class="con-selects">
                                                                <vs-select placeholder="Tipo de Lavado" color="success"  v-model="tipoLavado" >
                                                                    <vs-option  v-for="(lavado, i) in tiposLavado" :key="i" :label="lavado.nombre" :value="lavado.id">
                                                                        {{lavado.nombre}}
                                                                    </vs-option>
                                                                </vs-select>
                                                            </div>
                                                        </b-col>
                                                    </b-row>
                                                </b-card>
                                                <b-row>
                                                    <b-col class="mt-4" lg="8" md="6" sm="12">
                                                        <b-card title="Capacidades" sub-title="puedes seleccionar multiples capacidades">
                                                            <b-row>
                                                                <b-col class="mt-2" lg="8" md="8" sm="10">
                                                                    <vs-select placeholder="Tipo de Lavado" color="success"  v-model="progLavado" >
                                                                        <vs-option  v-for="(it, i) in capacidades" :key="i" :label="it.nombre" :value="it.id">
                                                                            {{it.nombre}}
                                                                        </vs-option>
                                                                    </vs-select>
                                                                </b-col>
                                                                <b-col class="mt-2" lg="4" md="4" sm="2">
                                                                    <vs-button class="float-right" circle icon floating @click="add(progLavado)">
                                                                        <box-icon name='plus' color='#fbfbfb' ></box-icon>
                                                                    </vs-button>
                                                                </b-col>
                                                            </b-row>
                                                        </b-card>
                                                    </b-col>
                                                    <b-col class="mt-2" lg="4" md="6" sm="12" v-for="(pl, i) in programasLavado" :key="i">
                                                        <b-card :title="pl.nombre">
                                                            <b-list-group>
                                                                <b-list-group-item>Descipción: {{ pl.descripcion }}</b-list-group-item>
                                                                <b-list-group-item>Capacidad Minima: {{ pl.cantidadMinima }}</b-list-group-item>
                                                                <b-list-group-item>Capacidad Maxima: {{ pl.cantidadMaxima }}</b-list-group-item>
                                                                <vs-button
                                                                        danger
                                                                        size="small"
                                                                        @click="elim(pl.id)"
                                                                    >
                                                                        <box-icon name='trash' color="#FFF"></box-icon> Eliminar
                                                                </vs-button>
                                                            </b-list-group>
                                                        </b-card>
                                                    </b-col>
                                                </b-row>
                                            </div>
                                        </template>
                            
                                        <template #modal-footer="{ ok }">
                                            <vs-button primary @click="addWasher()">
                                                <box-icon name='save' color="#fff"></box-icon> Guardar
                                            </vs-button>
                                            <vs-button danger @click="ok()">
                                                <box-icon name='exit' color="#fff"></box-icon> Salir
                                            </vs-button>
                                        </template>
                                        
                                    </b-modal>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                </b-row>
            </template>
        </b-container>
        <br>
        <b-container class="bv-example-row">
            <b-row>
                <b-col class="mt-4" lg="3" md="6" sm="12" v-for="(lavadora, i) in lavadoras" :key="i">
                    <CardLavadoraComponent @updatePage="updatePage" :dataWasher="{nombre: lavadora.lavadora, estado: lavadora.idEstado, clave: lavadora.tipoLavado, id: lavadora.idLavadora, capacidad: lavadora.capacidad, programas: lavadora.programasLavado}" />
                </b-col>
            </b-row>
            <vs-alert v-if="sinData" shadow danger>
                <template #title>
                    No se han encontrado coincidencias
                </template>
            </vs-alert>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
         
    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import CardLavadoraComponent from '@/components/cardLavadora.vue'
import modalListCapacidades from '@/components/modal_List_Capacidades.vue'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    name:"RespaldoView",
    data: () => ({
        capacidades: [],
       
        lavadoras: [],
        programasLavado: [],
        contador: 0,
        tiposLavado: [],
        sinData: false,
        activeModal: false,
        activeModalAddLavado: false,
        nombreLav: '',
        tipoLavado: '',
        progLavado: '',
        nomLavado: '',
        desLavado: '',
        canMax: '',
        canMin: '',
        btnGuardar: 0,
        buscarAct: false,
        buscarTxt: '',
        btnBuscar: 0,
        hidden: true,

        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        CardLavadoraComponent,
        modalListCapacidades,
        loginComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){   
        this.mostraActivos()
        this.mostraTipoLavado()
        this.mostrarTodosLavados()
    
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        add(id){
            if(id){
                this.contador++
                fetchApi(this.url+`lavadora/programa/findById/${id}`, 'GET', this.$session.get('token'))
                .then(data => {
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        let pl = data.datos
                        this.programasLavado.push({"id": this.contador, "nombre": pl.nombre, "descripcion": pl.descripcion, "cantidadMinima": pl.cantidadMinima, "cantidadMaxima": pl.cantidadMaxima, "idPrograma": pl.id })
                    }else{
                        this.openNotification(`Error: inesperado al asignar una capacidad`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

                    }
                })
            }else{
                this.openNotification('Ocurrio un error', `Es requerido seleccionar algun programa de lavado`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
        elim(id){
            this.programasLavado = this.programasLavado.filter(dt => dt.id != id)
        },
        
        
        async mostraTipoLavado(){
            this.tiposLavado = []
            fetchApi(this.url+'tipoLavado/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tiposLavado = data.datos
                }else{
                    this.openNotification(`Error: Inesperado`, `Si el problema persiste comuniquese con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostrarTodos(){
            fetchApi(this.url+'lavadora/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.lavadoras = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadoras = data.datos
                    if(this.lavadoras.length == 0){
                        this.sinData = true
                    }
                    this.sinData = false
                }else{
                    this.sinData = true
                }
            })
        },
        async mostraActivos(){
            fetchApi(this.url+'lavadora/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {
                this.lavadoras = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadoras = data.datos
                    if(this.lavadoras.length == 0){
                        this.sinData = true
                    }
                    this.sinData = false
                }else{
                    this.sinData = true
    
                }
            })
        },
        async mostrarTodosLavados(){
            this.capacidades = []
            fetchApi(this.url+'lavadora/programa/findByAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach( val => {
                        this.capacidades.push({ maxCant: val.cantidadMaxima, minCant: val.cantidadMinima, descripcion: val.descripcion, nombre: val.nombre, id: val.id },)
                    })
                    this.totalRows = this.capacidades.length 

                }else{
                    this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostraInactivos(){

            fetchApi(this.url+'lavadora/findByEstado/7', 'GET', this.$session.get('token'))
            .then(data => {
                this.lavadoras = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadoras = data.datos
                    if(this.lavadoras.length == 0){
                        this.sinData = true
                    }
                    this.sinData = false
                }else{
                    this.sinData = true
                }
            })
        },
        mostrarActInact(){
            this.buscarAct ? this.mostraActivos() : this.mostraInactivos()
        },
        
        async addCapacidad(){
            let token = this.$session.get('token')

            let json = {
                "nombre": this.nomLavado,
                "descripcion": this.desLavado,
                "cantidadMinima": this.canMin,
                "cantidadMaxima": this.canMax
            };
            let res = await fetch(this.url+"lavadora/programa/save",{
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
                this.activeModal = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostraTipoLavado()

                this.canMax = ''
                this.canMin = ''
                this.desLavado = ''
                this.nomLavado = ''
            }else{
                this.openNotification(`Error: inesperado al registrar las capacidades`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
        async addWasher(){
            let token = this.$session.get('token')
            let pogramLav = []
            this.programasLavado.forEach( pl => {
                pogramLav.push(pl.idPrograma)
            })
            let json = {
                "lavadora": this.nombreLav,
                "idTipoLavado": this.tipoLavado,
                "programasLavado": pogramLav
            };
            let res = await fetch(this.url+"lavadora/register",{
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
                this.programasLavado = []
                //se actualiza token
                this.nombreLav = ''
                this.tipoLavado = ''
                this.progLavado = ''
                this.activeModal = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostraActivos()
            }else{
                this.openNotification(`Error: inesperado al registrar la lavadora`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
        async searchWasher(){

            this.lavadoras = []

            if(this.buscarTxt != ''){
                let token = this.$session.get('token')

                let json = {
                    "criterio": this.buscarTxt,
                    "estado": ""
                };
                let res = await fetch(this.url+"lavadora/find",{
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
                    this.lavadoras = data.datos

                }else{
                    this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

                }
            }else{
                this.mostrarTodos()
            }

        },
        async updatePage(status){
            if(status == 200){
                this.mostraActivos()
                this.mostraTipoLavado()
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
    min-height: 7rem; 
    min-width: 12rem;
}
input {
    width: 100%;
}
.ml-5 .vs-card{
    margin-left: auto!important
}
#per-page-select{
    background: #fff;
    border-radius: 0.5rem;
    padding: 4px;
  }
</style>
<style lang="stylus">
  getColor(vsColor, alpha = 1)
      unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
  getVar(var)
      unquote("var(--vs-"+var+")")
  .not-margin
    margin 0px
    font-weight normal
    padding 10px
  .con-form
    width 100%
    .flex
      display flex
      align-items center
      justify-content space-between
      a
        font-size .8rem
        opacity .7
        &:hover
          opacity 1
    .vs-checkbox-label
      font-size .8rem
    .vs-input-content
      margin 10px 0px
      width calc(100%)
      .vs-input
        width 100%
  .footer-dialog
    display flex
    align-items center
    justify-content center
    flex-direction column
    width calc(100%)
    .new
      margin 0px
      margin-top 20px
      padding: 0px
      font-size .7rem
      a
        color getColor('primary') !important
        margin-left 6px
        &:hover
          text-decoration underline
    .vs-button
      margin 0px
</style>

<style>

.centerAll{
    display: grid;
    place-items: center;
}
.card{
    border-radius: 1rem;
    min-height: 6rem; 
    min-width: 12rem;
}
.vs-input{
    width: 100%;
}

</style>