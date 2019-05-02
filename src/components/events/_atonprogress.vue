<script>
    import bus from "./bus";

    export default {
        data () {
            return {
                name: '_atonprogress',

                showProgress: false,
                texto: 'Aguarde, estamos quase acabando!',

                varTimeout: null,
            }
        },
        watch: {
            showProgress: function (newValue, oldValue) {
                if (newValue == false){
                    this.texto = 'Aguarde, estamos quase acabando!';
                    clearTimeout(this.varTimeout);
                }
            }
        },
        mounted() {
            bus.$on('atonprogress:open', (msg) => this.progress(msg, true));
            bus.$on('atonprogress:on', (msg) => this.progress(msg, true));
            // bus.$on('atonprogress:off', () => this.showProgress = false);
            bus.$on('atonprogress:close', () => this.showProgress = false);
            bus.$on('atonprogress:msg', (msg) => this.texto = msg);
        },
        methods: {
            progress: function (msg, open = false) {
                if ((msg) && (msg != '')) {
                    this.texto = msg;
                }else if(this.texto == ''){
                    this.texto = 'Aguarde, estamos quase acabando!';
                }
                if (open){
                    this.showProgress = true;
                }

                // var Self = this;
                // this.varTimeout = setTimeout(function(){
                //     Self.showProgress = false;
                //     }
                // , 30000);

                // clearTimeout(Self.varTimeout);
            }
        }
    }
</script>
<!--
<v-progress-circular indeterminate v-bind:size="60" v-bind:width="7"
                                         class="purple--text"></v-progress-circular>
-->

<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="showProgress"

      persistent
      width="350"
    >
      <v-card
        color="red lighten-1"
      >
        <v-card-text>
          <p class="white--text body-2">
            {{ texto }}
          </p>

          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>


<style lang="stylus" scoped>
    div
        text-align: center

    .progress-circular
        margin: 1rem
</style>