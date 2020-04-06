<template>
  <svg viewBox="0 0 425 348" class="nav-control"> 
    <symbol id="circle" width="28" height="28" viewBox="0 0 28 28">
      <defs>
        <rect id="a" width="28" height="28" rx="14"/>
      </defs>
      <g>
        <mask id="b" fill="#fff">
          <use xlink:href="#a"/>
        </mask>
        <use fill="#FFF" xlink:href="#a"/>
        <path fill="#09223F" d="M94.585 43.993c.802 1.589 1.765 3.568 2.637 5.339L97.217.458c0-.073-.066-.223-.168-.32-.15-.142-.347-.137-.502-.137H74.7c-.232 0-.372-.02-.536.122a.545.545 0 0 0-.19.335s-.087.29-.021.486c.064.197 20.631 43.05 20.631 43.05zM33.679 0H7.778l26.395 56.072c.17.258.307.392.574.538.361.2.706.164 1.224.164l23.98.002s.441.024.61-.112c.1-.082.324-.3.324-.3L33.68 0zm6.71.807c.073-.14.143-.27.286-.396C41.041.088 41.847 0 41.847 0h23.777c.223 0 .36.009.547.123a.8.8 0 0 1 .327.34l5.35 11.076 21.647 44.224c-.016.21-.034.326-.034.326-.035.227-.05.342-.19.49-.162.166-.314.199-.556.199H67.098S40.562 1.473 40.52 1.308c-.157-.37-.13-.501-.13-.501z" mask="url(#b)" opacity=".1"/>
      </g>
    </symbol>
    <g fill="#5F7694">
      <path d="M420.508 10.452l-338.386-.105-.009 16.072 338.395.105v9.555h4.27V.8h-4.27z"/>
      <path d="M306.211 10.278c15.772 0 28.558 12.75 28.558 28.479v67.355h-16.111V38.774c-.005-6.842-5.568-12.386-12.429-12.386H125.948c.6 2.049.91 4.19.907 6.364v255.173a22.545 22.545 0 0 1-6.558 15.904 22.334 22.334 0 0 1-15.83 6.588H87.93V294.29h16.538c3.5 0 6.337-2.85 6.337-6.366V32.822c0-3.525-2.845-6.384-6.354-6.384H87.912v-.05h-2.447c-3.324 0-6.021 2.686-6.026 6.002v4.055L59.48 10.278h246.732z"/>
      <path d="M126.861 32.92h70v33.7h-70zM338.98 346.75v-33.7l58.505-.001-.078-97.09a15.499 15.499 0 0 1 4.639-11.054 15.85 15.85 0 0 1 11.195-4.54l9.431.054v7.883h-4.729c-4.27 0-7.73 3.424-7.73 7.648v130.8H338.98zM172.773 310.943h-10.566c-15.74-.014-28.495-12.796-28.51-28.567V118.882c.02-15.769 12.772-28.548 28.51-28.567h189.406v16.134H162.207c-6.847.01-12.395 5.572-12.4 12.433v163.494c.005 6.861 5.553 12.423 12.4 12.433h10.566v16.134z"/>
      <path d="M424.778 81.89v35.28h-4.211v-10.66l-66.38-.104H185.482c-6.862.029-12.41 5.57-12.415 12.4v66.073c0 4.024 3.278 7.286 7.32 7.286h15.738v.05l224.34.069v-9.295h4.312v35.28h-4.268v-9.913l-311.074-.105a21.541 21.541 0 0 1-15.22-6.256 21.359 21.359 0 0 1-6.313-15.147h16.171c0 2.95 2.4 5.34 5.362 5.34l48.604.016a23.29 23.29 0 0 1-1.183-7.325v-66.074c.02-15.726 12.824-28.47 28.626-28.49H354.21v-.128l66.355.104v-8.4h4.212zM424.778 285.142v35.28h-4.211v-9.48l-338.454-.104 21.873-25.17v2.966c0 3.335 2.693 6.04 6.02 6.044l310.56.095v-9.631h4.212z"/>
      <path d="M201.072 313.049h71.586v33.7h-71.586zM104.22 10.278H9.053c-5 0-9.052 4.045-9.052 9.036v303.213h104.22V10.278zM0 325.16v13.036a9.086 9.086 0 0 0 2.649 6.423 9.029 9.029 0 0 0 6.403 2.657h95.169V325.16H0zM164.226 220.902h68.954v73.785h-68.954zM242.655 220.902h68.954v73.785h-68.954zM321.61 220.902h68.954v73.785H321.61zM320.557 118.223h68.954v74.097h-68.954zM188.44 118.223h68.953v74.097H188.44zM318.085 35.026h72.479v55.362l-71.906-.073c.007-34.5.007-52.063 0-52.69-.01-.942-.315-1.92-.573-2.599z"/>
    </g>
    <g transform="translate(318,34)" @click="selectItem('mixing_valve')" :class="[{active: selectedItem === 'mixing_valve'}, status('tempered_supply/mixing_valve')]">
      <path d="M.085.026h72.479v55.362L.658 55.315c.007-34.5.007-52.063 0-52.69C.648 1.682.343.704.085.025z"/>
      <use class="circ" xlink:href="#circle" x="24" y="14" />
      <text transform="translate(32,36)">5</text>
    </g>
    <g transform="translate(128,33)" @click="goToView('sanitation', 'sanitation_loop')" :class="[{active: selectedItem === 'sanitation_loop'}, status('hot_supply/water_heater/sanitation_loop')]">
      <rect width="70" height="33.5"/>
      <use class="circ" xlink:href="#circle" x="20" y="3" />
      <text transform="translate(28,24)">6</text>
    </g>
    <g transform="translate(0,10)" @click="selectItem('water_heater')" :class="[{active: selectedItem === 'water_heater'}, status('hot_supply/water_heater')]">
      <path d="M104.22.278H9.053C4.052.278 0 4.323 0 9.314v303.213h104.22V.278z"/>
      <use class="circ" xlink:href="#circle" x="40" y="152" />
      <text transform="translate(48,174)">1</text>
    </g>
    <g transform="translate(0,325)" @click="goToView('sanitation', 'blowdown_cycle')" :class="[{active: selectedItem === 'blowdown_cycle'}, status('hot_supply/water_heater/blowdown')]">
      <path d="M0 .16v13.036a9.086 9.086 0 0 0 2.649 6.423 9.029 9.029 0 0 0 6.403 2.657h95.169V.16H0z"/>
      <use class="circ" xlink:href="#circle" x="43" y="-4" />
      <text transform="translate(45,18)">11</text>
    </g>
    <g transform="translate(188,117)" @click="selectItem('uv_disinfect', 'recirc_uv_disinfect')" :class="[{active: selectedItem === 'recirc_uv_disinfect'}, status('recirc_inlet/uv_disinfect')]">
      <path d="M.44.223h68.953V74.32H.44z"/>
      <use class="circ" xlink:href="#circle" x="22" y="24" />
      <text transform="translate(30,46)">3</text>
    </g>
    <g transform="translate(320,117)" @click="selectItem('filter', 'recirc_sediment_filter')" :class="[{active: selectedItem === 'recirc_sediment_filter'}, status('recirc_inlet/sediment_filter')]">
      <path d="M.557.223h68.954V74.32H.557z"/>
      <use class="circ" xlink:href="#circle" x="22" y="24" />
      <text transform="translate(23,46)">10</text>
    </g>
    <g transform="translate(164,219)" @click="selectItem('uv_disinfect', 'cold_uv_disinfect')" :class="[{active: selectedItem === 'cold_uv_disinfect'}, status('cold_inlet/uv_disinfect')]">
      <path d="M.226.902H69.18v73.785H.226z"/>
      <use class="circ" xlink:href="#circle" x="23" y="24" />
      <text transform="translate(31,45)">4</text>
    </g>
    <g transform="translate(243,219)" @click="selectItem('anti_scaling')" :class="[{active: selectedItem === 'anti_scaling'}, status('cold_inlet/anti_scaling')]">
      <path d="M.226.902H69.18v73.785H.226z"/>
      <use class="circ" xlink:href="#circle" x="23" y="24" />
      <text transform="translate(31,46)">2</text>
    </g>
    <g transform="translate(321,219)" @click="selectItem('filter', 'cold_sediment_filter', 7)" :class="[{active: selectedItem === 'cold_sediment_filter'}, status('cold_inlet/sediment_filter')]">
      <path d="M.557.223h68.954V74.32H.557z"/>
      <use class="circ" xlink:href="#circle" x="23" y="24" />
      <text transform="translate(31,46)">7</text>
    </g>
    <g transform="translate(201.2,313)" @click="selectItem('booster_pump')" :class="[{active: selectedItem === 'booster_pump'}, status('cold_inlet/booster_pump')]">
      <rect width="71" height="33.5"/>
      <use class="circ" xlink:href="#circle" x="23" y="3" />
      <text transform="translate(31,25)">8</text>
    </g>
    <g transform="translate(339,313)" @click="selectItem('diverter_valve')" :class="[{active: selectedItem === 'diverter_valve'}, status('recirc_inlet/diverter_valve')]">
      <rect width="71" height="33.5"/>
      <use class="circ" xlink:href="#circle" x="23" y="3" />
      <text transform="translate(32,23)">9</text>
    </g>
  </svg>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NavControl',
  props: ['selectedComp'],
  data() {
    return {
      selectedItem: ''
    };
  },
  computed: {
    ...mapGetters([
      'status'
    ])
  },
  mounted() {
    this.selectedItem = this.selectedComp || this.$router.currentRoute.query.extViewName || this.$router.currentRoute.query.viewName
  },
  methods: {
    selectItem(viewName, extendedViewName,) {
      let vName = extendedViewName || viewName
      
      if (this.selectedItem !== vName) {
        this.selectedItem = vName;
        
        let location = { name: 'details', query: { viewName: viewName, extViewName: extendedViewName }}   
        
        if (this.$router.currentRoute.name === 'details') {
          this.$router.replace(location)
        }
        else {
          this.$router.push(location)
        }
      }
    },
    goToView(name, view){
      let location = { name: name, query: { viewName: view }}
      this.selectedItem = view;
      
      if (this.$router.currentRoute.name === 'status') {
        this.$router.push(location)
      }
      else {
        this.$router.replace(location)
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .nav-control {
    width: calc(50vw - 128px);
  }
  g > path,
  g > rect {
    fill: $gray;
  }
  g.ok path,
  g.ok rect {
    stroke: $gray;
  }
  g > .circ {
    display: none;
  }
  text {
    fill: $white;
    font-weight: bold;
    font-family: "HelveticaNeueLTStd-Md";
  }
  g.active path,
  g.active rect {
    fill: $deep-blue;
  }
  g.active path,
  g.active rect {
    stroke: $deep-blue;
  }
  g.active text {
    fill: $deep-blue;
  }
  g.active > .circ {
    display: block;
  }
  g.warning path,
  g.warning rect {
    stroke: $mustard;
  }
  g.active.warning path,
  g.active.warning rect {
    fill: $mustard;
  }
  g.error path,
  g.error rect {
    stroke: $red;
  }
  g.active.error path,
  g.active.error rect {
    fill: $red;
  }
  g.ok,
  g.warning,
  g.error {
    stroke-width: 3px;
  }
</style>


