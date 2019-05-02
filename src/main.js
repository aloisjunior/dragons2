import 'babel-polyfill'

import Vue from 'vue'
import './plugins/vuetify'
import './plugins/moment'
import './plugins/axios'
import App from './App.vue'

Vue.config.productionTip = false

Vue.filter('formatDate', function (value, format = 'DD/MM/YYYY HH:mm') {
    if (value) {
        // console.log(value+' '+format);
        // let formato = (format != null)? format : 'DD/MM/YYYY HH:mm';
        return moment(String(value), ['DD/MM/YYYY HH:mm', "YYYY/MM/DD HH:mm"]).format(format);
    }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
