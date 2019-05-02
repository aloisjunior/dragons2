<script>
    import bus from './bus';

    export default {
        data() {
            return {
                name: '_atonmsg',

                snackbar: false,
                context: '',
                mode: '',
                timeout: 6000,
                text: '',
                alignHorizontal: 'center',
                alignVertical: 'top',
                mensagens: [],
                mensagemBarra: false,
            }
        },
        watch: {
            mensagens: function (newV, oldV) {
                this.mensagemBarra = (newV.length) ? true : false;
            },
            mensagemBarra: function (newV, oldV) {
                if (!newV) {
                    for (var i = 0, len = this.mensagens.length; i < len; i++) {
                        this.excluirAlert(this.mensagens[i], false);
                    }
                    this.mensagens =[];
                }
            }
        },
        mounted() {
            // bus.$on('atonmsg', (tipo, msg, timeout = 6000, mode = 'multi-line', alignHorizontal ='center', alignVertical ='top') => this.msg(tipo, msg, timeout, mode, alignHorizontal, alignVertical));
            bus.$on('atonmsg', (tipo, msg, timeout = 6000, mode = 'multi-line', alignHorizontal = 'center', alignVertical = 'top') => this.msg2(tipo, msg, timeout, mode, alignHorizontal, alignVertical));

        },
        methods: {
            msg: function (tipo, msg, timeout, mode, alignHorizontal, alignVertical) {
                this.context = tipo;
                this.text = msg;
                this.mode = mode;
                this.alignHorizontal = alignHorizontal;
                this.alignVertical = alignVertical;
                this.timeout = timeout;
                this.snackbar = true;
            },
            S4: function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            },

            create_GUID: function () {
                return (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0, 3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
            },
            msg2: function (tipo, msg, timeout, mode, alignHorizontal, alignVertical) {
                var item = {
                    texto: msg,
                    tipo: tipo,
                    alert: true,
                    timeout: null,
                    id: this.create_GUID(),
                };
                this.mensagens.push(item);

                if (timeout > 0){
                    var self = this;
                    item.timeout = setTimeout(function () {
                        self.excluirAlert(item);
                    }, timeout);
                }
            },
            excluirAlert: function (item, excluirListItem = true) {
                clearTimeout(item.timeout);
                if (excluirListItem){
                    this.mensagens.splice(this.mensagens.indexOf(item), 1);
                }
            }
        },
    }
</script>

<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :text="text"
      :timeout="timeout"
      :color="context"
      :multi-line="mode === 'multi-line'"
      :vertical="mode === 'vertical'"
      :top="alignVertical === 'top'"
      :bottom="alignVertical === 'bottom'"
      :right="alignHorizontal === 'right'"
      :left="alignHorizontal === 'left'"
    >
      {{ text }}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        <v-icon left>
          mdi-close
        </v-icon>Fechar
      </v-btn>
    </v-snackbar>

    <div class="text-xs-center">
      <v-bottom-sheet
        v-model="mensagemBarra"
        inset
        hide-overlay
      >
        <v-card
          tile
          class="atonTranspCard"
        >
          <v-alert
            v-for="item in mensagens"
            :key="item.id"
            v-model="item.alert"

            class="title font-weight-regular"

            dismissible
            :type="item.tipo"
            @input="(payload)=>excluirAlert(item, payload)"
          >
            {{ item.texto }}
          </v-alert>
        </v-card>
      </v-bottom-sheet>
    </div>
  </div>
</template>

<style scoped>
    .atonTranspCard{
        background-color: transparent;
    }

    .v-dialog{
         -webkit-box-shadow: none;
         box-shadow: none;
    }

</style>