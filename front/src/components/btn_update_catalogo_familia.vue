<template>
  <div>
    <vs-button circle icon floating primary @click="dataModal = !dataModal">
      <box-icon name="edit" color="#fff"></box-icon>
    </vs-button>
    <vs-dialog blur v-model="dataModal">
      <template #header>
        <h4 class="not-margin">
          Editar <b>Familia</b>
        </h4>
      </template>

      <div class="con-form">
        <vs-input
          class="mt-3"
          success
          type="text"
          v-model="familia"
          label-placeholder="Nombre de la Familia"
        >
          <template #icon>
            <box-icon name="book"></box-icon>
          </template>
        </vs-input>
      </div>

      <template #footer>
        <div class="con-footer mt-4">
          <vs-button class="m-1" success flat @click="update">
            Actualizar
          </vs-button>
          <div>
            <vs-button
              class="m-1"
              danger
              flat
              @click="modalDelete = !modalDelete"
            >
              Eliminar
            </vs-button>
          </div>
        </div>
      </template>
    </vs-dialog>

    <vs-dialog v-model="modalDelete">
      <template #header>
        <h4 class="not-margin">
          ¿Estás seguro que deseas <b>eliminarlo?</b>
        </h4>
      </template>
      <ConfirmComponent @confirm="deletePrenda" />
    </vs-dialog>
    <div v-if="activarReboot">
      <loginComponent :login="activarReboot" />
    </div>
  </div>
</template>

<script>
import ConfirmComponent from "@/components/confirm.vue";
import { refreshSession } from "@/service/service.js";
import loginComponent from "./cardLogin.vue";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dataModal: false,
    modalDelete: false,
    familia: "",
    url: process.env.VUE_APP_SERVICE_URL_API,
    activarReboot: false,
  }),
  components: {
    ConfirmComponent,
    loginComponent,
  },
  watch: {
    // Observa cambios en la prop 'data' para actualizar 'familia'
    "data.familia"(newValue) {
      this.familia = newValue || "";
    },
  },
  mounted() {
    // Inicializa 'familia' con el valor de la prop
    this.familia = this.data.familia || "";
  },
  methods: {
    async refresh() {
      try {
        const data = await refreshSession(this.url, this.$session.get("token"));
        this.$session.start();
        this.$session.set("token", data.datos.token);
        this.activarReboot = false;
      } catch (error) {
        console.error("Error refreshing session:", error);
        this.openNotification(
          "Error",
          "No se pudo renovar la sesión",
          "danger",
          "top-left",
          `<box-icon name='bug' color="#fff"></box-icon>`
        );
      }
    },
    async deletePrenda(status) {
      if (status == 200) {
        let token = this.$session.get("token");
        try {
          const res = await fetch(
            `${this.url}prenda/familia/del/${this.data.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: token,
              },
            }
          );
          const data = await res.json();
          if (data.status == 401) {
            this.activarReboot = true;
            return;
          }
          if (data.status == 200) {
            await this.refresh();
            this.modalDelete = false;
            this.dataModal = false;
            this.$emit("updatePage", "200");
            this.openNotification(
              `Éxito: ${data.mensaje}`,
              `Se ha eliminado correctamente`,
              "success",
              "top-left",
              `<box-icon name='check' color="#fff"></box-icon>`
            );
          } else {
            this.openNotification(
              `Error: ${data.mensaje || "Inesperado"}`,
              `Si el problema persiste, comuníquese con el administrador`,
              "danger",
              "top-left",
              `<box-icon name='bug' color="#fff"></box-icon>`
            );
          }
        } catch (error) {
          console.error("Error deleting prenda:", error);
          this.openNotification(
            "Error",
            "No se pudo eliminar la familia",
            "danger",
            "top-left",
            `<box-icon name='bug' color="#fff"></box-icon>`
          );
        }
      }
    },
    async update() {
      if (!this.familia.trim()) {
        this.openNotification(
          "Error",
          "El nombre de la familia no puede estar vacío",
          "danger",
          "top-left",
          `<box-icon name='bug' color="#fff"></box-icon>`
        );
        return;
      }
      let token = this.$session.get("token");
      let json = {
        id: this.data.id,
        familia: this.familia,
      };
      try {
        let res = await fetch(`${this.url}prenda/familia/edt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: token,
          },
          body: JSON.stringify(json),
        });
        let data = await res.json();
        if (data.status == 401) {
          this.activarReboot = true;
          return;
        }
        if (data.status == 200) {
          await this.refresh();
          this.dataModal = false;
          this.$emit("updatePage", "200");
          this.openNotification(
            `Éxito: ${data.mensaje}`,
            `Se ha actualizado correctamente`,
            "success",
            "top-left",
            `<box-icon name='check' color="#fff"></box-icon>`
          );
        } else {
          this.openNotification(
            `Error: ${data.mensaje || "Inesperado"}`,
            `Si el problema persiste, comuníquese con el administrador`,
            "danger",
            "top-left",
            `<box-icon name='bug' color="#fff"></box-icon>`
          );
        }
      } catch (error) {
        console.error("Error updating prenda:", error);
        this.openNotification(
          "Error",
          "No se pudo actualizar la familia",
          "danger",
          "top-left",
          `<box-icon name='bug' color="#fff"></box-icon>`
        );
      }
    },
    openNotification(title, text, color, position = null, icon) {
      this.$vs.notification({
        progress: "auto",
        icon,
        color,
        position,
        title,
        text,
      });
    },
  },
};
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
.card {
  border-radius: 1rem;
}
.ml-5 .vs-card {
  margin-left: auto !important;
}
.centerAll {
  display: grid;
  place-items: center;
}
.vs-card {
  padding: 0.5rem;
}
.vs-input {
  width: 95%;
}
.v-select.vs--single.vs--searchable {
  margin-top: -4px;
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
</style>
<style lang="stylus">
getColor(vsColor, alpha = 1)
  unquote("rgba(var(--vs-" + vsColor + "), " + alpha + ")")
getVar(var)
  unquote("var(--vs-" + var + ")")
.con-footer
  display flex
  align-items center
  justify-content flex-end
  .vs-button
    margin 0px
    .vs-button__content
      padding 10px 30px
    ~ .vs-button
      margin-left 10px
.not-margin
  margin 0px
  font-weight normal
  padding 10px
  padding-bottom 0px
.con-content
  width 100%
  p
    font-size .8rem
    padding 0px 10px
  .vs-checkbox-label
    font-size .8rem
  .vs-input-parent
    width 100%
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