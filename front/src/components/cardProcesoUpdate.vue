<template>
    <div>
        <b-card  v-if="render">
            <b-skeleton animation="throb" width="85%"></b-skeleton>
            <b-skeleton animation="throb" width="55%"></b-skeleton>
            <b-skeleton animation="throb" width="70%"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
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
            <vs-button primary block class="mt-2"  @click="activeDetalles=!activeDetalles">
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
                            </b-row>
                        </b-card>
                        <b-card class="mt-4" title="Asignación de Pasos">
                            <b-row class="mt-4">
                                
                                <b-col class="mt-2" lg="6" md="6" sm="12">
                                    <vs-input state="primary" primary v-model="nombre" label-placeholder="Nombre del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-2" lg="6" md="6" sm="12">
                                    <vs-input state="primary" primary v-model="descripcion" label-placeholder="Descripción del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                
                                <b-col class="mt-4" lg="6" md="6" sm="12">
                                    <div class="con-selects">
                                        <label for="floatingSelect">Selecciona el tipo de Lavado</label>
                                        <div class="form-floating">
                                            <b-form-select style="height: 1rem;" class="form-select"  v-model="tipoLavado" :options="tipoLavados"  size="sm"></b-form-select>
                                            <label for="floatingSelect">Selecciona una Opción</label>
                                        </div>
                                    </div>
                                    <b-card v-if="tipoLavado != ''" :title="tipoLavado.nombre" tag="article" class="mb-2 mt-3">
                                    </b-card> 
                                </b-col>
                                <b-col class="mt-4" lg="6" md="6" sm="12">
                                    <div class="con-selects">
                                        <label for="floatingSelect">Selecciona el tipo de Programa</label>
                                        <div class="form-floating">
                                            <b-form-select style="height: 1rem;" class="form-select"  v-model="lavado" :options="lavados"  size="sm"></b-form-select>
                                            <label for="floatingSelect">Selecciona una Opción</label>
                                        </div>
                                    </div>
                                    <b-card v-if="lavado != ''" :title="lavado.nombre" tag="article" class="mb-2 mt-3">
                                        <b-card-text>
                                            <b-row>
                                                <b-col>
                                                    <p class="fw-bold">{{lavado.descripcion}}</p>
                                                </b-col>
                                                <b-col>
                                                    <b>Capacidad:</b>
                                                    <ul class="list-group list-group-horizontal">
                                                        <li class="list-group-item">Minima: {{ lavado.minima }}</li>
                                                        <li class="list-group-item">Maxima: {{ lavado.maxima }}</li>
                                                    </ul>
                                                </b-col>
                                            </b-row>
                                        </b-card-text>
                                    </b-card> 
                                </b-col>
                                <div class="con-switch mt-5">
                                    <b-row>
                                        <b-col class="mt-2" cols="2" v-for="(rol, i) in allRoles" :key="i">
                                            <vs-switch  :val="rol.id" v-model="optionsRoles">
                                                {{ rol.nombre }}
                                            </vs-switch>
                                        </b-col>
                                    </b-row>
                                </div>
                                <b-container class="mt-3">
                                    <vs-button
                                        success
                                        :active="Agregar == 1"
                                        @click="addPaso()"
                                    >
                                    <box-icon name='plus' color="#fff"></box-icon > Asignar Paso
                                    </vs-button>
                                </b-container>
                            </b-row>
                        </b-card>
                        <draggable class="row" v-model="pasos" @change="onDragEnd">
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
                                </b-card>
                            </div>
                        </draggable>
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
            <vs-button primary block class="mt-2" @click="activarProceso">
                <box-icon name='play' color="#fff"></box-icon> Activar
            </vs-button>
            <vs-button danger block class="mt-2"  @click="deleteProceso">
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

        activeDetalles: false,
        activeEditar: false,
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
        this.pasos = this.dataProceso.pasos.map((paso) => ({
            id: paso.id,
            descripcion: paso.descripcion,
            nombre: paso.nombre,
            orden: paso.orden,
            rolesCambio: paso.roles,
            idProgramaLavado: paso.idProgramaLavado, 
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
                idProgramaLavado: paso.idProgramaLavado, 
                idTipoLavado: paso.idTipoLavado,
                nombre: paso.nombre,
                orden: index+1,
                descripcion: paso.descripcion,
                rolesCambio: paso.rolesCambio,
            }));
        },
        async mostraRoles(){
            fetchApi(this.url+'rol/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.allRoles = data.datos
                }else{
                    console.warn(data)
                    this.openNotification('Ocurrio un error al obtener los datos', `Comuniquese con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
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
                }else{
                    console.warn(data)
                    this.openNotification('Ocurrio un error al obtener los datos', `Comuniquese con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },  
        
        mostrarTipoLavados(){
            fetchApi(this.url+'tipoLavado/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tipoLavados.push({"value": 0, "text": "No Aplica"})
                    data.datos.forEach( value => {
                        this.tipoLavados.push({"value": {id: value.id, nombre: value.nombre }, "text": value.nombre})
                    })
                }else{
                    console.warn(data)
                    this.openNotification('Ocurrio un error al obtener los datos', `Comuniquese con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },  
        deletePaso(id){
            this.pasos = this.pasos.filter(paso => paso.id != id)
        },
        async addPaso(){
            let error = []
            if(this.descripcion == ''){
                error.push("<br>Es Requerido el campo Descripción")
            }
            if(this.nombre == ''){
                error.push("<br>Es Requerido el campo Nombre")
            }
            if(this.optionsRoles.length == 0){
                error.push("<br>Es Requerido seleccionar un Rol")
            }
            
            if(this.lavado == ''){
                error.push("<br>Es Requerido seleccionar un Lavado")
            }
            let pasos = {
                "id": this.contador,
                "idProgramaLavado": this.lavado.id, 
                "idTipoLavado": this.tipoLavado.id,
                "nombre": this.nombre,
                "descripcion": this.descripcion,
                "orden": this.orden++,
                "rolesCambio": this.optionsRoles,
            }
            if(error.length == 0){
                this.pasos.push(pasos)
                this.contador++
                this.descripcion = ''
                this.nombre = ''
                this.optionsRole = []
                this.lavado = ''
                this.tipoLavado = ''

            }else{
                this.openNotification(`Error: Al agregar un Paso`, `${error}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
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
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Actualizado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.updatePage(200)
                this.activeEditar = false
            }else{
                console.warn(data)
                this.openNotification(`Error Inesperado`, `Comuniquese con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
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
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Desactivado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
                console.warn(data)
                this.openNotification(`Error Inesperado`, `Comuniquese con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
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
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Activado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
            
                console.warn(data)
                this.openNotification(`Error Inesperado`, `Comuniquese con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
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