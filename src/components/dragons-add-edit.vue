<template>
  <v-dialog
    v-model="openDialog"
    persistent
    max-width="600px"
  >
    <v-card
      @keyup.esc.prevent="setCancel()"
      @keyup.enter.prevent="setOk()"
    >
      <v-toolbar
        dark
        color="teal darken-3"
      >
        <v-toolbar-title v-if="mode=='edit'">
          .:: Alteração de Dragão ::.
        </v-toolbar-title>
        <v-toolbar-title v-else>
          .:: Inclusão de Dragão ::.
        </v-toolbar-title>
        <v-spacer />
      </v-toolbar>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formCtrl"
          lazy-validation
        >
          <v-text-field
            v-show="isEdit"
            ref="createdAt"
            :value.sync="createdAtFormatted"
            label="Criação"
            required
            disabled
          />

          <v-text-field
            ref="name"
            v-model="dadosDB.name"
            label="Nome"
            required
            autofocus
            :rules="rules.required"
          />


          <v-layout row>
            <v-card-text>
              <v-combobox
                ref="playlists"
                v-model="dadosDB.type"
                label="Tipo"

                required
                :items="listTipos"
                :rules="rules.required"
                chips
                deletable-chips
                hint="Qual o tipo do dragão?"
                persistent-hint
                no-data-text="Nenhum histórico encontrado"
                @keyup.enter.stop=""
              />
            </v-card-text>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="red--text"
          @click="setCancel()"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="primary--text"
          :disabled="!formCtrl"
          @click="callPost()"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    import SollusRules from './base/sollus-rules';
    import bus from './events/bus';

    export default {

        name: "DragonsAddEdit",
        mixins: [
            SollusRules,
        ],
        props: {
            openDialog: {
                default: false,
                type: Boolean,
            },
            mode: {
                default: 'add',
                type: String,
            },
            id: 0,
        },
        loading: false,
        data() {
            return {
                dadosDB: {
                    name: '',
                    id: 0,
                    type: '',
                    createdAt: null,
                    histories: [],
                },
                formCtrl: false,
                tiposDB: []
            }
        },
        computed: {
            createdAtFormatted: function () {
                return this.formatDateTime(this.dadosDB.createdAt);
            },

            isEdit: function () {
                return this.mode !== 'add';
            },
            listTipos: function () {
                return this.tiposDB.reduce((acc, cur) => {
                    const tipo = cur.type;

                    if (!acc.includes(tipo)) {
                        acc.push(tipo)
                    }

                    return acc;
                }, []).sort();

            },
        },
        watch: {
            openDialog: function (newValue, oldValue) {
                if (newValue && (newValue !== oldValue) ){
                    this.loadTipos(!this.isEdit);
                }

                if (newValue && this.isEdit) {
                    this.loadItemEdit();
                } else {
                    this.$refs.form.reset();
                    this.dadosDB.id = null;
                    this.dadosDB.histories = [];
                    this.dadosDB.createdAt = new Date().getTime();
                }

                this.$nextTick(() =>
                    this.$refs.name.$el.focus()
                );
            }
        },
        mounted() {
            const self = this;

            self.$refs.form.reset();
            // self.loadTipos();

            this.$nextTick(() =>
                this.$refs.name.$el.focus()
            );
        },
        methods: {
            formatDateTime: function (value) {
                return moment(String(value), ['DD/MM/YYYY HH:mm', "YYYY/MM/DD HH:mm"]).format('DD/MM/YYYY HH:mm');
            },
            callPost: function () {
                if (this.loading) return false;

                if (!this.validation()) return false;

                let self = this;
                this.loading = true;

                bus.$emit('atonprogress:open', 'Atualizando dados');


                let _url = '//5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon';

                let postData = this.dadosDB;


                if (this.isEdit) {
                    _url = '//5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon/' + self.id;

                    this.$http.put(_url, postData)
                        .then(response => {
                            self.loading = false;

                            bus.$emit('atonmsg', 'success', 'Dragão ' + self.dadosDB.name + ' alterado com sucesso!');

                            self.setOk();
                            bus.$emit('player:updated');
                        })
                        .catch(error => {
                            console.log(response);
                            bus.$emit('atonprogress:close');
                            bus.$emit('atonmsg', 'error', 'Dados não foram inseridos');

                            self.loading = false;
                        });
                } else {
                    let addData = {
                        name: this.dadosDB.name,
                        type: this.dadosDB.type,
                    };

                    postData = addData;

                    this.$http.post(_url, postData)
                        .then(response => {
                            self.loading = false;

                            bus.$emit('atonmsg', 'success', 'Dragão ' + self.dadosDB.name + ' incluído com sucesso!');

                            self.setOk();
                            bus.$emit('player:updated');
                        })
                        .catch(error => {
                            console.log(response);
                            bus.$emit('atonprogress:close');
                            bus.$emit('atonmsg', 'error', 'Dados não foram inseridos');

                            self.loading = false;
                        });
                }


            },
            loadItemEdit: function () {
                let self = this;
                // self.activesAjax++;
                bus.$emit('atonprogress:open');
                this.loading = true;

                this.$http.get('//5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon/' + self.id)
                    .then(response => {
                        self.dadosDB = response.data;
                        self.$nextTick(() =>
                            self.$refs.name.$el.focus()
                        );
                    })
                    .catch(error => {
                        console.log(error.response);
                    }).finally(() => {
                    self.loading = false;
                    bus.$emit('atonprogress:close');
                });
            },
            loadTipos: function (closeProgress = false) {
                let self = this;
                // self.activesAjax++;
                bus.$emit('atonprogress:open', 'Carregando Tags');
                self.loading = true;
                this.$http.get('//5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon')
                    .then(response => {
                        self.tiposDB = response.data;
                    })
                    .catch(error => {
                        console.log(error.response);
                        bus.$emit('atonprogress:close');
                    }).finally(() => {
                    self.loading = false;
                    if (closeProgress){
                        bus.$emit('atonprogress:close');
                    }

                });


            },

            setOk: function () {
                this.$emit('setOk');
                this.setCancel();
            },
            setCancel: function () {
                this.$emit('setCancel', false);
            },
            resetValidation: function () {
                this.$refs.form.resetValidation()
            },
            validation: function () {
                let valid = this.$refs.form.validate();
                this.formCtrl = valid;
                return valid;
            }
        },
    }
</script>

<style scoped>

</style>