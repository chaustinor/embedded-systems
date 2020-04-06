<template>
  <base-layout>
    <template v-slot:header>
      <header-base>
        <div class="primary">Maintenance Events</div>
        <div class="secondary">{{ getUnitNameAndLoc }}</div>
      </header-base>
    </template>
    <b-container fluid>
      <b-row class="mt-5">
        <b-col style="padding: 0">
          <b-button class="csv" @click="downloadCsv">
            <span>Download CSV</span>
            <svg width="20" height="27" viewBox="0 0 20 27">
              <path fill="#FFF" fill-rule="nonzero" d="M18.281 26.25c.676 0 1.219-.543 1.219-1.219V8.375h-6.906c-.67 0-1.219-.548-1.219-1.219V.25H1.219C.543.25 0 .793 0 1.47V25.03c0 .676.543 1.219 1.219 1.219H18.28zM19.5 6.75v-.31c0-.32-.127-.63-.356-.858L14.173.606A1.218 1.218 0 0 0 13.31.25H13v6.5h6.5zm-10.36 16l-4.896-4.86c-.516-.512-.154-1.39.571-1.39h3.31v-4.062c0-.45.364-.813.812-.813h1.625c.45 0 .813.364.813.813V16.5h3.31c.725 0 1.087.878.572 1.39l-4.896 4.86a.866.866 0 0 1-1.22 0z"/>
            </svg>
          </b-button>
          <b-tabs content-class="p-5" lazy nav-class="nav-class">
            <b-tab active @click="activeTabIndex = 0">
              <template v-slot:title>
                <div class="tab-text">All Events</div>
              </template>
              <grid-events 
                :data="gridEventData" 
                :show-components="true"
                :modal-closed="refreshEventData">
              </grid-events>
            </b-tab>
            <b-tab @click="activeTabIndex = 1">
              <template v-slot:title>
                <div class="tab-text">MODBUS Log</div>
              </template>
              <grid-modbus></grid-modbus>
            </b-tab>
            <template v-slot:tabs-end>
              <div class="tabs-filler maintenance"></div>
            </template>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </base-layout>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BaseLayout from './BaseLayout.vue'
import GridEvents from '../components/GridEvents.vue'
import GridModbus from '../components/GridModbus.vue'
import HeaderBase from '../components/HeaderBase.vue'
import { BTabs, BTab } from 'bootstrap-vue'

export default {
  name: 'Maintenance',
  data(){
    return {
      activeTabIndex: 0,
      showLessGrid: false
    };
  },
  components: {
    BaseLayout,
    HeaderBase,
    GridEvents,
    GridModbus,
    BTabs,
    BTab
  },
  mounted(){
    this.refreshEventData();
    this.publishGet('company/system/unit_name/request')
    this.publishGet('company/system/unit_location/request')
  },
  computed: {
    ...mapGetters([
      'eventData',
      'topicMap',
      'protobufRoot'
    ]),
    gridEventData(){
      return this.eventData(this.showLessGrid)
    },
    getUnitNameAndLoc(){
      let n = this.topicMap('company/system/unit_name/report', 'text')
      let l = this.topicMap('company/system/unit_location/report', 'text')
      return n + ' ' + l
    }
  },
  methods: {
    ...mapActions([
      'getEventData',
      'publishGet',
      'publishEvent'
    ]),
    goBack(){
      this.$router.go(-1)
    },
    refreshEventData(){
      if (this.protobufRoot) {
        this.getEventData({ query: {numberOfResults:30} })
      }
    },
    downloadCsv(){
      let root = this.protobufRoot
      let event = root.lookupType("event")
      let payload = {
        component: root.Component_e.INVALID_COMPONENT,
        action: root.Action_e.CREATE_REPORT,
        reportType: this.activeTabIndex === 0 ? root.Report_Type_e.R_T_MAINTENANCE_EVENTS : root.Report_Type_e.R_T_MAINTENANCE_MODBUS
      }

      let errMsg = event.verify(payload);
      if (errMsg)
        throw Error(errMsg);
      
      this.publishEvent({ topic: 'company/system/event', value: payload })
    }
  },
  watch: {
    activeTabIndex :function(){
      // Watch for the tab change
      if (this.activeTabIndex === 0){
        this.refreshEventData()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .csv {
    position: absolute;
    right: 51px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 278px;
    height: 54px;
    background-color: $gray;
    color: $white;
    font-size: 26px;
    border: 0;
    top: 17px;
    z-index: 10;
  }
  .csv > span:first-child {
    margin-top: 6px;
    padding-right: 25px;
    line-height: 26px;
  }
  .tabs-filler.maintenance {
    width: calc(100vw - 520px);
  }
</style>

