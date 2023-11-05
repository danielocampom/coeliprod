<template>
    <div>
        <b-card  v-if="render">
            <b-skeleton animation="throb" width="85%"></b-skeleton>
            <b-skeleton animation="throb" width="55%"></b-skeleton>
            <b-skeleton animation="throb" width="70%"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
        </b-card>        
        <b-card v-else >
            <div class="d-flex flex-row bd-highlight">
                <div class="p-1 bd-highlight">
                    <box-icon name='radio-circle-marked' :color="dataProceso.estado == 1 ? '#32ff00' : '#ff0023'" ></box-icon>
                    
                </div>
                <div class="p-1 bd-highlight">
                    <h5 class="card-title">{{dataProceso.codigo}}</h5>
                    <h6 class="card-subtitle text-muted mb-2">{{dataProceso.nombre}}</h6>
                </div>
            </div>
            <!-- {{ dataProceso.pasos }} -->
            <vs-button primary block class="mt-2"  @click="modalDetalles">
                <box-icon name='detail' color="#fff"></box-icon> Mostrar Detalles
            </vs-button>
            <b-modal centered v-model="activeDetalles">
                <template #modal-header="{ close }">
                    <h5>Detalles <b>{{dataProceso.codigo}}</b></h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <div class="con-form">
                    <v-timeline  dense v-for="(paso, i) in dataProceso.pasos" :key="i">
                        <v-timeline-item  color="deep-purple lighten-1" >
                            <span slot="opposite">{{paso.nombre}}</span>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <div class="mt-1">
                                        <label for="descripcion">Descripcion: </label>
                                        <strong>{{paso.descripcion}}</strong>
                                    </div>
                                    <div class="mt-1">
                                        <label for="tipoLavado">Tipo de Lavado: </label>                                    
                                        <strong>
                                            {{paso.idTipoLavado}}
                                        </strong>
                                    </div>
                                    <div class="mt-1">
                                        <label for="tipoLavado">Programa de lavado: </label>                                    
                                        
                                            <ul v-if="paso.idProgramaLavado">
                                                
                                                <li>
                                                    Nombre: ejemplo
                                                </li>
                                                <li>
                                                    Descripcion: ejemplo
                                                </li>
                                                <li>
                                                    cantidad Minima: ejemplo
                                                </li>
                                                <li>
                                                    cantidad Maxima: ejemplo
                                                </li>
                                            </ul>
                                        <strong v-else>
                                            No aplica programa de lavado
                                        </strong>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>
                       
                    </v-timeline>
                </div>
                <br>
                <template #modal-footer="{ ok }">
                    <vs-button danger @click="ok()">
                        <box-icon name='exit' color="#fff"></box-icon> Salir
                    </vs-button>
                </template>
            </b-modal>
            <vs-button primary block class="mt-2" @click="activeEditar=!activeEditar">
                <box-icon name='edit' color="#fff"></box-icon> Editar
            </vs-button>
            <b-modal size="xl" centered v-model="activeEditar">
                <template #modal-header="{ close }">
                    <h5>Editar <b>{{dataProceso.codigo}}</b></h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <div class="con-form">
                    <b-container class="bv-example-row">
                        <b-card>
                            <b-row>
                                <b-col class="mt-4" lg="6" md="6" sm="12">
                                    <vs-input state="primary" primary v-model="nombreProceso" label-placeholder="Nombre del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-4" lg="6" md="6" sm="12">
                                    <vs-input state="primary" primary v-model="codigoProceso" label-placeholder="Clave del Proceso">
                                        <template #icon>
                                            <box-icon name='dialpad-alt'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-2" lg="2" md="4" sm="12">
                                    <vs-button
                                        primary
                                        block
                                        @click="EditarNomProceso()"
                                    >
                                        <box-icon name='edit' color="#fff"></box-icon>Editar
                                    </vs-button>
                                </b-col>
                            </b-row>
                        </b-card>
                        
                        <draggable class="row" v-model="pasos" @change="onDragEnd"></draggable>
                        <div class="row" >
                            <div class="col-lg-4 col-md-6 col-sm-12 mt-3 mb-3" lg="4" md="6" sm="6" v-for="(paso, i) in pasos" :key="i">
                                <b-card :title="paso.nombre" tag="article" class="mb-2">
                                    <b-card-text>
                                        {{paso.descripcion}}
                                    </b-card-text>
                                    <vs-button
                                        danger
                                        block
                                        @click="deletePaso(paso.id)"
                                    >
                                        <box-icon name='minus' color="#fff"></box-icon >Eliminar
                                    </vs-button>
                                    <vs-button
                                        primary
                                        block
                                        @click="editarPaso(paso.id)"
                                    >
                                        <box-icon name='edit' color="#fff"></box-icon >Editar
                                    </vs-button>
                                </b-card>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12 mt-3 mb-3">
                                <b-card  tag="article" class="mb-2">
                                    <vs-button
                                        primary
                                        block
                                        @click="AddPaso()"
                                    >
                                        <box-icon name='edit' color="#fff"></box-icon >Agregar Paso
                                    </vs-button>  
                                </b-card>
                            </div>
                        </div>
                    </b-container>
                </div>
                <br>
                <template #modal-footer="{ ok }">
                     <!-- <vs-button success size="large" @click="updateProceso()">
                        <box-icon name='save' color="#fff"></box-icon > Guardar Registro
                    </vs-button> -->
                    <vs-button danger @click="ok()">
                        <box-icon name='exit' color="#fff"></box-icon> Salir
                    </vs-button>
                </template>
            </b-modal>
            <b-modal size="xl" centered v-model="activeEditarPaso">
                <template #modal-header="{ close }">
                    <h5>Editar <b>Paso</b></h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <div class="con-form">
                    <b-container class="bv-example-row">
                        
                        <b-card class="mt-4" title="Editar de Pasos">
                            <b-row class="mt-2 align-items-end">
                                <b-col class="mt-2" lg="4" md="4" sm="12">
                                    <vs-input state="primary" primary v-model="nombre" label-placeholder="Nombre del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-2" lg="4" md="4" sm="12">
                                    <vs-input state="primary" primary v-model="descripcion" label-placeholder="Descripción del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                
                                <b-col lg="4" md="4" sm="12">
                                    <div class="con-selects">
                                        <div class="form-floating">
                                            <select class="form-select" v-model="tipoLavado"  @change="mostrarLavadoras">
                                                <option value="" selected>Selecciona una Opcion</option>
                                                <option v-for="(lav, j) in tipoLavados" :key="j" :value="lav.value.id">{{ lav.value.nombre }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </b-col>
                                
                                <b-col class="mt-4" lg="12" md="12" sm="12" v-if="tipoLavado != ''">
                                    <b-row>
                                       <b-col lg="4" md="6" sm="12" v-for="(lvd, i) in lavadoras" :key="i">
                                            <div class="con-selects">
                                                <label for="floatingSelect">{{lvd.nombreLvd}}</label>
                                                <div class="form-floating">
                                                    <select class="form-select" @change="guardarResultado(i,  $event.target.value, lvd.idLavadora)">
                                                        <option value="" selected>Selecciona La Cantidad Correspondiente</option>
                                                        <option v-for="(prog, j) in lvd.programasLavado" :key="j" :value="prog.idPrograma">{{ prog.nombreProgramaLavado }}</option>
                                                    </select>
                                                </div>
                                            </div>

                                        </b-col>
                                    </b-row>
                                    
                                </b-col>
                                <div class="con-switch mt-5">
                                    <b-row>
                                        <b-col class="mt-2" cols="2" v-for="(rol, i) in allRoles" :key="i">
                                            <vs-switch  :val="''+rol.id" v-model="optionsRoles">
                                                {{ rol.nombre }}
                                            </vs-switch>
                                        </b-col>
                                    </b-row>
                                </div>
                                <!-- <b-container class="mt-3">
                                    <vs-button
                                        success
                                        flat
                                        :active="Agregar == 1"
                                        @click="addNewPaso()"
                                    >
                                        Asignar Paso
                                    </vs-button>
                                </b-container> -->
                            </b-row>
                        </b-card>
                    </b-container>
                </div>
                <br>
                <template #modal-footer="{ ok }">
                     <vs-button success size="large" @click="updateProceso()">
                        <box-icon name='save' color="#fff"></box-icon > Guardar Registro
                    </vs-button>
                    <vs-button danger @click="ok()">
                        <box-icon name='exit' color="#fff"></box-icon> Salir
                    </vs-button>
                </template>
            </b-modal>
            
            <b-modal size="xl" centered v-model="activeAddPaso">
                <template #modal-header="{ close }">
                    <h5>Agregar <b>Paso</b></h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <div class="con-form">
                    <b-container class="bv-example-row">
                        
                        <b-card class="mt-4" title="Agregar de Pasos">
                            <b-row class="mt-2 align-items-end">
                                <b-col class="mt-2" lg="4" md="4" sm="12">
                                    <vs-input state="primary" primary v-model="nombreAdd" label-placeholder="Nombre del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-2" lg="4" md="4" sm="12">
                                    <vs-input state="primary" primary v-model="descripcionAdd" label-placeholder="Descripción del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                
                                <b-col lg="4" md="4" sm="12">
                                    <div class="con-selects">
                                        <div class="form-floating">
                                            <select class="form-select" v-model="tipoLavadoAdd"  @change="mostrarLavadoras(1)">
                                                <option value="" selected>Selecciona una Opcion</option>
                                                <option v-for="(lav, j) in tipoLavados" :key="j" :value="lav.value.id">{{ lav.value.nombre }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </b-col>
                                
                                <b-col class="mt-4" lg="12" md="12" sm="12" v-if="tipoLavadoAdd != ''">
                                    <b-row>
                                       <b-col lg="4" md="6" sm="12" v-for="(lvd, i) in lavadoras" :key="i">
                                            <div class="con-selects">
                                                <label for="floatingSelect">{{lvd.nombreLvd}}</label>
                                                <div class="form-floating">
                                                    <select class="form-select" @change="guardarResultado(i,  $event.target.value, lvd.idLavadora)">
                                                        <option value="" selected>Selecciona La Cantidad Correspondiente</option>
                                                        <option v-for="(prog, j) in lvd.programasLavado" :key="j" :value="prog.idPrograma">{{ prog.nombreProgramaLavado }}</option>
                                                    </select>
                                                </div>
                                            </div>

                                        </b-col>
                                    </b-row>
                                    
                                </b-col>
                                <div class="con-switch mt-5">
                                    <b-row>
                                        <b-col class="mt-2" cols="2" v-for="(rol, i) in allRoles" :key="i">
                                            <vs-switch  :val="''+rol.id" v-model="optionsRolesAdd">
                                                {{ rol.nombre }}
                                            </vs-switch>
                                        </b-col>
                                    </b-row>
                                </div>
                                
                            </b-row>
                        </b-card>
                    </b-container>
                </div>
                <br>
                <template #modal-footer="{ ok }">
                     <vs-button success size="large" @click="addNewPaso()">
                        <box-icon name='save' color="#fff"></box-icon > Guardar Registro
                    </vs-button>
                    <vs-button danger @click="ok()">
                        <box-icon name='exit' color="#fff"></box-icon> Salir
                    </vs-button>
                </template>
            </b-modal>
            <vs-button v-if="dataProceso.estado != 1" primary block class="mt-2" @click="activarProceso">
                <box-icon name='play' color="#fff"></box-icon> Activar
            </vs-button>
            <vs-button danger v-else block class="mt-2"  @click="deleteProceso">
                <box-icon name='trash' color="#fff"></box-icon> Eliminar
            </vs-button>
        </b-card>
        
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
// arreglar registro drag
import loginComponent from './cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import draggable from 'vuedraggable';


export default {
    name:"CardProcesoUpdateComponent",
    props: {
        dataProceso: Object,
    },
    data: () => ({
        
        elementos: [],
        nombreAdd: '',
        descripcionAdd: '',
        tipoLavadoAdd: '',
        optionsRolesAdd: [],
        allRoles: [],
        lavados: [],
        tipoLavados: [],
        lavado: '',
        tipoLavado: '',
        nombreProceso: '',
        codigoProceso: '',
        descripcion: '',
        nombre: '',
        orden: 1,
        contador: 0,
        optionsRoles: [],
        pasos: [],
        Agregar: 0,
        active2: false,
        resultados: [],
        programasLavadoSelected: [],
        lavadoras: [],
        select : '',
        activeDetalles: false,
        activeEditar: false,
        activeEditarPaso: false,
        activeAddPaso: false,
        render: true,
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        loginComponent,
        draggable,
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        this.contador = this.dataProceso.pasos.length
        console.log(this.dataProceso)
        this.pasos = this.dataProceso.pasos.map((paso) => ({
            id: paso.id,
            descripcion: paso.descripcion,
            nombre: paso.nombre,
            orden: paso.orden,
            rolesCambio: paso.roles,
            programaLavadora: paso.programas, 
            idTipoLavado: paso.idTipoLavado,
        }));
        this.nombreProceso = this.dataProceso.nombre
        this.codigoProceso = this.dataProceso.codigo
        this.mostraRoles()
        this.mostrarLavados()
        this.mostrarTipoLavados()
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

        onDragEnd() {
            this.pasos = this.pasos.map((paso, index) => ({
                id: paso.id,
                programaLavadora: paso.programaLavadora, 
                idTipoLavado: paso.idTipoLavado,
                nombre: paso.nombre,
                orden: index+1,
                descripcion: paso.descripcion,
                rolesCambio: paso.rolesCambio,
            }));
        },
        modalDetalles(){
            this.activeDetalles = true
            this.$forceUpdate();
        },
        editarPaso(id){
            let dataPaso = this.pasos.find(objeto => objeto.id === id)
            this.activeEditar = true
            this.activeEditarPaso = true
            this.nombre = dataPaso.nombre
            this.descripcion = dataPaso.descripcion
            this.tipoLavado = dataPaso.idTipoLavado
            this.mostrarLavadoras()
            
            dataPaso.programaLavadora.forEach( dt => {
                this.resultados.push({idLavadora: dt.idLavadora, idPrograma: dt.programa.id})
            });
            
            this.optionsRoles = dataPaso.rolesCambio
        },
        async mostrarLavadoras( add = ''){
            let lavado = ''
            if(add != ''){
                lavado = this.tipoLavadoAdd
            }else{
                lavado = this.tipoLavado
            }
            this.lavadoras = []
            fetchApi(this.url+`lavadora/findByTipoLavado/${lavado}`, 'GET', this.$session.get('token'))
            .then(data => {
                this.lavadoras = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadoras = data.datos
                    this.lavadoras.selectedPrograma = null
                }
            })
        },
        guardarResultado(index, valorSeleccionado, lavadora) {
            this.resultados[index] = {idPrograma: valorSeleccionado, idLavadora: lavadora};
        },
        async EditarNomProceso(){
            let token = this.$session.get('token')

            let json = {
                "idProceso": this.dataProceso.id,
                "nombreProceso": this.nombreProceso,
                "codigo": this.codigoProceso,
            };
            
            let res = await fetch(this.url+"proceso/update/proceso",{
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
                //se actualiza token
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Actualizado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.updatePage(200)
                this.activeEditar = false
            }else{
                console.warn(data)
                this.openNotification(`Error Inesperado al actualizar el proceso`, `Comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async mostraRoles(){
            fetchApi(this.url+'rol/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.allRoles = data.datos
                }
            })
        },
        mostrarLavados(){
            fetchApi(this.url+'lavadora/programa/findByAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavados.push({"value": {id: 0, nombre: "No Aplica", descripcion: "El Proceso no requiere lavado", maxima: "No Requiere Capacidad", minima: "No Requiere Capacidad"}, "text": "No Aplica"})
                    data.datos.forEach( value => {
                        this.lavados.push({"value": {id: value.id, nombre: value.nombre, descripcion: value.descripcion, maxima: value.cantidadMaxima, minima: value.cantidadMinima}, "text": value.nombre})
                    })
                }
            })
        },  
        
        mostrarTipoLavados(){
            this.tipoLavados = []
            fetchApi(this.url+'tipoLavado/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tipoLavados.push({"value": {id: "0", nombre: "No Aplica" }, "text": "No Aplica"})
                    data.datos.forEach( value => {
                        this.tipoLavados.push({"value": {id: value.id, nombre: value.nombre }, "text": value.nombre})
                    })
                }
            })
        }, 
        AddPaso(){
            this.activeAddPaso = true
            this.resultados = []
        },
        async deletePaso(id){

            this.pasos = this.pasos.filter(paso => paso.id != id)

            let token = this.$session.get('token')
            const res = await fetch(this.url+`proceso/delete/paso/${id}`,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            const data = await res.json();
            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.refresh()
                this.active2 = false
                this.active = false
                this.$emit('updatePage', '200')
                this.updatePage(200)

                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Desactivado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
                this.openNotification(`Error: inesperado al querer eliminar`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                
            }
        },
        async addNewPaso(){
            
            this.resultados.forEach( resultado => {
                this.programasLavadoSelected.push({idLavadora:resultado.idLavadora, idPrograma:resultado.idPrograma})
            });
            let error = []
            if(this.descripcionAdd == ''){
                error.push("<br>Es Requerido el campo Descripción")
            }
            if(this.nombreAdd == ''){
                error.push("<br>Es Requerido el campo Nombre")
            }
            if(this.optionsRolesAdd.length == 0){
                error.push("<br>Es Requerido seleccionar un Rol")
            }

            if(this.programasLavadoSelected.length == 0){
                error.push("<br>Es Requerido seleccionar una lavadora con su capacidad correspondiente")
            }
            let pasos = {
                "descripcion": this.descripcionAdd,
                "nombre": this.nombreAdd,
                "orden": this.orden++,
                "rolesCambio": this.optionsRolesAdd,
                "idTipoLavado": this.tipoLavadoAdd.id,
                "programaLavadora": this.programasLavadoSelected, 
                "id": this.contador,
                "idProceso": this.dataProceso.id
            }
            if(error.length == 0){
                
                let token = this.$session.get('token')

                let res = await fetch(this.url+"proceso/add/paso",{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': token
                    },
                    body: JSON.stringify(pasos)
                })
                let data = await res.json()

                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    //se actualiza token
                    this.pasos.push(pasos)
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Actualizado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.updatePage(200)
                    this.nombreAdd = ''
                    this.descripcionAdd = ''
                    this.tipoLavadoAdd = ''
                    this.optionsRolesAdd = []
                    this.activeAddPaso = false
                }else{
                    console.warn(data)
                    this.openNotification(`Error Inesperado al Registar el proceso`, `Comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }else{
                this.openNotification(`Error: Al agregar un Paso`, `${error}`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }

        },
        async updateProceso(){
            let token = this.$session.get('token')
            let pasosFiltrados = this.pasos.filter(paso => paso.idProgramaLavado !== 0);

            let json = {
                "idProceso": this.dataProceso.id,
                "nombreProceso": this.nombreProceso,
                "codigo": this.codigoProceso,
                "pasos": pasosFiltrados,
            };
            
            let res = await fetch(this.url+"proceso/update",{
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
                //se actualiza token
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Actualizado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.updatePage(200)
                this.activeEditar = false
            }else{
                console.warn(data)
                this.openNotification(`Error Inesperado al actualizar el proceso`, `Comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },

        async deleteProceso(){
            let token = this.$session.get('token')
            const res = await fetch(this.url+`proceso/delete/${this.dataProceso.id}`,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            const data = await res.json();
            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.refresh()
                this.$emit('updatePage', '200')
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Desactivado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
                console.warn(data)
                this.openNotification(`Error Inesperado al desactivar el proceso`, `Comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async activarProceso(){
            let token = this.$session.get('token')
            const res = await fetch(this.url+`proceso/activate/${this.dataProceso.id}`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            const data = await res.json();
            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.refresh()
                this.$emit('updatePage', '200')
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Activado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
            
                console.warn(data)
                this.openNotification(`Error Inesperado al activar el proceso`, `Comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async updatePage(status){
            if(status == 200){
                this.$emit('updatePage', '200')
                this.mostraRoles()
                this.mostrarLavados()
                this.mostrarTipoLavados()
                setTimeout(() => {
                    this.render = false

                }, 1000) 
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