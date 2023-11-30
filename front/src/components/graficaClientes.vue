<template>
    <div>
        <b-card title="Frecuencia de los clientes">
            <apexchart-all type="bar" height="350" :options="chartOptionsejemplo" :series="seriesejemplo"></apexchart-all>

            <!-- <apexchart-all type="line" height="450" :options="chartOptionsBarCode" :series="seriesBarCode"></apexchart-all> -->
        </b-card>
    </div>
</template>
  
<script>
// import { fetchApi } from "@/service/service.js"
export default {
    name:"graficaClientes",
    props: {
        data: Object,
    },
    data: () => ({
        url: process.env.VUE_APP_SERVICE_URL_API,
        reload: false,
        seriesejemplo: [ ],
        chartOptionsejemplo: {
          chart: {
            height: 350,
            type: 'bar'
          },
          plotOptions: {
            bar: {
              columnWidth: '60%'
            }
          },
          colors: ['#4eeba2'],
          dataLabels: {
            enabled: false
          },
          legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: ['Mes Actual', 'Mes Pasado'],
            markers: {
              fillColors: ['#4eeba2', '#fb5f4f']
            }
          }
        },
        
        
    }),
    mounted(){
        this.seriesejemplo = [{
          name: 'Mes Actual',
          data: [ this.data.clientesGraf ]
        }]
        console.log(this.data.clientesGraf)
        
    },
    methods: {
        
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
    /* height: 20rem; */
}

</style>