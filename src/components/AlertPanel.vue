<template>
  <div>
    <alerts-base 
      :fields="fields" 
      :cssClass="cssClass"
      :status="status"
      :openModal="openModal">
      <template v-slot:svgs>
        <path v-show="status.state === 'O_S_IDLE'" fill="#09223F" d="M43 22C43 9.626 33.374 0 22 0 9.626 0 0 9.626 0 22c0 11.374 9.626 21 22 21 11.374 0 21-9.626 21-21zM19 34c-.057.137-.943.137-1 0L8 24c-.137-.115-.137-1.006 0-2l2-2c.937-.097 1.823-.097 2 0l6 7 14-14c.177-.137 1.063-.137 2 0l2 2c.137.954.137 1.845 0 2L19 34z"/>
        <path v-show="isError" fill="#FFF" d="M23.999 0L48 42H0L23.999 0zm1.34 31.504h-3.128v3.161h3.128v-3.16zm-.225-17.172h-2.678v6.265l.705 8.857h1.268l.705-8.857v-6.265z"/>
        <path v-show="isWarning" fill="#09223F" d="M23.999 0L48 42H0L23.999 0zm1.34 31.504h-3.128v3.161h3.128v-3.16zm-.225-17.172h-2.678v6.265l.705 8.857h1.268l.705-8.857v-6.265z"/>
      </template>
      <template v-slot:title>
        {{ getTitle }}
      </template>
      <template v-slot:action-btn>
        <div v-if="status.state !== 'O_S_IDLE'" class="action-box" :class="cssClass" @click="openModal(status)">
          <span class="action-label">{{ status.actionLabel }}</span>
        </div>  
      </template>      
    </alerts-base>

    <modal-set-point id="edit-set-point-temp" 
      v-if="loaded"
      :seed="setPointTemperature"
      :min="getTemperatureMin"
      :max="getTemperatureMax"
      :unit="getTemperatureUnits"
      desc="Set Point Temperature"
      :on-save="(comment, setPoint) => saveSetPoint(comment, tempScaleSet(setPoint),)">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Edit Set Point
      </template>
      <template v-slot:note>
        Text associated to temperature...Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo.
      </template>
    </modal-set-point>

    <modal-set-point id="edit-set-point-pressure" 
      v-if="loaded"
      :seed="setPointHeadPressure"
      :min="getHeadPressureMin"
      :max="getHeadPressureMax"
      :step="0.1"
      :unit="getHeadPressureUnits"
      desc="Set Point Pressure"
      :on-save="(comment, setPoint) => saveSetPoint(comment, headScaleSet(setPoint),)">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Edit Set Point
      </template>
      <template v-slot:note>
        Text associated to pressure...Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo.
      </template>
    </modal-set-point>

    <modal-thresholds id="edit-alert-thresholds-hours" 
      v-if="loaded"
      :seedLft="orderLampHours"
      :seedRgt="replaceLampHours"
      unit="HRS"
      :meta="uvLampThresholds"
      :on-save="saveLampHoursThresholds">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Edit Alert Thresholds
      </template>
    </modal-thresholds>

    <modal-base id="anti-scald-toggle" 
      v-if="loaded"
      contentClass="anti-scald-modal"
      :hideHeaderClose="true"
      :showComment="true" 
      :ok="saveAntiScaldingOptions">
      <template v-slot:title>
        Mixing Valve
      </template>
      <template v-slot:sub-title>
        Anti-Scald Protection
      </template>
      <template v-slot:note>
        ENABLE ANTI-SCALD PROTECTION
      </template>
      <div class="my-3 p-3 scald-options">
        <b-form-select
          class="scaled-btn-grp"
          v-model="enableAntiScaldProtection"
          :options="[
              { text: 'On', value: 1 },
              { text: 'Off', value: 0 }
            ]"
          >
        </b-form-select>
      </div>
      <div class="note">
        Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fementum lorem ipsum
      </div>
      <template v-slot:btn-cancel>
        Discard Changes
      </template>
      <template v-slot:btn-ok-txt>
        Save Changes
      </template>
    </modal-base>

    <modal-thresholds id="edit-alert-thresholds-days" 
      v-if="loaded"
      :seedLft="orderMediaDays"
      :seedRgt="replaceMediaDays"
      unit="DAYS"
      :meta="mediaThresholds"
      :on-save="saveMediaThresholds">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Edit Alert Thresholds
      </template>
    </modal-thresholds>

    <modal-thresholds id="edit-alert-thresholds-temp" 
      v-if="loaded"
      :seedLft="lowAlertTemperature | tempScale"
      :seedRgt="highAlertTemperature | tempScale"
      :unit="getTemperatureUnits"
      :meta="waterHeaterThresholds"
      :on-save="(comment, lowAlert, highAlert) => {
        let low = tempScaleSet(lowAlert)
        let high = tempScaleSet(highAlert)
        saveAlertThresholds(comment, low, high)
      }">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Edit Alert Thresholds
      </template>
      <b-row class="mb-3">
        <b-col>
          <span>Out of Range Alerts</span>        
        </b-col>
      </b-row>
    </modal-thresholds>

    <modal-thresholds id="edit-alert-thresholds-pressure" 
      v-if="loaded"
      :seedLft="lowAlertPressure | headScale"
      :seedRgt="highAlertPressure | headScale"
      :step="0.1"
      :unit="getHeadPressureUnits"
      :meta="boosterPumpThresholds"
      :on-save="(comment, lowAlert, highAlert) => {
        let low = headScaleSet(lowAlert)
        let high = headScaleSet(highAlert)
        saveAlertThresholds(comment, low, high)
      }">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Edit Alert Thresholds
      </template>
    </modal-thresholds>

    <modal-thresholds id="edit-alert-thresholds-psi" 
      v-if="loaded"
      :seedLft="orderFilterPsi | pressureScale"
      :seedRgt="replaceFilterPsi | pressureScale"
      :step="getPressureStep"
      :unit="getPressureUnits"
      :meta="filterThresholds"
      :on-save="(comment, lowAlert, highAlert) => {
        let low = pressureScaleSet(lowAlert)
        let high = pressureScaleSet(highAlert) 
        saveFilterThresholds(comment, low, high)
      }">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Edit Alert Thresholds
      </template>
    </modal-thresholds>

    <modal-log id="ack-uv-lamp-order" 
      v-if="loaded"
      :on-save="acceptLogOrder">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Log Order
      </template>
      I acknowledge that the UV Lamp has been ordered or are available in inventory
      <template v-slot:note>
      Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo.
      </template>
    </modal-log>

    <modal-log id="ack-filter-order" 
      v-if="loaded"
      :on-save="acceptLogOrder">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Log Order
      </template>
      I acknowledge that the filter(s) has been ordered or is available in inventory.
      <template v-slot:note>
      Filter Cold water text...Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo.
      </template>
    </modal-log>

    <modal-log id="ack-media-order" 
      v-if="loaded"
      :on-save="acceptLogOrder">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Log Order
      </template>
      I acknowledge that the media has been ordered or is available in inventory.
      <template v-slot:note>
      Filter Cold water text...Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo.
      </template>
    </modal-log>

    <modal-log id="ack-uv-lamp-replaced" 
      v-if="loaded"
      :on-save="acceptLogReplace">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Log Replacement
      </template>
      I acknowledge that the UV Lamp has been replaced
      <template v-slot:note>
      Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo.
      </template>
    </modal-log>

     <modal-log id="ack-filter-replaced" 
      v-if="loaded"
      :on-save="acceptLogReplace">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Log Replacement
      </template>
      I acknowledge that the filter(s) have been replaced
      <template v-slot:note>
      Filter Cold water text...Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo.
      </template>
    </modal-log>

    <modal-set-point id="ack-media-replaced" 
      v-if="loaded"
      :seed="300"
      :min="0"
      :max="1000"
      unit=" Days"
      desc="New Media Lifetime"
      :on-save="acceptLogReplace">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Log Replacement
      </template>
      <template v-slot:note>
        Please specify the number of days the new media is projected to last as specified by the manufacturer
      </template>
    </modal-set-point>

    <modal-base id="calibrate-pressure-sensors" 
      v-if="loaded"
      :hideHeaderClose="true"
      :ok="calibratePressureSensors"
      :showComment="true">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Calibrate Pressure Sensors
      </template>
      <b-row class="pb-3">
        <b-col>
          Before initiating calibration, complete these steps:
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <check-panel v-for="(sensor, index) in pressureSensors" :key="index" v-model="sensor.checked">
              {{ sensor.desc }}
          </check-panel>
        </b-col>
      </b-row>
      <div class="note pt-2">
        Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo.
      </div>
      <template v-slot:btn-cancel>
        Cancel
      </template>
      <template v-slot:btn-ok="{ ok }">
        <button class="save" :disabled="!calibrateStepsAllChecked" @click="ok()">
          Start Calibration
        </button>
      </template>
    </modal-base>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ModalBase from '../components/ModalBase.vue'
