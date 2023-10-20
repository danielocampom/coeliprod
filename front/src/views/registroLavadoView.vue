<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <template>
                <div>
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
                                        <label for="floatingSelect">Selecciona el tipo de Lavado</label>
                                        <div class="form-floating">
                                            <b-form-select style="height: 1rem;" class="form-select"  v-model="tipoLavado" :options="tipoLavados" @change="mostrarLavadoras" size="sm"></b-form-select>
                                            <label for="floatingSelect" v-if="tipoLavado == ''">Selecciona una Opción</label>
                                            <label for="floatingSelect" v-else>{{tipoLavado.nombre}}</label>
                                        </div>
                                    </div>
                                </b-col>
                                
                                <b-col class="mt-4" lg="12" md="12" sm="12" v-if="tipoLavado != ''">
                                    <ul v-for="(lvd, i) in lavadoras" :key="i">
                                        <li>
                                            
                                            {{ lvd.nombreLvd }}
                                            <div class="con-selects">
                                                <div class="form-floating">
                                                    <select class="form-select" @change="guardarResultado(i,  $event.target.value, lvd.idLavadora)">
                                                        <option value="" selected>Selecciona La Cantidad Correspondiente</option>
                                                        <option v-for="(prog, j) in lvd.programasLavado" :key="j" :value="prog.idPrograma">{{ prog.nombreProgramaLavado }}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
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
                                        flat
                                        :active="Agregar == 1"
                                        @click="addPaso()"
                                    >
                                        Asignar Paso
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
                        <b-row>
                                <b-col lg="12" class="pb-2"><vs-button success size="large" @click="addProceso()">Guardar Registro</vs-button></b-col>
                        </b-row>
                    </b-container>
                </div>
            </template>
        </b-container>
        <br>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>
<script>
import HeaderComponent from '@/components/Header.vue';
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';
import draggable from 'vuedraggable';


export default {
    name:"PrendasView",
    data: () => ({
        allRoles: [],
        lavados: [],
        lavadoras: [],
        tipoLavados: [],
        programaLavadora: [],
        programasLavado: [],
        programasLavadoSelected: [],
        lavado: '',
        tipoLavado: '',
        lavadora: '',
        nombreProceso: '',
        codigoProceso: '',
        descripcion: '',
        nombre: '',
        orden: 1,
        contador: 0,
        optionsRoles: [],
        pasos: [],
        resultados: [],
        Agregar: 0,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        loginComponent,
        draggable
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    
        this.mostraRoles()
        this.mostrarLavados()
        this.mostrarTipoLavados()
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        guardarResultado(index, valorSeleccionado, lavadora) {
            this.resultados[index] = {idPrograma: valorSeleccionado, idLavadora: lavadora};
        },
        onDragEnd() {
            this.pasos = this.pasos.map((paso, index) => ({
                id: paso.id,
                programaLavadora: this.programasLavadoSelected, 
                idTipoLavado: paso.idTipoLavado,
                nombre: paso.nombre,
                orden: index+1,
                descripcion: paso.descripcion,
                rolesCambio: paso.rolesCambio,
            }));
        },
        async mostrarLavadoras(){
            this.lavadoras = []
            fetchApi(this.url+`lavadora/findByTipoLavado/${this.tipoLavado.id}`, 'GET', this.$session.get('token'))
            .then(data => {
                this.lavadoras = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    // console.log(data.datos)
                    this.lavadoras = data.datos
                    this.lavadoras.selectedPrograma = null
                }
            })
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
            // this.lavadoras.forEach(lvd => {
            //     if (lvd.selectedPrograma !== null) {
            //         this.programasLavadoSelected.push({idLavadora:lvd.idLavadora, idPrograma:selectedPrograma})
            //     }
            // });
            // this.resultados.forEach((resultado, index) => {
            //     if (resultado !== undefined) {
            //         // this.programasLavadoSelected.push({idLavadora:lvd.idLavadora, idPrograma:selectedPrograma})
            //         console.log(resultado);
            //     }
            // });
            // let error = []
            // if(this.descripcion == ''){
            //     error.push("<br>Es Requerido el campo Descripción")
            // }
            // if(this.nombre == ''){
            //     error.push("<br>Es Requerido el campo Nombre")
            // }
            // if(this.optionsRoles.length == 0){
            //     error.push("<br>Es Requerido seleccionar un Rol")
            // }
            
            // if(this.lavado == ''){
            //     error.push("<br>Es Requerido seleccionar un Lavado")
            // }

            // if(this.programasLavadoSelected.length == 0){
            //     error.push("<br>Es Requerido seleccionar una lavadora con su capacidad correspondiente")
            // }
            // let pasos = {
            //     "id": this.contador,
            //     "programaLavadora": this.programasLavadoSelected, 
            //     "idTipoLavado": this.tipoLavado.id,
            //     "nombre": this.nombre,
            //     "descripcion": this.descripcion,
            //     "orden": this.orden++,
            //     "rolesCambio": this.optionsRoles,
            // }
            // if(error.length == 0){
            //     this.pasos.push(pasos)
            //     this.contador++
            //     this.descripcion = ''
            //     this.nombre = ''
            //     this.optionsRoles = []
            //     this.lavado = ''
            //     this.tipoLavado = ''
            //     this.lavadoras = []

            // }else{
            //     this.openNotification(`Error: Al agregar un Paso`, `${error}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            // }

        },
        async addProceso(){
            let token = this.$session.get('token')
            
            let pasosFiltrados = this.pasos.filter(paso => paso.idProgramaLavado !== 0);

            let json = {
                "nombreProceso": this.nombreProceso,
                "codigo": this.codigoProceso,
                "pasos": pasosFiltrados,
            };
            let res = await fetch(this.url+"proceso/register",{
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
                
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.updatePage(200)
            }else{
                console.warn(data)
                this.openNotification(`Error Inesperado`, `Comuniquese con el administrador`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async updatePage(status){
            if(status == 200){
                setTimeout(function() {
                    location.reload();
                }, 3000)

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
input {
    width: 100%;
}
.card{
    border-radius: 1rem;
}
.ml-5 .vs-card{
    margin-left: auto!important
} 

.centerAll{
    display: grid;
    place-items: center;
}

.vs-card{
    padding: 0.5rem;
}
.vs-input{
    width: 95%;
}
.form-select{
    background: rgba(var(--vs-primary), 0.1) !important;
    color: rgba(var(--vs-primary), 1);
    width: 95%;
    border-radius: 1rem;
    height: 1rem;
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
