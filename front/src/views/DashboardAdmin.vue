<template>
    <div>
        <HeaderComponent/>
        <br>
        <b-container class="bv-example-row mt-5">
            <hr>
            <h2 class="mt-3 mb-5">Lavadoras en Uso</h2>
            <b-row >
                <b-col
                    class="mt-4"
                    lg="6"
                    md="12"
                    sm="12"
                    v-for="lavadora in Lavadoras"
                    :key="lavadora.idLavadora"
                    >
                    <b-card
                        :title="'Lavadora ' + lavadora.lavadora"
                        :sub-title="lavadora.tipoLavado"
                        :style="{ 'border-left': `solid 5px #0d6efd` }"
                    >
                        <apexchart-all type="radialBar" :options="chartOptions" :series="[lavadora.capacidad]"></apexchart-all>

                        <div
                            class="d-flex flex-row align-items-center mt-4 w-100 justify-content-center"
                        >
                            <img
                                src="@/assets/lavadora.svg"
                                alt="lavadora"
                                width="250"
                                height="250"
                                class="me-4"
                            />

                            <div>
                                <p class="mb-1">
                                    <strong>Cliente(s):</strong>
                                </p>
                                <div
                                    class="badge bg-primary text-wrap m-1"
                                    v-for="(cliente, index) in lavadora.clientes"
                                    :key="lavadora.idLavadora + '-cliente-' + index"
                                >
                                    {{ cliente }}
                                </div>
                                <hr />

                                <p class="mb-1">
                                    <strong>Prenda(s):</strong>
                                </p>
                                <div
                                    class="badge bg-primary text-wrap m-1"
                                    v-for="(prenda, index) in lavadora.prendas"
                                    :key="lavadora.idLavadora + '-prenda-' + index"
                                >
                                    {{ prenda }}
                                </div>
                                <hr />

                                <p class="mb-0">
                                    <strong>Peso total:</strong> {{ lavadora.kilos }} kg
                                </p>
                            </div>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
           
            <hr>
            <h2 class="mt-3 mb-5">Ordenes en Proceso</h2>
            
             <b-row >
                <b-col
                    class="mt-4"
                    lg="6"
                    md="12"
                    sm="12"
                    v-for="orden in ordenes"
                    :key="orden.id"
                    >
                    <b-card
                        :title="orden.cliente"
                        :sub-title="'Folio '+orden.numEnvio"
                        :style="{ 'border-left': `solid 5px #0d6efd` }"
                    >   
                        <div>
                            <p class="mb-1">
                                <strong>Orden Recibida: {{ obtenerFechaBonita(orden.recibido) }}</strong>
                            </p>
                            <p class="mb-1">
                                <strong>Orden Entrega: {{ obtenerFechaBonita(orden.fechaEntrega) }}</strong>
                            </p>
                        </div>

                        <apexchart-all type="radialBar" :options="chartOptions" :series="[Number(orden.avance).toFixed(2)]"></apexchart-all>
                        <hr>
                        <apexchart-all type="bar" height="350" :options="orden.chartOptionsOrdenes" :series="orden.series"></apexchart-all>

                        
                    </b-card>
                </b-col>
            </b-row>
            
            <hr>
            <h2 class="mt-3 mb-5">Acumulado Mensual y Anual</h2>
            
            <b-row>
                <b-col class="mt-4" lg="12" md="12" sm="12" >
                     <b-card>
                        <div id="chart">
                           <apexchart-all type="bar" height="350" :options="chartOptionsMensual" :series="seriesMensual"></apexchart-all>
                       </div>
                    </b-card>
                </b-col>

                <b-col class="mt-4" lg="12" md="12" sm="12" >
                    <b-card>
                        <div id="chart">
                           <apexchart-all type="bar" height="350" :options="chartOptionsAnual" :series="seriesAnual"></apexchart-all>
                       </div>
                    </b-card>
                </b-col>
               
            
            </b-row>

        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import loginComponent from '@/components/cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"