import ModalLog from '../components/ModalLog.vue'
import ModalSetPoint from '../components/ModalSetPoint.vue'
import ModalThresholds from '../components/ModalThresholds.vue'
import AlertsBase from '../components/AlertsBase.vue'
import CheckPanel from '../components/CheckPanel.vue'

export default {
  name: 'AlertPanel',
  props: { status: Object, fields: Array, meta: Object },
  data(){
    return {
      topicBase: null,
      tempScale: null,
      loaded: false,
      headScale: null,      
      pressureScale: null,
      tempScaleSet: null,
      headScaleSet: null,
      enableAntiScaldProtection: 1,
      waterHeaterThresholds: {
        titleLft: 'LOW TEMPERATURE',
        titleRgt: 'HIGH TEMPERATURE',
        descLft: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
        descRgt: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
      },
      uvLampThresholds: {
        titleLft: 'ORDER LAMP',
        titleRgt: 'REPLACE LAMP',
        descLft: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
        descRgt: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
      },
      mediaThresholds: {
        titleLft: 'ORDER MEDIA',
        titleRgt: 'REPLACE MEDIA',
        descLft: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
        descRgt: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
      },
      boosterPumpThresholds: {
        titleLft: 'LOW PRESSURE',
        titleRgt: 'HIGH PRESSURE',
        descLft: 'Low pressure text... tellus ac cursus commodo, tortor mauris condimentum ',
        descRgt: 'High pressure text...sce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
      },
      filterThresholds: {
        titleLft: 'ORDER FILTER',
        titleRgt: 'REPLACE FILTER',
        descLft: 'Order filter text... tellus ac cursus commodo, tortor mauris condimentum ',
        descRgt: 'Replace filter text...sce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
      },
      adjustValve: {
        titleLft: 'OPEN VALVE',
        titleRgt: 'DURATION',
        descLft: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
        descRgt: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
      },
      pressureSensors: [
        { checked: false, desc: 'Replace Filter Media' },
        { checked: false, desc: 'Evacuate air from the filter canister' },
        { checked: false, desc: 'Open Inlet Valve(s) to allow continuous water flow through the filter' },
        { checked: false, desc: 'Close the isolation valve on the outlet side of the filter. At this point, the pressure on either side of the filter should be the same' }
      ]
    };
  },
  mounted(){
    this.tempScaleSet = this.$options.filters.tempScaleSet
    this.pressureScaleSet = this.$options.filters.pressureScaleSet
    this.headScaleSet = this.$options.filters.headScaleSet
    this.tempScale = this.$options.filters.tempScale
    this.loaded = true
    this.pressureScale = this.$options.filters.pressureScale
    this.headScale = this.$options.filters.headScale
    this.publishGet('company/system/temperature_units/request')
    this.publishGet('company/system/pressure_units/request')
    this.publishGet('company/cold_inlet/booster_pump/head_units/request')
  },
  components: {
    ModalLog,
    ModalSetPoint,
    ModalThresholds,
    ModalBase,
    AlertsBase,
    CheckPanel
  },
  computed: {
    ...mapGetters([
      'protobufRoot',
      'topicMap'
    ]),
    getTitle(){
      if (this.status.title) {
        return this.status.title
      }
      return 'No Alerts' 
    },
    calibrateStepsAllChecked(){
      return this.pressureSensors.filter(x => x.checked).length === this.pressureSensors.length
    },
    isWarning(){
      return this.status.state === 'STATE_WARN'
    },
    isError(){
      return this.status.state === 'STATE_ERROR'
    },
    cssClass(){
      if (this.status.state === 'STATE_WARN'){
        return 'warning'
      }
      if (this.status.state === 'STATE_ERROR'){
        return 'error'
      }
      return ''
    },
    getTemperatureMin() {
      let val = 7.22222 // degC
      if (this.tempScale){
        val = parseInt(this.tempScale(val))
      }
      return val
    },
    getTemperatureMax() {
      let val = 82.2222 // degC
      if (this.tempScale){
        val = parseInt(this.tempScale(val))
      }
      return val
    },
    getTemperatureUnits() {
      let u = this.topicMap('company/system/temperature_units/report', 'text')
      if (u == 'c') {
        return "°C"
      }
      return "°F"
    },   
    setPointTemperature() {
      var val;
      if(this.meta.setpointValueGet){
        val = this.meta.setpointValueGet(this.topicMap, this.topicBase)
      }
      else {
        val = this.topicMap(`${this.topicBase}/setpoint_temp/report`)
      }
      
      if (this.tempScale) {
        val = this.tempScale(val)
      }
     
      return val
    },
    getPressureUnits() {
      let u = this.topicMap('company/system/pressure_units/report', 'text')
      if (u == 'b') {
        return 'Δbar'
      }
      return 'ΔPSI' 
    },
    getPressureStep() {
      let u = this.topicMap('company/system/pressure_units/report', 'text')
      if (u == 'b') {
        return 0.1
      }
      return 1
    },
    getHeadPressureMin() {
      let val = 5 // ft
      if (this.headScale){
        val = parseFloat(this.headScale(val))
      }
      return val
    },
    getHeadPressureMax() {
      let val = 18 // ft
      if (this.headScale){
        val = parseFloat(this.headScale(val))
      }
      return val
    },
    setPointHeadPressure() {
      var val;
      if(this.meta.setpointValueGet){
        val = this.meta.setpointValueGet(this.topicMap, this.topicBase)
      }
      else {
        val = this.topicMap(`${this.topicBase}/setpoint_pressure/report`)
      }
      
      if (this.headScale){
        val = this.headScale(val)
      }
      
      return val
    },
    getHeadPressureUnits() {
      let u = this.topicMap('company/cold_inlet/booster_pump/head_units/report', 'text')
      if (u == 'm') {
        return 'm'
      }
      return 'ft'
    },
    lowAlertTemperature() {
      if(this.meta.lowAlertValueGet){
        return this.meta.lowAlertValueGet(this.topicMap, this.topicBase)
      }
      return this.topicMap(`${this.topicBase}/low_alert_temp/report`)
    },
    highAlertTemperature() {
      if(this.meta.highAlertValueGet){
        return this.meta.highAlertValueGet(this.topicMap, this.topicBase)
      }
      return this.topicMap(`${this.topicBase}/high_alert_temp/report`)
    },
    lowAlertPressure() {
      if(this.meta.lowAlertValueGet){
        return this.meta.lowAlertValueGet(this.topicMap, this.topicBase)
      }
      return this.topicMap(`${this.topicBase}/low_threshold/report`)
    },
    highAlertPressure() {
      if(this.meta.highAlertValueGet){
        return this.meta.highAlertValueGet(this.topicMap, this.topicBase)
      }
      return this.topicMap(`${this.topicBase}/high_threshold/report`)
    },
    alertPanelDropdownItems(){
      return this.meta.alertPanelData.dropdownItems
    },
    orderLampHours() {
      if(this.meta.orderLampHoursGet){
        return this.meta.orderLampHoursGet(this.topicMap, this.topicBase)
      }
      return 0
    },
    replaceLampHours() {
      if(this.meta.replaceLampHoursGet){
        return this.meta.replaceLampHoursGet(this.topicMap, this.topicBase)
      }
      return 0
    },
    orderMediaDays() {
      if(this.meta.orderMediaDaysGet){
        return this.meta.orderMediaDaysGet(this.topicMap, this.topicBase)
      }
      return 0
    },
    replaceMediaDays() {
      if(this.meta.replaceMediaDaysGet){
        return this.meta.replaceMediaDaysGet(this.topicMap, this.topicBase)
      }
      return 0
    },
    orderFilterPsi() {
      if(this.meta.orderFilterPsiGet){
        return this.meta.orderFilterPsiGet(this.topicMap, this.topicBase)
      }
      let val = this.topicMap(`${this.topicBase}/order_threshold/report`)
      return (val || val === 0) ? val.toFixed(1) : 0
    },
    replaceFilterPsi() {
      if(this.meta.replaceFilterPsiGet){
        return this.meta.replaceFilterPsiGet(this.topicMap, this.topicBase)
      }
      let val = this.topicMap(`${this.topicBase}/replace_threshold/report`)
      return (val || val === 0) ? val.toFixed(1) : 0
    }
  },
  methods: {
    ...mapActions([
      'publishSet',
      'publishGet',
      'publishEvent',
      'restrictAction'
    ]),
    getData() {
      this.topicBase = this.meta.topicBase
    },
    openModal(item){
      this.lowAlert = this.tempScale(this.lowAlertTemperature)
      this.highAlert = this.tempScale(this.highAlertTemperature)
      this.setPoint = this.tempScale(this.setPointTemperature)
      this.enableAntiScaldProtection = this.topicMap('company/tempered_supply/mixing_valve/anti_scald_enabled/report')
   
      this.publishGet('company/system/temperature_units/request')
      this.publishGet('company/system/pressure_units/request')
      this.publishGet('company/cold_inlet/booster_pump/head_units/request')
      
      this.restrictAction({action: item.actionType}).then(()=>{
        this.$bvModal.show(item.modal)
      })
      .catch((loggedIn)=>{

        let location = {
          name: "login",
          query: {loggedIn}
        };
        this.$router.push(location);
      })
    },
    subscribeToTopics(){
      if (this.historicalDataTable === 'water_table'){
        this.publishGet(`${this.topicBase}/setpoint_temp/request`)
        this.publishGet(`${this.topicBase}/high_alert_temp/request`)
        this.publishGet(`${this.topicBase}/low_alert_temp/request`)
      }
    },
    saveSetPoint(comment, setPoint){
      this.pushEvent(comment)
      this.meta.setpointValueSet(this.publishSet, this.topicBase, setPoint)
    },
    saveAlertThresholds(comment, lowAlert, highAlert){
      this.pushEvent(comment)
      
      this.meta.lowAlertValueSet(this.publishSet, this.topicMap, this.topicBase, lowAlert)
      this.meta.highAlertValueSet(this.publishSet, this.topicMap, this.topicBase, highAlert)
    },
    acceptLogOrder(comment){
      let root = this.protobufRoot
      let event = root.lookupType("event")
      let payload = {
        component: root.Component_e[this.meta.protobufComp],
        action: root.Action_e.ORDERED,
        comment: comment
      }

      let errMsg = event.verify(payload);
      if (errMsg)
        throw Error(errMsg);
    
      this.publishEvent({ topic: 'company/system/event', value: payload })
    },
    acceptLogReplace(comment, lifetime){
      let root = this.protobufRoot
      let event = root.lookupType("event")
      let payload = {
        component: root.Component_e[this.meta.protobufComp],
        action: root.Action_e.REPLACED,
        comment: comment
      }

      let errMsg = event.verify(payload);
      if (errMsg)
        throw Error(errMsg);
    
      this.publishEvent({ topic: 'company/system/event', value: payload })
      if (this.meta.name == 'anti_scaling'){
        this.publishSet({ topic: `${this.topicBase}/media_lifetime/request`, value: lifetime})
      }
    },
    saveLampHoursThresholds(comment, orderLampHrs, replaceLampHrs) {
      this.pushEvent(comment)
     
      this.meta.orderLampHoursSet(this.publishSet, this.topicMap, this.topicBase, orderLampHrs)
      this.meta.replaceLampHoursSet(this.publishSet, this.topicMap, this.topicBase, replaceLampHrs)
    },
    saveFilterThresholds(comment, orderThresh, replaceThresh) {
      this.pushEvent(comment)

      this.meta.orderFilterPsiSet(this.publishSet, this.topicMap, this.topicBase, orderThresh)
      this.meta.replaceFilterPsiSet(this.publishSet, this.topicMap, this.topicBase, replaceThresh)
    },
    saveMediaThresholds(comment, orderMediaDays, replaceMediaDays) {
      this.pushEvent(comment)
     
      this.meta.orderMediaDaysSet(this.publishSet, this.topicMap, this.topicBase, orderMediaDays)
      this.meta.replaceMediaDaysSet(this.publishSet, this.topicMap, this.topicBase, replaceMediaDays)
    },
    calibratePressureSensors(comment){
      let root = this.protobufRoot
      this.pushEvent(comment, action=root.Action_e.CALIBRATED)
    },
    saveAntiScaldingOptions(comment){
      this.pushEvent(comment) 
      this.publishSet({ topic: 'company/tempered_supply/mixing_valve/anti_scald_enabled/request', value: this.enableAntiScaldProtection })
    },
    pushEvent(comment, action=this.protobufRoot.Action_e.CHANGED_THRESH){
      let root = this.protobufRoot
      let event = root.lookupType("event")
      
      let payload = {
        component: root.Component_e[this.meta.protobufComp],
        action: action,
        comment: comment
      }
      let errMsg = event.verify(payload)
      if (errMsg)
        throw Error(errMsg)
      
      this.publishEvent({ topic: 'company/system/event', value: payload })
    },
    openHelpCenter(){

    }
  },
  watch: {
    meta: {
      handler: function() {
        this.getData()
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
  .alert.error {
    background-color: $red;  
    color: $white;
  }
  .alert.warning {
    background-color: $mustard;  
    color: $deep-blue;
  }
  .alert-dropdown.warning,
  .alert-dropdown.error {
    background-color: $white !important;
  }
  .alert-dropdown.warning path,
  .alert-dropdown.error path {
    fill: $deep-blue;
  }
  .alert-dropdown.warning,
  .alert-dropdown.error {
    width: 74px;
  }  
  .alert.warning .dropdown-menu,
  .alert.error .dropdown-menu {
    width: unset;
  }
  .anti-scald-modal .scald-options {
    background-color: $deep-blue-faint;
  }
  .anti-scald-modal .scaled-btn-grp {
    width: 100%;
  }
  .anti-scald-modal .btn-group-toggle .btn-secondary {
    background-color: $white;
    color: $deep-blue;
    border: solid 2px $haze;
  }
  .anti-scald-modal .btn-group-toggle .btn-secondary.active {
    background-color: transparent;
    color: $deep-blue;
    border: solid 2px $haze;
  }
</style>
