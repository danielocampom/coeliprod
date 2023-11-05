<template>
    <div>
        <HeaderComponent/>
        <br>

        <div class="container">
            <b-row class="container">
                <!-- <b-col md="6" sm="6">
                    <div id="camera-container" class="mt-5 container">
                        <video id="video" autoplay></video>
                        <div v-if="showDetectionBox" :style="detectionBoxStyle" class="detection-box"></div>
                    </div>
                </b-col>                 -->
                <b-col md="5" sm="5" class="mt-5 container p-3">
                    <b-card title="Buscar estado de la prenda">
                        <div class="row">
                            <div class="col">
                                <vs-input
                                    class="mt-5 buscarPrenda"
                                    primary
                                    label-placeholder="Numero de la papeleta"
                                    v-model="buscarPrenda" pattern="[0-9]*">
                                    <template #icon>
                                        <box-icon name='barcode-reader'></box-icon>
                                    </template>
                                </vs-input>
                            </div>
                            <div class="col">
                                <vs-button
                                    class="mt-5"
                                    success
                                    circle
                                    @click="buscar"
                                >
                                    <box-icon name='search-alt-2' color="#fff"></box-icon>
                                </vs-button>
                            </div>
                        </div>
                    </b-card>
                    
                </b-col>
                <b-col md="7" sm="7" class="mt-5 container p-3">
                    <b-card v-if="mostrarInfo" :title="cliente" :sub-title="cantidadTotal">
                        <div class="badge bg-success text-wrap float-end" >
                            {{ nombreEstado }}
                        </div>
                        <p>
                            <label for="Ingreso">
                                <strong>Igreso:</strong> {{ fecha(new Date(fechaAlta)) }} 
                            </label><br>
                            <label for="Ingreso">
                                <strong>Ultimo Estado:</strong> {{ calcularTiempoTranscurrido(new Date(ultimoEstado)) }} 
                            </label>
                        </p>
                        <hr>
                        <v-timeline dense clipped >
                            <v-timeline-item fill-dot class="white--text mb-12" color="orange" large>
                                <template v-slot:icon>
                                    <span><box-icon name='shower'></box-icon></span>
                                </template>
                            </v-timeline-item>
                            <br>
                            <v-timeline-item class="mb-4" color="primary" icon-color="grey lighten-2" small  v-for="(pa, i) in pasosAnt" :key="i">
                                <b-card :title="pa.nombre" :sub-title="pa.descripcion">
                                    <div class="badge bg-danger text-wrap float-end" >
                                        {{ pa.estado }}
                                    </div>
                                    <p>
                                        <label for="Cantidad">
                                            <strong>Cantidad:</strong>{{ pa.cantidad }}
                                        </label><br>
                                        <label for="Prenda">
                                            <strong>Prenda:</strong>{{ pa.nombrePrenda }}
                                        </label><br>
                                        <label for="pasoProceso">
                                            <strong>Proceso:</strong>{{ pa.pasoProceso.nombre }}<br>
                                            <strong>Descripcion:</strong>{{ pa.pasoProceso.descripcion }}
                                        </label>
                                    </p>
                                </b-card>
                            </v-timeline-item>
                            <v-timeline-item class="mb-4" color="primary" icon-color="grey lighten-2" small  v-for="(pr, i) in pasosRestantes" :key="i">
                                <b-card :title="pr.nombre" :sub-title="pr.descripcion"></b-card>
                            </v-timeline-item>
                        </v-timeline>

                    </b-card>
                        <div class="center" v-else>
                            <vs-alert color="danger">
                                <template #title>
                                    Sin datos, ingrese el codigo el codigo de barras
                                </template>
                            </vs-alert>
                        </div>
                </b-col>
            </b-row>

        </div>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>  
    </div>
</template>
  
