<template>
  <v-app id="sollusapp">
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <frontend />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Frontend from './components/frontend'

export default {
  name: 'App',
  components: {
    Frontend
  },
  data () {
    return {
      //
    }
  }
}
</script>
