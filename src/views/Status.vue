<template>
  <base-layout>
    <template v-slot:header>
      <header-base>
        <template v-slot:left>
          <div class="back" v-on:click="goBack">  
            <svg viewBox="0 0 27 47" width="27" height="47" ><g><g><path fill="#FEFEFE" fill-rule="evenodd" d="M1.412 19.833c.005-.004.007-.01.01-.015L18.648 1.515C19.597.505 20.84 0 22.088 0c1.245 0 2.49.504 3.438 1.515 1.9 2.018 1.9 5.292.002 7.311L11.988 23.5l13.588 14.674c1.898 2.018 1.9 5.293 0 7.311-1.9 2.02-4.983 2.02-6.882 0L1.471 27.181c-.008-.008-.013-.017-.02-.026a4.575 4.575 0 0 1-.35-.403c-.043-.056-.081-.114-.12-.172a4.14 4.14 0 0 1-.164-.235c-.044-.072-.083-.144-.123-.217-.04-.072-.083-.142-.122-.216-.038-.075-.068-.153-.101-.228-.035-.078-.07-.153-.101-.232-.032-.074-.052-.15-.08-.225-.027-.084-.057-.167-.082-.252-.022-.076-.037-.153-.054-.228-.022-.087-.044-.173-.06-.264-.019-.086-.028-.176-.041-.267-.01-.077-.022-.152-.03-.232a5.551 5.551 0 0 1 0-1.02c.008-.075.019-.147.03-.222.013-.092.022-.186.04-.276.015-.087.04-.17.058-.255.018-.079.035-.158.057-.237.024-.081.053-.162.08-.241.026-.08.05-.159.082-.238.03-.073.062-.145.094-.219.036-.079.07-.16.11-.237.033-.07.074-.137.112-.205.043-.077.085-.154.133-.23.046-.075.098-.143.147-.215.046-.065.087-.13.136-.192.098-.125.201-.248.31-.364"/></g></g></svg>
          </div>
          <table v-if="runningOperation.active && pendingOperation.active" class="secondary">
            <tr>
              <td>Running: {{runningOperation.name}}</td>
              <td v-show="runningOperation.endTime" class="primary"><now class="time" format="m:ss" :targetTime="runningOperation.endTime"></now></td>
              <td v-show="runningOperation.timeSince" class="primary"><now class="time" format="m:ss" :timeSince="runningOperation.timeSince"></now></td>
              <td>Remaining</td>
            </tr>
            <tr>
              <td>Next: {{pendingOperation.name}}</td>
              <td><now class="time" format="m:ss" :targetTime="pendingOperation.startTime"></now> </td>
              <td>Count Down<br>to Start</td>
            </tr>
          </table>
          <div v-else-if="runningOperation.active || pendingOperation.active" class="secondary">Running:<br>{{runningOperation.name}}</div>
        </template>
        <div v-if="runningOperation.active != pendingOperation.active">
          <div v-if="runningOperation.active && runningOperation.timeSince" class="secondary">Active for</div>
          <div v-if="runningOperation.active && runningOperation.timeSince" class="primary time"><now class="time" format="m:ss" :timeSince="runningOperation.timeSince"></now></div>

          <div v-if="runningOperation.active && runningOperation.endTime" class="secondary">Time Remaining:</div>
          <div v-if="runningOperation.active && runningOperation.endTime" class="primary time"><now class="time" format="m:ss" :targetTime="runningOperation.endTime"></now></div>

          <div v-if="pendingOperation.active" class="secondary">The Scheduled {{pendingOperation.name}} Will Begin In:</div>
          <div v-if="pendingOperation.active" class="primary time"><now class="time" format="m:ss" :targetTime="pendingOperation.startTime"></now></div>
        </div>
        <div v-else-if="!runningOperation.active && !pendingOperation.active">
          <div class="primary">System Status</div>
          <div class="secondary">{{ getUnitNameAndLoc }}</div>
        </div>
        <template v-slot:right>
          <span v-if="pendingOperation.active && !runningOperation.active" class="cancel" @click="cancelProcess">CANCEL</span>
          <div v-if="runningOperation.active" class="secondary">Emergency</div>
          <div v-if="runningOperation.active" class="stop-sign" @click="stopProcess">
            <img src="../../public/assets/stop.png"> 
            <span>STOP</span>
          </div>
          <div class="date" v-show="!runningOperation.active && !pendingOperation.active">
            <now format="h:mm A"></now>
            <now format="MM/DD/YY"></now>
          </div>   
        </template>
      </header-base>
    </template>
    <b-container fluid class="content">
      <b-row class="mt-5">
        <b-col>
          <nav-diagram></nav-diagram>
        </b-col>
      </b-row>
      <b-row class="mt-5">
        <b-col class="grid-area">
          <grid-events v-if="loaded" :data="gridData" :show-components="true" :modalClosed="refreshEventData"></grid-events>
        </b-col>
      </b-row>
    </b-container>
  </base-layout>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BaseLayout from './BaseLayout.vue'