<script>
    import HeaderComponent from '@/components/Header.vue';
    import Quagga from 'quagga';
    import loginComponent from '@/components/cardLogin.vue';
    import { refreshSession, fetchApi } from "@/service/service.js"

    export default {
        data:() => ({
            mostrarInfo: false,
            buscarPrenda: '',
            cantidadTotal: '',
            nombreEstado: '',
            ultimoEstado: '',
            fechaAlta: '',
            pasosAnt: [],
            pasosRestantes: [],
            showDetectionBox: false,
            detectionBoxStyle: {
                left: '0px',
                top: '0px',
                width: '0px',
                height: '0px',
            },
            cliente: '',
            url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
        }),
        components: {
            HeaderComponent,
            loginComponent

        },
        created(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            })
        },
        methods: {
            refresh(){
                refreshSession(this.url ,this.$session.get('token')).then( data => {
                    this.$session.start()
                    this.$session.set('token', data.datos.token)
                }) 
            },
            fecha(fecha){
                const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(fecha).toLocaleDateString(undefined, opciones);
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
            async buscar(){
                if(this.buscarPrenda != ''){
                    this.mostrarInfo = true;
                    let t = this
                    fetchApi(this.url+`orden/findByIdOrdenPrenda/${this.buscarPrenda}`, 'GET', this.$session.get('token'))
                    .then(data => {
                        if(data.status == 200){

                            this.cliente = data.datos.nomCliente
                            this.cantidadTotal = 'Cantidad total de prendas '+data.datos.cantidad
                            this.nombreEstado = data.datos.nombreEstado
                            this.ultimoEstado = data.datos.ultimoEstado
                            this.fechaAlta = data.datos.fechaAlta
                            // console.log(data.datos)
                            let idsPasos = [] 
                            this.pasosAnt = data.datos.historial
                            this.pasosAnt.forEach(element => {
                                idsPasos.push(element.pasoProceso.id)
                            });
                            fetchApi(this.url+`prenda/findById/${data.datos.idPrenda}`, 'GET', this.$session.get('token'))
                            .then(dataPenda => {
                                let pasos = [] 
                                pasos = dataPenda.datos.proceso.pasos
                                const objetosFiltrados = pasos.filter(objeto => !idsPasos.includes(objeto.id));
                                t.pasosRestantes = objetosFiltrados
                                // console.log(objetosFiltrados)
                            })
                        }else{
                            this.mostrarInfo = false;

                            this.openNotification(`Ooops!:`, `No existes coincidencias`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                        }
                    })
                }else{
                    this.mostrarInfo = false;

                    this.openNotification(`Ooops! Error:`, `Es requerido un dato`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
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
            },
            requestCameraAccess() {
                const videoElement = document.getElementById('video');
        
                navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    videoElement.srcObject = stream;
                    this.startDetection();
                })
                .catch((error) => {
                    console.error('Error al acceder a la cámara:', error);
                });
            },
            startDetection() {
                Quagga.init(
                {
                    inputStream: {
                    name: 'Live',
                    type: 'LiveStream',
                    target: document.querySelector('#video'),
                    },
                    frequency: 10, // Ajusta la frecuencia según sea necesario
                    decoder: {
                    readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'],
                    },
                },
                (err) => {
                    if (err) {
                    console.error(err);
                    return;
                    }
                    Quagga.start();
                }
                );
        
                Quagga.onDetected((result) => {
                this.showDetectionBox = true;
                const { codeResult, line } = result;
        
                const topLeft = line.reduce((acc, point) => {
                    return {
                    x: (point.x < acc.x) ? point.x : acc.x,
                    y: (point.y < acc.y) ? point.y : acc.y,
                    };
                }, { x: Infinity, y: Infinity });
        
                const bottomRight = line.reduce((acc, point) => {
                    return {
                    x: (point.x > acc.x) ? point.x : acc.x,
                    y: (point.y > acc.y) ? point.y : acc.y,
                    };
                }, { x: 0, y: 0 });
        
                this.detectionBoxStyle = {
                    left: `${topLeft.x}px`,
                    top: `${topLeft.y}px`,
                    width: `${bottomRight.x - topLeft.x}px`,
                    height: `${bottomRight.y - topLeft.y}px`,
                };
        
                // También puedes tomar medidas adicionales, como mostrar el valor del código de barras detectado.
                console.log(`Código de barras detectado: ${codeResult.code}`);
                });
            },
        },
        mounted() {
            this.requestCameraAccess();
        },
    };
</script>
  
<style scoped>
  #camera-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .detection-box {
    position: absolute;
    border: 8px solid #6c3 ;
    box-sizing: border-box;
    pointer-events: none;
  }
  .buscarPrenda{
    width: 90%;
  }
</style>
  