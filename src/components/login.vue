<template>
  <v-layout
    align-center
    justify-center
  >
    <v-flex
      xs12
      sm8
      md4
    >
      <v-flex
        xs12
        text-xs-center
      >
        <img
          src="/img/logoLogin.gif"
          alt=""
          style="width:350px"
        >
      </v-flex>
      <v-flex
        mt-3
        xs12
        text-xs-center
      >
        <v-card hover>
          <v-toolbar
            dark
            color="primary"
          >
            <v-toolbar-title>.:: Bem-vindo ao MyDragons ::.</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="user"
                clearable
                autofocus
                prepend-icon="person"
                name="login"
                label="Usuário"
                type="text"
              />
              <v-text-field
                id="password"

                v-model="password"
                :append-icon="showPass ? 'visibility' : 'visibility_off'"
                :type="showPass ? 'text' : 'password'"

                prepend-icon="lock"
                name="password"
                label="Senha"
                @keyup.enter="callLogin()"
                @click:append="showPass = !showPass"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="(!user) || (password.length < 4)"
              color="primary"
              @click="callLogin()"
            >
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
    export default {
        name: "Login",
        props: {
            source: String
        },
        data: () => ({
            user:null,
            password:'',
            showPass: false,
        }),
        methods: {
            callLogin: function () {
                if ((this.user =='agora')&&(this.password=='valida')){
                    this.$emit('loginOk');
                }
            }
        }
    }
</script>

<style scoped>

</style>