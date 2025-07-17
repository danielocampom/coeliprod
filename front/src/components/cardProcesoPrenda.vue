<template>
    <div >
        <b-card  v-if="render">
            <b-skeleton animation="throb" width="85%"></b-skeleton>
            <b-skeleton animation="throb" width="55%"></b-skeleton>
            <b-skeleton animation="throb" width="70%"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2" v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN'].includes(role))"></b-skeleton>
        </b-card>

        <b-card 
             :style="{ 'border-left': `solid 5px #0d6efd !important` }"
            v-else 
            :title="data.nomCliente" 
            :sub-title="data.nombrePrenda"
        >
            <div class="fixed">
                <!-- Botón del dropdown -->
                <b-dropdown 
                    v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))" 

                    class="top"
                    variant="outline-light" 
                    toggle-class="text-decoration-none" 
                    no-caret
                    right  
                    >
                    <template #button-content>
                        <box-icon name='dots-vertical-rounded'></box-icon>
                    </template>

                 
                    <vs-tooltip>
                        <b-dropdown-item @click="openOrdenLavado=!openOrdenLavado">
                            Cancelar orden de lavado
                        </b-dropdown-item>
                        <template #tooltip>
                            Cancela el embarque completo
                        </template>
                    </vs-tooltip>

                    <vs-tooltip>
                        <b-dropdown-item @click="openOrdenPrenda=!openOrdenPrenda">
                            Cancelar orden de prenda
                        </b-dropdown-item>
                        <template #tooltip>
                                Cancela unicamente la orden sobre esta prenda
                        </template>
                    </vs-tooltip>


                    <vs-tooltip>
                        <b-dropdown-item 
                            @click="openregresaPaso=!openregresaPaso"
                        >
                            Regresar paso 
                        </b-dropdown-item>
                        <template #tooltip>
                                Regresa especificamente al paso anterior
                        </template>

                    </vs-tooltip>
                </b-dropdown>

            </div>
            <div class='badge bg-primary text-wrap float-end mb-2'>
                Paso {{ data.npaso }}
            </div>

            <strong>{{ data.descripcionEstado }}</strong>
            <br>
           
            <p v-if="this.data.fechaInicio">{{ calcularTiempoTranscurrido(data.fechaInicio) }}</p>
            <br v-else>
            Numero Orden {{ data.idOrdenLavado }}
            <br>
            <p class="mt-3" v-if="this.data.folio != null">
                Folio: {{ this.data.folio }}
            </p>
            <br>
            <strong v-if="this.data.fhAlta">Fecha Registro {{ obtenerFechaBonita(this.data.fhAlta) }}</strong> <br>
            <strong v-if="this.data.fechaEntrega">Fecha Entrega {{ obtenerFechaBonita(this.data.fechaEntrega) }}</strong>
            
            <br>
            <br>
            <br>
            <div class="badge bg-primary text-wrap float-end" >
                {{ data.nombrePaso }}
            </div>

            <strong class="fw-light">
                Cantidad: {{ data.cantidadPrendas }}
            </strong>
        
            <div class="mt-auto">
                <vs-button block flat primary @click="modalIniciar=!modalIniciar" > Iniciar </vs-button> 
                <vs-dialog blur  v-model="modalIniciar">
                    <template #header>
                        <h4 class="not-margin">
                            Iniciar <b>Proceso</b>
                        </h4>
                    </template>
    
                    <div class="con-form">
                        <strong class="fw-light">Cantidad total de prendas: {{ data.cantidadPrendas }}</strong>
                        
    
                        <vs-input
                            class="mt-2"
                            v-model="cantidad"
                            label-placeholder="cantidad a ingresar"
                        />
                        
                        <div class="center  con-selects" v-if="this.data.idTipoLavado != null" >
                            
                            <vs-select style="max-width:100%!important;" class="mt-3" success label-placeholder="Lavadora" color="success"  v-model="tipoLavadora">
                                <vs-option-group>
                                    <div slot="title">
                                        Selecciona una opcion
                                    </div>
                                    <vs-option  v-for="(lavado, i) in getLavado" :key="i" :label="lavado.lavadora + ' - Max: ' + lavado.max + ' Min: ' + lavado.min" :value="lavado.idLavadora">
                                        {{ lavado.lavadora }}  Max.: {{ (lavado.max/100)*lavado.kilos }} KG  Min.: {{ (lavado.min/100)*lavado.kilos }} KG
                                    </vs-option>
                                </vs-option-group>
                            </vs-select>
                            <vs-select 
                                style="max-width:100%!important;" class="mt-3" success label-placeholder="Motivo" color="success" 
                                    v-model="idMotivoMaquinada">
                                <vs-option-group>
                                    <div slot="title">
                                        Selecciona una motivo
                                    </div>
                                    <vs-option  v-for="(motivo, i) in motivos" :key="i" 
                                    :label="motivo.motivo" 
                                    :value="motivo.id">
                                        {{ motivo.motivo }}
                                    </vs-option>
                                </vs-option-group>
                            </vs-select>

                        </div>
                        
                        
                    </div>
                    <template #footer>
                        <div class="footer-dialog">
                            <vs-button block @click="iniciar()" :disabled="iniciarProceso">
                                <box-icon v-if="iniciarProceso" name='loader' flip='vertical' animation='spin' color='#ffffff' ></box-icon>
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
                        <div v-if="detail.length != 0">
                            <b-card>
                                <div class="d-flex flex-row bd-highlight mb-3">
                                    <div class="p-2 bd-highlight">
                                        <h4 class="mt-2">{{ detail.cliente }}</h4>
                                        <strong>{{ detail.nombre }}</strong>
                                    </div>
                                </div>
                                cantidad por bolsa: <b>{{ detail.cantidadBolsa }}</b> <br>
                                cantidad prendas: <b>{{ data.cantidadPrendas }}  <box-icon name='edit' color="#0d6efd" v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN'].includes(role))" @click="editCantidades"></box-icon></b>
                               
                                <br>
                                tipo de lavado:<b> {{detail.proceso.nombre}} ({{ detail.proceso.codigo}})</b> 
                                <br>
                                <hr>
                                <v-timeline dense clipped >
                                    <v-timeline-item>
                                        <template v-slot:icon>
                                            <span><box-icon name='shower'></box-icon></span>
                                        </template>
                                        <h3>Pasos:</h3>
                                    </v-timeline-item>
                                    <br>
                                    <v-timeline-item dot-color="teal-lighten-3" class="mb-4" size="small"  v-for="(paso, i) in detail.proceso.pasos" :key="i">
                                        <template v-slot:icon>
                                            <small class="pt-1 headline font-weight-bold">{{prefijos(paso.nombre)}}</small>
                                        </template>
                                        <b-card :style="data.npaso == paso.orden ? { 'border-left': 'solid 5px #0d6efd !important' } : {}" 
                                                :title="paso.nombre" 
                                                :sub-title="paso.descripcion"
                                                @click="selectPaso"
                                                >
                                        </b-card>
                                    </v-timeline-item>
                                </v-timeline>
                            </b-card>
                        </div>
                    </template>
        
                    <template #modal-footer="{ ok }">
                        <vs-button danger @click="ok()">
                                Salir
                        </vs-button>
                    </template>
                    
                </b-modal>
            </div>

            <vs-dialog blur v-model="cancelPredas">
                <template #header>
                    <h4 class="not-margin">
                        Eliminar <b>{{data.nombrePrenda}}</b>
                    </h4>
                </template>
                <div class="con-form">
                    <template>
                        <p>Cantidad <b>{{ data.cantidadPrendas }}</b></p>
                        <div class="center content-inputs">
                            <vs-input danger type="text" v-model="motivoElim" label-placeholder="Describe el motivo">
                                <template #icon>
                                    <box-icon name='rename'></box-icon>
                                </template>
                            </vs-input>
                        </div>
                        <div class="center content-inputs">
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
            <vs-dialog v-model="comfirm">
                <template #header>
                    <h4 class="not-margin">
                        Estas seguro que deseas <b>Eliminar las prendas?</b>
                    </h4>
                </template>
                <ConfirmComponent @confirm="cancelPrednas"/>
            </vs-dialog>
            <vs-dialog v-model="movePaso">
                <template #header>
                    <h4 class="not-margin">
                        Estas seguro que moverlo <b>al paso indicado?</b>
                    </h4>
                </template>
                <ConfirmComponent @confirm="regresando"/>
            </vs-dialog>
            
            <vs-dialog v-model="openOrdenLavado">
                <template #header>
                    <h4 class="not-margin">
                        Estas seguro que Deseas cancelar <b>el embarque Completo?</b>
                    </h4>
                </template>
                <ConfirmComponent @confirm="cancelOrdenLavado"/>
            </vs-dialog>
            <vs-dialog v-model="openOrdenPrenda">
                <template #header>
                    <h4 class="not-margin">
                        Estas seguro que Deseas cancelar <b>la orden sobre esta prenda?</b>
                    </h4>
                </template>
                <ConfirmComponent @confirm="cancelOrdenPrenda"/>
            </vs-dialog>
            <vs-dialog v-model="openregresaPaso">
                <template #header>
                    <h4 class="not-margin">
                        Estas seguro que Deseas <b>Regresarlo?</b>
                    </h4>
                </template>
                <ConfirmComponent @confirm="regresarPaso"/>
            </vs-dialog>
            <vs-dialog blur v-model="editCount">
                <template #header>
                    <h4 class="not-margin">
                        deseas modificar la cantidad de <b>{{data.nombrePrenda}}?</b>
                    </h4>
                </template>
                <div class="con-form">
                    <template>
                        <p>Cantidad <b>{{ data.cantidadPrendas }}</b></p>
                        <div class="center content-inputs">
                            <vs-input danger type="text" v-model="motivoElim" label-placeholder="Describe el motivo">
                                <template #icon>
                                    <box-icon name='rename'></box-icon>
                                </template>
                            </vs-input>
                        </div>
                        <div class="center content-inputs">
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
                            @click="comfirmCount=!comfirmCount">
                            Modificar
                        </vs-button>
                    </div>
                </template>
            </vs-dialog>
            <vs-dialog v-model="comfirmCount">
                <template #header>
                    <h4 class="not-margin">
                        Estas seguro que deseas <b>Modifcar la Cantidad?</b>
                    </h4>
                </template>
                <ConfirmComponent @confirm="modificarCount"/>
            </vs-dialog>
            
        </b-card>
        
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        <!-- <div 
            @dragover.prevent 
            @dragenter.prevent 
            @drop="dropHandler">
            <h1> zona</h1>
        </div> -->
    </div>
