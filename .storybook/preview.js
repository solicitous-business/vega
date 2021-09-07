import "../assets/global.css"
import "../assets/reset.css"

import Vue from 'vue';
import VegaSelect from "../components/vega/VegaSelect.vue"
import VegaInput from "../components/vega/VegaInput.vue"
import VegaValueInput from "../components/vega/VegaValueInput.vue"
Vue.component('VegaSelect', VegaSelect);
Vue.component('VegaInput', VegaInput);
Vue.component('VegaValueInput', VegaValueInput);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}