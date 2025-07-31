<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-4 container">
            
            <b-row class="align-items-end">
                
                <b-col md="4" sm="12">
                    <vs-button flat block icon @click="activeModal=!activeModal">
                        <box-icon name='wind' color="#195bff"></box-icon> Agregar Catalogo
                    </vs-button>
                    <vs-dialog v-model="activeModal">
                        <template #header>
                        <h4 class="not-margin">
                            Registrar <b>Catalogo</b>
                        </h4>
                        </template>
            
                        <div class="con-form">
                            <div class="con-selects mt-5">
                                <v-select
                                    v-model="tipoCatalogo"
                                    :options="tiposCatalogos"
                                    label="nombre"
                                    placeholder="Tipo de Catalogo"
                                    :reduce="option => option.id"
                                    :searchable="true"
                                    :clearable="false"
                                />
                            </div>
                            <vs-input class="mt-5" success type="text" v-model="nombre" label-placeholder="Nombre del Catalogo">
                                <template #icon>
                                    <box-icon name='book'></box-icon>
                                </template>
                            </vs-input>
                          
                           
                        </div>
                        <br>
                        <template #footer>
                            <div class="footer-dialog">
                                <vs-button block success
                                    flat
                                    :btnGuardar="btnGuardar == 1"
                                    @click="addCatalogo()">
                                    Guardar
                                </vs-button>
                            </div>
                        </template>
                    </vs-dialog>
                </b-col>
                <b-col md="8" sm="12"></b-col>

            </b-row>
           

            <h3>Catalogo Familia</h3>
            <tableCatalogosFamilia :refresh-key="refreshKeyFamilia"></tableCatalogosFamilia>
            <h3>Catalogo Material</h3>
            <tableCatalogosMaterial :refresh-key="refreshKeyMaterial"></tableCatalogosMaterial>
          

        </b-container>
        <br>
        
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
         
    </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import HeaderComponent from '@/components/Header.vue';
import tableCatalogosFamilia from '@/components/tableCatalogo_Familia.vue'
import tableCatalogosMaterial from '@/components/tableCatalogo_Material.vue'
import { refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    name:"PrendasView",
    data: () => ({

        tiposCatalogos: [
            {"id": 0, "nombre": 'Familia'}, 
            {"id": 1, "nombre": 'Material'}, 
        ],
        tipoCatalogo: '',
        nombre: '',

        activeModal: false,
        btnGuardar: 0,

        refreshKeyFamilia: 0, // Clave para familias
        refreshKeyMaterial: 0, // Clave para materiales

        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        tableCatalogosFamilia,
        tableCatalogosMaterial,
        loginComponent,
        vSelect
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    

    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRowsF = filteredItems.length
            this.currentPageF = 1
        },
        
        
        async addCatalogo(){

            if(this.tipoCatalogo == '' && this.nombre == ''){
                this.openNotification(
                    'Error: Campos Vacios',
                    'Por favor, complete todos los campos',
                    'danger',
                    'top-left',
                    `<box-icon name='bug' color="#fff"></box-icon>`
                );
                return;
            }

            const token = this.$session.get('token');
            const tipo = this.tipoCatalogo == 0 ? 'familia' : 'material';
            const json = { [tipo]: this.nombre };

            try {
                const res = await fetch(`${this.url}prenda/${tipo}/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': token,
                    },
                    body: JSON.stringify(json),
                });
                const data = await res.json();

                if (data.status === 401) {
                    this.activarReboot = true;
                    return;
                }

                if (data.status === 200) {
                    if (tipo === 'familia') {
                        this.refreshKeyFamilia += 1;
                    } else {
                        this.refreshKeyMaterial += 1;
                    }
                    this.nombre = '';
                    this.tipoCatalogo = '';
                    this.activeModal = false;
                    this.openNotification(
                        `Éxito: ${data.mensaje}`,
                        `Se ha registrado correctamente el ${tipo}`,
                        'success',
                        'top-left',
                        `<box-icon name='check' color="#fff"></box-icon>`
                    );
                } else {
                    console.warn(data);
                    this.openNotification(
                        'Error: Inesperado',
                        'Si el problema persiste, comuníquese con el administrador',
                        'danger',
                        'top-left',
                        `<box-icon name='bug' color="#fff"></box-icon>`
                    );
                }
            } catch (error) {
                console.error(error);
                this.openNotification(
                    'Error: Inesperado',
                    'Si el problema persiste, comuníquese con el administrador',
                    'danger',
                    'top-left',
                    `<box-icon name='bug' color="#fff"></box-icon>`
                );
            }
        },
        async updatePage(status){
            if(status == 200){
                console.log("actualizado")
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
.vs-select .vs-select--state-null{
    max-width: 100% !important;
}
.ml-5 .vs-card{
    margin-left: auto!important
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
.v-select.vs--single.vs--searchable {
    margin-top:-4px;
}
input[type="search"] {
    padding: 10px;
    border: 1px solid #f6f6f6;
    border-radius: 4px;
    outline: none;
}

input[type="search"]:focus {
    border-color: #f6f6f6;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); 
}
.centerAll{
    display: grid;
    place-items: center;
}

.card{
    border-radius: 1rem;
}
.vs-input{
    width: 100%;
}


</style>