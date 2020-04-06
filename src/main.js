import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import store from './store'
import VueSocketIo from 'vue-socket.io';
import BootstrapVue from 'bootstrap-vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMinus, faCalendarDay, faAngleLeft, faAngleRight, faClock, faBuilding, faCaretUp, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vuelidate from 'vuelidate'

// Pages
import Index from './views/Index.vue'
import Status from './views/Status.vue'
import Details from './views/Details.vue'
import Sanitation from './views/Sanitation.vue'
import NavDiagram from './components/NavDiagram.vue'
import Maintenance from './views/Maintenance.vue'
import Settings from './views/Settings.vue'
import InfectionControl from './views/InfectionControl.vue'
import Users from './views/Users.vue'
import User from './views/User.vue'
import Pin from './views/Pin.vue'
import Login from './views/Login.vue'

library.add(faPlus, faMinus, faCalendarDay, faAngleLeft, faAngleRight, faClock, faBuilding, faCaretUp, faAngleUp, faAngleDown);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(VueRouter);
Vue.use(VueSocketIo, `http://${window.location.hostname}:3001`, store);
Vue.config.productionTip = false;
Vue.config.performance = true;

function getConfig(route) {
  return { 
    meta: store.getters.view(route.query.viewName, route.query.extViewName)
  }
}

const routes = [
  { name: 'index', path: '/', component: Index },
  { name: 'status', path: '/status', component: Status },
  { name: 'details', path: '/details', component: Details, props: getConfig },
  { name: 'nav', path: '/nav', component: NavDiagram },
  { name: 'sanitation', path: '/sanitation', component: Sanitation, props: getConfig },
  { name: 'maintenance', path: '/maintenance', component: Maintenance },
  { name: 'infectioncontrol', path: '/infection-control', component: InfectionControl },
  { name: 'settings', path: '/settings', component: Settings },
  { name: 'users', path: '/users', component: Users },
  { name: 'user', path: '/user', component: User },
  { name: 'pin', path: '/pin', component: Pin },
  { name: 'login', path: '/login', component: Login }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  // Determine user access permissions

  store.dispatch('restrictAction', {action: 'route', to, from}).then(()=>
  {
    store.dispatch('loadProtos').then(() => {
      if (to.name === 'back') {
        let viewName = (from.name === 'status') ? 'index' : 'status'
        next({ name: viewName })
      }
      else {
        next()
      }
    })
  })
  .catch((loggedIn)=>{
    if (from.name === 'login'){
      next({name: 'index'})
    }
    else{
      next({ name: 'login', query: {loggedIn}})
    }
  })
  store.commit('setRouter', router);
  store.commit('loadCabinetUnits')

})

router.afterEach(to => {
  store.commit('clearHistoricalData') 
  store.commit('setCurrentRoute', to.name)
})

Vue.filter('isNumeric', n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
})

Vue.filter('tempScale', (value, precision = 0) => {
  let precisionMultiplier = Math.pow(10, precision)
  if (store.state.convertTempScale) {
    return (value || value === 0) ? parseFloat((Math.round(((value * 9 / 5) + 32) * precisionMultiplier) / precisionMultiplier).toFixed(precision)) : ''
  }
  return (value || value === 0) ? parseFloat(value).toFixed(precision) : ''
})

Vue.filter('pressureScale', (value, precision = 1) => {
  let precisionMultiplier = Math.pow(10, precision)
  if (store.state.convertPressureScale) {
    return (value || value === 0) ? parseFloat((Math.round(value * 0.0689475729 * precisionMultiplier) / precisionMultiplier).toFixed(precision)) : ''
  }
  return (value || value === 0) ? parseFloat(value).toFixed(precision) : ''
});

Vue.filter('headScale', (value, precision = 1) => {
  let precisionMultiplier = Math.pow(10, precision)
  if (store.state.convertHeadUnit) {
    return (value || value === 0) ? parseFloat((Math.round(value * 0.3048 * precisionMultiplier) / precisionMultiplier).toFixed(precision)) : ''
  }
  return (value || value === 0) ? parseFloat(value).toFixed(precision) : ''
});

Vue.filter('tempScaleSet', value => {
  if (store.state.convertTempScale) {
    return (value || value === 0) ? ((parseFloat(value) - 32) * 5 / 9) : 0
  }
  return value
})

Vue.filter('pressureScaleSet', value => {
  if (store.state.convertPressureScale) {
    return (value || value === 0) ? parseFloat(value) * 14.5038 : 0 
  }
  return value
});

Vue.filter('headScaleSet', value => {
  if (store.state.convertHeadUnit) {
    return (value || value === 0) ? parseFloat(value) * 3.28084 : 0 
  }
  return value
});

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
