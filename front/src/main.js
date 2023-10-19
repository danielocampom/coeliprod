import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2'
import VueSession from 'vue-session'
import Vuesax from 'vuesax'
import fullCalendar from 'vue-fullcalendar'
import VueApexCharts from 'vue-apexcharts'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'vuesax/dist/vuesax.css'
import 'boxicons'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// Make BootstrapVue available throughout your project
Vue.config.productionTip = false

Vue.use(VueApexCharts)
Vue.use(Vuetify)
Vue.use(BootstrapVue,{
  locale: 'es'
})
Vue.use(IconsPlugin)
Vue.use(VueSweetalert2);
Vue.use(VueSession)
Vue.use(Vuesax)
Vue.component('full-calendar', fullCalendar)
Vue.component('apexchart-all', VueApexCharts)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