</template>

<script>
import loginComponent from './cardLogin.vue';
import ConfirmComponent from '@/components/confirm.vue'
import { refreshSession, fetchApi } from "@/service/service.js"

export default {
    name:"CardProcesoPrendaComponent",
    props: {
        data: Object,
    },
    data: () => ({
        motivos: [],
        idMotivoMaquinada: '',
        getLavado: [],
        openOrdenLavado: false,
        openOrdenPrenda: false,
        openregresaPaso: false,
        modalIniciarDropDown: false,
        modalShowDetailDropDown: false,
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
        mensaje: '',
        detail: [],
        pasos: [],
        idPasos: [],  
        modalShowDetail: false,
        render: true,
        iniciarProceso: false, 
        movePaso: false,
        editCount: false,
        comfirmCount: false,
        comfirm: false,
        textAlertConfirm: '',
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
       
    }),
    computed: {
        
    },
    components: {
        loginComponent,
        ConfirmComponent,
    },
    
    watch: {
        data: {
            immediate: true, // Coma añadida aquí
            handler(newVal) { // Sin punto y coma aquí
                if (newVal) {
                    this.mostrarDetailPrendas(newVal.idPrenda);
                }
            }
        },
        
    },
    mounted(){
        
        // let fecha=new Date(this.data.fechaInicio);
        // console.log(this.data.fechaInicio)
        // this.date = this.calcularTiempoTranscurrido(this.data.fechaInicio);
        this.mostrarMotivo()
        setTimeout(() => {
            this.render = false
            this.mostrarDetailPrendas(this.data.idPrenda)
        }, 100) 
            if(this.data.idTipoLavado != null){
                this.mostrarLavadoras(this.data.idTipoLavado)
            }

    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        editCantidades(){
            this.textAlertConfirm = 
            this.editCount = true;
            this.modalShowDetail= false;
        },
        onNoResults(searchText) {
            // Lógica para manejar el caso en que no se encuentran resultados
            console.log(`No se encontraron resultados para: ${searchText}`);
        },
        async modificarCount(){
            if(status == 200){
                console.log("modificarCantidad...")
            }
        },
        async mostrarMotivo(){
            this.motivos = []
            fetchApi(this.url+'motivo/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.motivos = data
            })
        },
        selectPaso(){
            if(this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))){
                this.movePaso = true;
                this.modalShowDetail= false;
            }
        },
        async regresando(status){
            if(status == 200){
                console.log("regresando...")
            }
        },
        cancel(){
            this.modalShowDetail = false
            this.cancelPredas = false
            this.cancelPredas = true
        },
        async mostrarLavadoras(id){
            // let item = []
            fetchApi(this.url+`lavadora/findByTipoLavado/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 200){
                    // data.datos.forEach(lavado => {
                    //     if(lavado.estado !== "OCUPADO"){
                    //         item.push({id: lavado.idLavadora, lavadora: lavado.lavadora, max: lavado.max, min: lavado.min })
                    //     }
                    // });
                    this.getLavado = data.datos 
                } 
            })

        },
        prendaSeleccionada(){
            console.log("data")
        },
        async cancelPrednas(status){
            if(status == 200){
                let token = this.$session.get('token')

                let prenEliminadas = parseInt(this.data.cantidadPrendas)-parseInt(this.cantidadElim)

                if(prenEliminadas < 0){
                    this.openNotification( `No puedes Eliminar mas prendas de la cantidad asignada `, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

                }else{
                    let json = {
                        "mensaje": this.motivoElim,
                        "cantidadCancela": this.cantidadElim,
                        "idOrdenPrenda": this.data.idOrdenPrenda,
                        "idHist": this.data.idHist ? this.data.idHist : 0

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
                        this.openNotification(`Exito: ${data.mensaje}`, `Se han Eliminado Exitosamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                        this.$emit('updatePage', '200')
                    }else{
                        this.openNotification(`Error: inesperado al intentar cancelar`, data.mensaje, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                    }
                }
            }
        },
        async cancelOrdenLavado(status){
            if(status == 200){
                let token = this.$session.get('token')
    
                let res = await fetch(`${this.url}orden/delete/${this.data.idOrdenLavado}`,{
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': token
                    },
                })
                let data = await res.json()
    
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    this.comfirm = false
                    this.openOrdenLavado = false
                    this.openNotification(`Exito: ${data.mensaje}`, `Se han Eliminado Exitosamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.$emit('updatePage', '200')
                }else{
                    this.openNotification(`Error: inesperado al intentar cancelar`, data.mensaje, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }
        },
        async cancelOrdenPrenda(status){
            if(status == 200){

                let token = this.$session.get('token')
    
                let res = await fetch(`${this.url}orden/delete/ordenprenda/${this.data.idOrdenPrenda}`,{
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': token
                    },
                })
                let data = await res.json()
    
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    this.comfirm = false
                    this.openOrdenPrendas = false
                    this.openNotification(`Exito: ${data.mensaje}`, `Se han Eliminado Exitosamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.$emit('updatePage', '200')
                }else{
                    this.openNotification(`Error: inesperado al intentar cancelar`, data.mensaje, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }
        },
        async regresarPaso(status){
            if(status == 200){
                let token = this.$session.get('token')
    
                let json = {
                    "mensaje": this.motivoElim,
                    "cantidadCancela": 0,
                    "idOrdenPrenda": 0,
                    "idHist": this.data.idHist ? this.data.idHist : 0
    
                };
    
                let res = await fetch(`${this.url}orden/paso/return`,{
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
                    this.comfirm = false
                    this.openregresaPaso = false
                    this.openNotification(`Exito: ${data.mensaje}`, `Se han Eliminado Exitosamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.$emit('updatePage', '200')
                }else{
                    this.openNotification(`Error: inesperado al intentar cancelar`, data.mensaje, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }
        },
        obtenerFechaBonita(fechaParametro) {
            // Si la fecha no incluye hora, agregar T00:00:00
            const fechaStr = fechaParametro.includes('T') ? fechaParametro : `${fechaParametro}T00:00:00`;
            const fecha = new Date(fechaStr);

            const opciones = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            };

            const formatoFecha = new Intl.DateTimeFormat('es-ES', opciones);
            return formatoFecha.format(fecha);
        },
        prefijos(cadena){
            let terminacion = cadena.split(' ').slice(-1)[0]
            let palabras = cadena.split(" ");
            terminacion = terminacion.length > 2 ? '' : terminacion;
            let letras = palabras.map(palabra => {
                let quitarEN = palabra.replace('EN', '');
                let quitarTerminacion = quitarEN.replace(terminacion, '');
                 return quitarTerminacion.charAt(0);
            });
            return letras.join("")+terminacion
        },
       
        calcularTiempoTranscurrido(fechaInicialStr){
             // Validar que la entrada sea una cadena no vacía
            if (!fechaInicialStr || typeof fechaInicialStr !== 'string') {
                return "La fecha no está definida";
            }

            // Convertir la cadena a objeto Date
            const fechaInicial = new Date(fechaInicialStr);

            // Validar que la fecha sea válida
            if (isNaN(fechaInicial.getTime())) {
                return "La fecha no es válida.";
            }

            const fechaActual = new Date();
            // Normalizar a UTC para evitar problemas de zona horaria
            const diferencia = fechaActual.getTime() - fechaInicial.getTime();

            // Verificar si la fecha es futura
            if (diferencia < 0) {
                return "La fecha en el futuro.";
            }

            // Calcular unidades de tiempo
            const segundos = Math.floor(diferencia / 1000);
            const minutos = Math.floor(segundos / 60);
            const horas = Math.floor(minutos / 60);
            const dias = Math.floor(horas / 24);
            const meses = Math.floor(dias / 30.42); // Promedio de días por mes
            const años = Math.floor(meses / 12);

            // Construir la cadena de resultado
            const partes = [];
            if (años > 0) {
                partes.push(`${años} año${años > 1 ? 's' : ''}`);
            }
            if (meses % 12 > 0 || años > 0) {
                partes.push(`${meses % 12} mes${meses % 12 > 1 ? 'es' : ''}`);
            }
            if (dias % 30 > 0 || meses > 0) {
                partes.push(`${dias % 30} día${dias % 30 > 1 ? 's' : ''}`);
            }
            if (horas % 24 > 0 || dias > 0) {
                partes.push(`${horas % 24} hora${horas % 24 > 1 ? 's' : ''}`);
            }
            if (minutos % 60 > 0 || horas > 0) {
                partes.push(`${minutos % 60} minuto${minutos % 60 > 1 ? 's' : ''}`);
            }
            if (segundos % 60 > 0 || minutos > 0) {
                partes.push(`${segundos % 60} segundo${segundos % 60 > 1 ? 's' : ''}`);
            }

            // Si no hay partes, significa que el tiempo transcurrido es menor a 1 segundo
            if (partes.length === 0) {
                return "Menos de un segundo";
            }

            // Unir las partes con comas y agregar "y" antes de la última
            if (partes.length === 1) {
                return partes[0];
            }
            return partes.slice(0, -1).join(", ") + " y " + partes[partes.length - 1];
        },
      
        
        async iniciar(){
                this.iniciarProceso = true;

                let token = this.$session.get('token')

                let json = {
                    "idLavadora": this.tipoLavadora,
                    "idMotivoMaquinada": this.idMotivoMaquinada,

                    "prendas": [{
                        "idOrdenPrenda": this.data.idOrdenPrenda,
                        "cantidad": this.cantidad,
                        "idPasoProceso": this.data.idPaso,
                    }],
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
                    this.iniciarProceso = false;

                    this.refresh()
                    this.modalIniciar = false
                    this.tipoLavadora = ''
                    this.cantidad = ''
                    this.idMotivoMaquinada = ''
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha iniciado el proceso correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.mostrarDetailPrendas(this.data.idPrenda)
                    this.$emit('updatePage', '200')
                    this.idLavadora = ''
                }else{
                    this.iniciarProceso = false;
                    this.openNotification(`Error: inesperado`, data.mensaje, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`, 'none')

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
        openNotification( title, text, color, position = null, icon, duration = '6000') {
          this.$vs.notification({
            duration,
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
<style scoped>
body {
    font-family: "Poppins", sans-serif;
    height: 100vh;
    background: #f1f1f1 !important;
}

input {
    width: 90%;
}
.vs-select .vs-select--state-null{
    max-width: 100% !important;
}

.card {
    min-height: 4rem !important;
}

.dropdown-menu {
  border-radius: 8px !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
ul .dropdown-menu .show{
    position: absolute;
    transform: translate3d(-5px, 44px, 0px);
    top: 0px;
    right: 0px !important;
    will-change: transform;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.mt{
    margin-top: -4.5rem;
}

.fixed{
    display: flex;
}
.top{
    position: absolute;
    top: 10px;
    right: 0;
}
.form-select{
    width: 95%;
    border-radius: 1rem;
    height: 1rem;
}



</style>
<style lang="stylus">

getColor(colorx, alpha = 1)
    unquote("rgba(var(--vs-"+colorx+"), "+alpha+")")
getVar(var)
    unquote("var(--vs-"+var+")")

.alert-example
    .vs-button--active
        transform translate(0, -5px)
        border-radius 0px 0px 12px 12px

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