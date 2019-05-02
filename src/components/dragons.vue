<template>
  <v-layout
    align-center
    justify-center
  >
    <v-flex
      xs12
      sm10
      md8
    >
      <v-flex
        xs12
        text-xs-center
      >
        <v-card hover>
          <v-toolbar
            dark
            color="teal"
          >
            <v-toolbar-side-icon>
              <v-tooltip right>
                <v-icon
                  slot="activator"
                  @click="setLogout()"
                >
                  exit_to_app
                </v-icon>
                <span>Sair da aplicação</span>
              </v-tooltip>
            </v-toolbar-side-icon>
            <v-toolbar-title>.:: MyDragons ::.</v-toolbar-title>
            <v-spacer />
            <v-tooltip left>
              <v-btn
                slot="activator"
                color="pink"
                dark
                small
                absolute
                bottom
                right
                fab
                @click="openViewAdd()"
              >
                <v-icon>add</v-icon>
              </v-btn>
              <span>Incluir Dragão</span>
            </v-tooltip>
          </v-toolbar>


          <v-card-text class="blue-grey lighten-5">
            <v-layout
              align-center
              justify-space-around
              row
              fill-height
              pb-1
            >
              <v-flex
                sm12
                md2
              >
                <v-btn
                  :block="$vuetify.breakpoint.smAndDown"
                  :loading="loading"
                  :disabled="loading"
                  color="secondary"
                  @click="loadDados()"
                >
                  Atualizar
                </v-btn>
              </v-flex>
              <v-spacer v-if="$vuetify.breakpoint.mdAndUp" />
              <v-flex
                md6
                class="align-center text-xs-right"
              >
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="search"
                  clearable
                  label="Filtrar por nome ou tipo"
                  single-line
                  hide-details
                />
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="listDragons"
              :search="search"
              no-data-text="Sem dados para exibir"
              rows-per-page-text="Registros p/ página:"
              :loading="loading"
              :rows-per-page-items="[5,10,25,{'text':'Todos','value':-1}]"
              :pagination.sync="pagination"
              :hide-headers="!listDragons.length"
              :hide-actions="!listDragons.length"
            >
              <template
                slot="items"
                slot-scope="props"
              >
                <td class="text-xs-left">
                  {{ props.item.name }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.type }}
                </td>
                <td class="text-xs-center hidden-sm-and-down">
                  {{ props.item.createdAt | formatDate }}
                </td>
                <td class="text-xs-right">
                  <v-layout
                    row
                    fill-height
                    justify-end
                    align-center
                  >
                    <v-tooltip
                      content-class="top"
                      top
                    >
                      <v-btn
                        slot="activator"
                        icon
                        small
                        class="mx-0"
                        @click="openViewEdit(props.item)"
                      >
                        <v-icon color="teal">
                          edit
                        </v-icon>
                      </v-btn>
                      <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip
                      content-class="left"
                      left
                    >
                      <v-btn
                        slot="activator"
                        icon
                        small
                        class="mx-0"
                        @click="abreConfirma(props.item)"
                      >
                        <v-icon color="pink">
                          delete
                        </v-icon>
                      </v-btn>
                      <span>Excluir</span>
                    </v-tooltip>
                  </v-layout>
                </td>
              </template>

              <template
                slot="pageText"
                slot-scope="props"
              >
                Linhas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-flex>
    <sollus-msg-excluir
      :open-dialog="openDialogExcluir"
      :texto="textoConfirma"
      @setOk="excluirRegistro()"
      @setCancel="val => openDialogExcluir = val"
    />
    <dragons-add-edit
      :id="idAddEdit"
      :open-dialog="openDialogAddEdit"
      :mode="modeAddEdit"
      @setOk="loadDados()"
      @setCancel="val => openDialogAddEdit = val"
    />
    <aton-msg />
    <aton-progress />
  </v-layout>
</template>

<script>
    import SollusMsgExcluir from './sollus-dialog.vue';
    import DragonsAddEdit from "./dragons-add-edit.vue";
    import bus from './events/bus';
    import AtonMsg from './events/_atonmsg.vue';
    import AtonProgress from './events/_atonprogress.vue';

    export default {
        name: "Dragons",
        components: {
            DragonsAddEdit,
            SollusMsgExcluir,
            AtonMsg,
            AtonProgress,

        },
        props: {
            source: String
        },
        data: () => ({
            listDragons: [],

            loading: false,

            modeAddEdit: 'add',
            idAddEdit: 0,

            itemSelected: null,

            textoConfirma: 'Deseja excluir este registro?',

            pesquisa: {
                filtro: '',
            },

            openDialogExcluir: false,
            openDialogAddEdit: false,

            search: '',
            pagination: {
                rowsPerPage: 10
            },
            headers: [
                {text: 'Nome', value: 'name', align: 'left'},
                {text: 'Tipo', value: 'type', align: 'left'},
                {text: 'Criação', value: 'createdAt', align: 'center', class: 'hidden-sm-and-down'},
                {text: 'Ações', value: '', align: 'right', sortable: false},
            ],
            items: []
        }),
        mounted() {
            this.loadDados();
        },
        methods: {
            setLogout: function(){
                this.$emit('logout');
            },
            loadDados: function () {
                if (this.loading) return false;
                let self = this;
                this.loading = true;
                bus.$emit('atonprogress:on');
                this.$http.get('//5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon')
                    .then(response => {
//                        console.log(response);
//                         self.loading = false;
                        self.listDragons = response.data;
                    })
                    .catch(error => {
                        console.log(error.response);
                        // self.errors = error.response.data;
                    })
                    .finally(() => {
                        self.loading = false;
                        bus.$emit('atonprogress:close');
                    });
            },
            abreConfirma: function (item) {
                this.itemSelected = item;
                this.textoConfirma = 'Deseja excluir o dragão ' + item.name + ' ?';
                this.openDialogExcluir = true;
            },
            excluirRegistro: function () {
                let self = this;
                if (this.loading) return false;

                const drago =  Object.assign('', self.itemSelected.name);

                this.loading = true;
                this.$http.delete('//5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon/' + self.itemSelected.id)
                    .then(response => {
                        self.loading = false;

                        let index = self.listDragons.indexOf(self.itemSelected);
                        self.listDragons.splice(index, 1);

                        // let msg = response.data;
                        //

                        bus.$emit('atonmsg', 'success', 'Dragão ' + drago + ' excluido com sucesso!');

                        self.itemSelected = null;
                    })
                    .catch(error => {
                        bus.$emit('atonprogress:close');
                        // bus.$emit('atonmsg', 'error', 'Não foi possível excluir o registro');

                        self.loading = false;
                    })
                    .finally(() => {
                        bus.$emit('atonprogress:close');
                        self.loading = false;
                    });

            },
            openViewAdd: function (item) {
                this.modeAddEdit = 'add';
                this.idAddEdit = 0;
                this.openDialogAddEdit = true;
            },
            openViewEdit: function (item) {
                this.modeAddEdit = 'edit';
                this.idAddEdit = item.id;
                this.openDialogAddEdit = true;
            },
        }
    }
</script>

<style scoped>

</style>

<!--<span>-->
<!--<h4-->
<!--class="title font-weight-light text-xs-left"-->
<!--v-text="'Meus Dragões'"-->
<!--/>-->
<!--</span>-->