import NavDiagram from '../components/NavDiagram.vue'
import GridEvents from '../components/GridEvents.vue'
import Now from '../components/Now.vue'
import HeaderBase from '../components/HeaderBase.vue'

export default {
  name: 'Status',
  data(){
    return {
      showLessGrid: false,
      loaded: false
    };
  },
  components: {
    BaseLayout,
    NavDiagram,
    Now,
    GridEvents,
    HeaderBase
  },
  mounted(){
    setTimeout(()=>{
      this.loaded = true;
      this.refreshEventData();
      this.publishGet('company/hot_supply/water_heater/sanitation_loop/operation_status/request')
      this.publishGet('company/system/unit_name/request')
      this.publishGet('company/system/unit_location/request')
      this.publishGet('company/hot_supply/water_heater/blowdown/operation_status/request')
      this.publishGet('company/hot_supply/water_heater/chemical_shock/operation_status/request')
    },0)
  },
  computed: {
    gridData(){
      return this.eventData(this.showLessGrid)
    },
    getUnitNameAndLoc(){
      let n = this.topicMap('company/system/unit_name/report', 'text')
      let l = this.topicMap('company/system/unit_location/report', 'text')
      return n + ' ' + l
    },
    pendingOperation(){
      let root = this.protobufRoot
      if (!root)
        return {active: false}
      let sanitationStatus = this.topicMap('company/hot_supply/water_heater/sanitation_loop/operation_status/report', 'operationStatus')
      if (root.Operation_State_e[sanitationStatus.state] == root.Operation_State_e.O_S_IMMINENT){
        return {active: true, name: 'Sanitation Loop', startTime: new Date(Number(sanitationStatus.startTime))}
      }
      let blowdownStatus = this.topicMap('company/hot_supply/water_heater/blowdown/operation_status/report', 'operationStatus')
      if (root.Operation_State_e[blowdownStatus.state] == root.Operation_State_e.O_S_IMMINENT){
        return {active: true, name: 'Blowdown', startTime: new Date(Number(blowdownStatus.startTime))}
      }

      return {active: false}
    },
    runningOperation(){
      let root = this.protobufRoot
      if (!root)
        return {active: false}
      let sanitationStatus =  this.topicMap('company/hot_supply/water_heater/sanitation_loop/operation_status/report', 'operationStatus')
    
      if (root.Operation_State_e[sanitationStatus.state] == root.Operation_State_e.O_S_RUNNING){
        return {active: true, name: 'Sanitation Loop', timeSince: new Date(Number(sanitationStatus.startTime))}
      }
      let blowdownStatus =  this.topicMap('company/hot_supply/water_heater/blowdown/operation_status/report', 'operationStatus')
      if (root.Operation_State_e[blowdownStatus.state] == root.Operation_State_e.O_S_RUNNING){
        return {active: true, name: 'Blowdown', endTime: new Date(Number(blowdownStatus.endTime))}
      }
      let chemicalShockStatus =  this.topicMap('company/hot_supply/water_heater/chemical_shock/operation_status/report', 'operationStatus')
      if (root.Operation_State_e[chemicalShockStatus.state] == root.Operation_State_e.O_S_RUNNING){
        return {active: true, name: 'Chemical Sanitation', timeSince: new Date(Number(chemicalShockStatus.startTime))}
      }
      return {active: false}
    },
    ...mapGetters([
      'eventData',
      'topicMap',
      'protobufRoot'
    ])
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
    refreshEventData() {
      if (this.protobufRoot) {
        this.getEventData({ query: { numberOfResults:10 } })
      }
    },
    cancelProcess() {
      let root = this.protobufRoot
      let event = root.lookupType("event")
      let payload = {
        component: root.Component_e.INVALID_COMPONENT,
        action: root.Action_e.CANCEL_OPERATION,
      }

      let errMsg = event.verify(payload);
      if (errMsg)
        throw Error(errMsg);
      
      this.publishEvent({ topic: 'company/system/event', value: payload })
    },
    stopProcess() {
      let root = this.protobufRoot
      let event = root.lookupType("event")
      let payload = {
        component: root.Component_e.INVALID_COMPONENT,
        action: root.Action_e.EMERGENCY_STOP,
      }

      let errMsg = event.verify(payload);
      if (errMsg)
        throw Error(errMsg);
      
      this.publishEvent({ topic: 'company/system/event', value: payload })
    }
  }
}
</script>

<style scoped lang="scss">
  .header .cancel {
    background-color: $white;
    padding: 10px; 
    color: darkblue; 
    font-weight: bold;
  }
  .header .stop-sign {
    position: relative; 
  }
  .header .stop-sign > img {
    height: 65px;
    width: 65px;
  }
  .header .stop-sign > span {
    font-size: 21px;
    position: absolute;
    left: 6px;
    top: 22px;
  }
  .header table td {
    vertical-align: inherit;
    padding-top: 10px;
  }
  .header table td:first-child {
    width: 225px;
  }
  .header table td:nth-child(2) {
    width: 75px;
  }
  .header table > tr:first-child {
    border-bottom: 1px lightgray solid;
  }
  .grid-area {
    padding-left: 42px;
    padding-right: 42px;
  }
</style>