export default {
    name:"DashboardView",
    
    components: {
        HeaderComponent,
        // CalendarComponent,
        loginComponent
    },
    data: () => ({
        url: process.env.VUE_APP_SERVICE_URL_API,
        "reload":true,
        activarReboot: false,

        cliente: "",
        tipoLavado: "",
        prenda: "",
        pesoTotal: 0,

        // datos del donut
        Lavadoras: [],
        ordenes: [],

        chartOptionsMensual: {
            chart: {
                type: 'bar',
                height: 500
            },
            plotOptions: {
                bar: {
                horizontal: true, // 🔹 barras horizontales
                dataLabels: {
                    position: 'right'
                }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val; // 🔹 muestra directamente el número de órdenes
                }
            },
            xaxis: {
                title: {
                text: 'Órdenes Mensuales, Top 15. '
                }
            },
            yaxis: {
                labels: {
                style: {
                    fontSize: '12px'
                }
                }
            }
        },
        seriesMensual: [],


        chartOptionsAnual: {
            chart: {
                type: 'bar',
                height: 500
            },
            plotOptions: {
                bar: {
                    horizontal: true, // 🔹 barras horizontales
                    dataLabels: {
                        position: 'right'
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val; // 🔹 muestra directamente el número de órdenes
                }
            },
            xaxis: {
                title: {
                    text: 'Órdenes Anuales, Top 15. '
                }
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: '12px'
                    }
                }
            }
        },
        seriesAnual: [],


        series: [],
        chartOptions: {
            chart: {
                type: 'radialBar',
                offsetY: -20,
                sparkline: {
                enabled: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: "#e7e7e7",
                        strokeWidth: '97%',
                        margin: 5, // margin is in pixels
                        dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        color: '#444',
                        opacity: 1,
                        blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            offsetY: -2,
                            fontSize: '22px'
                        }
                    }
                }
            },
            grid: {
                padding: {
                top: -10
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                shade: 'light',
                shadeIntensity: 0.4,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 53, 91]
                },
            },
            labels: ['Average Results'],
        },
    
        
    }),
    
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        setTimeout(() => {
            this.reload = false
        }, 4000);
        this.getDetalles()
    },
    
    methods:{
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        limitDec(data){
            let capacidad4dec = parseFloat(data).toFixed(2)
            return capacidad4dec
        },
        async getDetalles(){
            fetchApi(this.url+`orden/dashboard/`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    // console.log(data)
                    const lavadorasFormateadas = data.datos.lavadoras
                    .filter(l => l.estado === 'OCUPADO') // 🔹 solo las ocupadas
                    .map(l => ({
                        ...l,
                        capacidad: Number(l.capacidad.toFixed(2)) // redondea a 2 decimales
                    }));
                    this.Lavadoras = lavadorasFormateadas

                    const clientesFormateadosMensual = data.datos.clientes
                    .filter(c => c.ordenesMes > 0) // 🔹 solo los clientes con ordenes
                    .map(c => ({
                        ...c,
                        ordenesMes: Number(c.ordenesMes) // 🔹 asegura que sea número
                    }))
                    .sort((a, b) => b.ordenesMes - a.ordenesMes) // 🔹 mayor a menor
                    .slice(0, 15); // 🔹 solo top 10
                    // 🔹 ahora construyes la serie de ApexCharts
                    this.seriesMensual = [{
                        name: 'Órdenes Mensuales',
                        data: clientesFormateadosMensual.map(c => ({
                            x: c.cliente,        // etiqueta en el eje X
                            y: c.ordenesMes     // valor numérico
                        }))
                    }];

                    

                    const clientesFormateadosAnual = data.datos.clientes
                    .filter(c => c.ordenesAnio > 0)
                    .map(c => ({
                        ...c,
                        ordenesAnio: Number(c.ordenesAnio)
                    }))
                    .sort((a, b) => b.ordenesAnio - a.ordenesAnio) // mayor a menor
                    .slice(0, 15); // top 15

                    // 🔹 ahora construyes la serie de ApexCharts
                    this.seriesAnual = [{
                        name: 'Órdenes Anuales',
                        data: clientesFormateadosAnual.map(c => ({
                            x: c.cliente,        // etiqueta en el eje X
                            y: c.ordenesAnio     // valor numérico
                        }))
                    }];


                    const ordenesClientes = data.datos.ordenes
                    .map(c => ({
                        ...c,
                        prendasProcesando: c.ordenes.map(o => [o.prendasProcesando]),
                        prendasTerminadas: c.ordenes.map(o => [o.prendasProcesando]),
                        totalPrendas: c.ordenes.map(o => [o.prendasProcesando]),
                       

                        series: [{
                            name: 'Porcentaje Avance',
                           data: c.ordenes.map(o => Number(o.avance.toFixed(2)))
                       }],
                        chartOptionsOrdenes: {

                            chart: {
                                type: 'bar',
                                height: 10
                            },
                            plotOptions: {
                                bar: {
                                    borderRadius: 1,
                                    borderRadiusApplication: 'end',
                                    horizontal: true,
                                }
                            },
                            dataLabels: {
                                enabled: true,
                                formatter: function (val) {
                                    return val; // 🔹 muestra directamente el número de órdenes
                                }
                            },
                            xaxis: {
                                categories: c.ordenes.map(o => o.prenda),
                            },
                            yaxis: {
                                labels: {
                                    style: {
                                        fontSize: '9px'
                                    }
                                }
                            }
                        },

                    }))
                    this.ordenes = ordenesClientes
                    console.log(this.ordenes)
                }
            })
        },
        obtenerFechaBonita(fechaParametro) {
            const fecha = new Date(fechaParametro);

            const opciones = {
                day: '2-digit',  
                month: '2-digit',
                year: 'numeric',
            };

            const formatoFecha = new Intl.DateTimeFormat('es-ES', opciones);

            return formatoFecha.format(fecha);
        },
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
.cardKM{
    display: grid;
    place-items: center;
}
</style>