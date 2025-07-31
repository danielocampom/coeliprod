<template>
  <div class="container mt-4">
    <b-container fluid>
      <!-- Filtros y controles -->
      <b-row class="align-items-end mb-3">
        <b-col md="6" sm="12">
          <b-form-group
            label="Registros por página"
            label-for="per-page-select"
            label-cols-sm="6"
            label-cols-md="4"
            label-align-sm="right"
            label-size="sm"
          >
            <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              size="sm"
              class="custom-select"
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group
            label="Buscar"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
          >
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Buscar por material"
                @input="onFilter"
              />
              <b-input-group-append>
                <b-button :disabled="!filter" @click="clearFilter" variant="danger">X</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Tabla -->
      <b-table
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        :busy="isLoading"
        label-sort-asc="Ordenar ascendente"
        label-sort-desc="Ordenar descendente"
        label-sort-clear="Limpiar orden"
        stacked="md"
        show-empty
        empty-text="No hay datos disponibles"
        small
        hover
        bordered
        @filtered="onFiltered"
      >
        <!-- Estado de carga -->
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle" />
            <strong> Cargando...</strong>
          </div>
        </template>

        <!-- Columna de acciones -->
        <template #cell(actions)="row">
          <div class="d-flex justify-content-center">
            <btn-update-catalogo @updatePage="updatePage" :data="{ id: row.item.id, material: row.item.material }" />
          </div>
        </template>

        <!-- Detalles de fila -->
        <template #row-details="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
            </ul>
          </b-card>
        </template>
      </b-table>

      <!-- Paginación -->
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
        class="my-3"
      />
    </b-container>

    <!-- Modal de login si la sesión expira -->
    <login-component v-if="showLogin" :login="showLogin" @session-restored="handleSessionRestored" />
  </div>
</template>

<script>
import BtnUpdateCatalogo from '@/components/btn_update_catalogo_material.vue';
import LoginComponent from '@/components/cardLogin.vue';
import { fetchApi, refreshSession } from '@/service/service.js';

export default {
  name: 'CatalogoMaterial',
  components: {
    BtnUpdateCatalogo,
    LoginComponent,
  },
  props: {
    refreshKey: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fields: [
        { key: 'material', label: 'Material', sortable: true, sortDirection: 'desc' },
        { key: 'actions', label: 'Acciones', sortable: false },
      ],
      items: [],
      totalRows: 0,
      currentPage: 1,
      perPage: 5,
      pageOptions: [
        { value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 15, text: '15' },
        { value: 100, text: 'Mostrar Todo' },
      ],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: '',
      filterOn: ['material'],
      isLoading: false,
      showLogin: false,
      apiUrl: process.env.VUE_APP_SERVICE_URL_API,
    };
  },
  watch: {
    refreshKey() {
      this.fetchData();
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      try {
        const response = await fetchApi(`${this.apiUrl}prenda/material/get`, 'GET', this.$session.get('token'));
        if (response.status === 401) {
          this.showLogin = true;
          return;
        }
        if (response.status === 200) {
          this.items = response.datos;
          this.totalRows = this.items.length;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        this.$bvToast.toast('Error al cargar los datos', { variant: 'danger', solid: true });
      } finally {
        this.isLoading = false;
      }
    },
    async refreshSession() {
      try {
        const data = await refreshSession(this.apiUrl, this.$session.get('token'));
        this.$session.start();
        this.$session.set('token', data.datos.token);
        this.showLogin = false;
        await this.fetchData();
      } catch (error) {
        console.error('Error refreshing session:', error);
        this.$bvToast.toast('Error al renovar la sesión', { variant: 'danger', solid: true });
      }
    },
    handleSessionRestored() {
      this.refreshSession();
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    clearFilter() {
      this.filter = '';
    },
    onFilter() {
      this.currentPage = 1;
    },
    async updatePage(status) {
      console.log('Evento update-page recibido con status:', status); // Depuración
      if (status == 200) {
        await this.fetchData();
      } else {
        this.$bvToast.toast('Error al actualizar la página', { variant: 'danger', solid: true });
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 1rem;
}
</style>