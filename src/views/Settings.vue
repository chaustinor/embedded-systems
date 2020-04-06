<template>
  <base-layout>
    <template v-slot:header>
      <header-base>
        <div class="primary">Settings</div>
        <div class="secondary">{{ getUnitNameAndLoc }}</div>
      </header-base>
    </template>
    <div>
      <div class="px-5 pt-5">
        <h3>Lighting</h3>
        <div class="bar">
          <label>Cabinet Brightness</label>
          <div class="slider-area">
            <img class="brightness" src="../../public/assets/brightness-low.png">
            <div class="slider-container">
              <vue-slider
                v-model="cabinetLight"
                v-bind="options"
                @dragging="onCabinetSliderDrag">
              </vue-slider>
            </div>
            <img class="brightness" src="../../public/assets/brightness-high.png">
          </div>
        </div>
        <div class="bar">
          <label>Screen Brightness</label>
          <div class="slider-area">
            <img class="brightness" src="../../public/assets/brightness-low.png">
            <div class="slider-container">
              <vue-slider
                v-model="displayLight"
                v-bind="options"
                @dragging="onDisplaySliderChange">
              </vue-slider>
            </div>
            <img class="brightness" src="../../public/assets/brightness-high.png">
          </div>
        </div>
      </div>
      <div class="px-5 pt-5">
        <h3>User Accounts</h3>
        <div class="bar" v-if="currentUser" @click="gotoUser">
          <div class="label-grid">
            <div class="icon">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <defs>
                  <rect id="a" width="60" height="60" rx="4"/>
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <mask id="b" fill="#fff">
                    <use xlink:href="#a"/>
                  </mask>
                  <use fill="#F9F9F9" xlink:href="#a"/>
                  <path fill="#09223F" d="M203.34 94.53c1.721 3.413 3.788 7.665 5.66 11.47L208.99.983c0-.156-.143-.48-.362-.685-.322-.306-.745-.296-1.078-.296h-46.893c-.498 0-.8-.043-1.15.263a1.17 1.17 0 0 0-.408.718s-.187.625-.047 1.046c.137.423 44.287 92.5 44.287 92.5zM72.6 0H17l56.66 120.483c.366.555.659.844 1.232 1.157.775.429 1.515.352 2.628.352l51.473.004s.948.053 1.313-.24c.213-.176.694-.644.694-.644L72.6 0zm14.403 1.734c.155-.3.306-.581.614-.85C88.402.19 90.132 0 90.132 0h51.04c.478 0 .773.018 1.175.264.337.204.508.385.701.733l11.485 23.797L201 119.82c-.035.45-.074.7-.074.7-.075.488-.107.735-.409 1.052-.346.357-.672.428-1.193.428h-54.988S87.374 3.165 87.283 2.812c-.335-.796-.28-1.078-.28-1.078z" mask="url(#b)" opacity=".1"/>
                  <path fill="#6C7C93" fill-rule="nonzero" d="M30 29.5a7 7 0 0 0 7-7 7 7 0 0 0-7-7 7 7 0 0 0-7 7 7 7 0 0 0 7 7zm4.9 1.75a7.352 7.352 0 0 1 7.35 7.35v2.275a2.626 2.626 0 0 1-2.625 2.625h-19.25a2.626 2.626 0 0 1-2.625-2.625V38.6a7.352 7.352 0 0 1 7.35-7.35h.913a9.55 9.55 0 0 0 3.987.875 9.53 9.53 0 0 0 3.987-.875h.913z" mask="url(#b)"/>
                </g>
              </svg>
            </div>
            <span class="sub-label">Currently logged in</span>
            <label>{{ currentUser.firstName }} {{ currentUser.lastName }}</label>
          </div>
          <b-button @click="logoutUser">Log Out</b-button>
        </div>
        <div class="bar" @click="manageUsers">
          <div class="manage-users">
            <label>Manage Users</label>
            <span class="sub-label" style="margin-left: 5px;">({{ getUsers.length }})</span>
          </div>
          <svg width="10" viewBox="0 0 17 29" >
            <path fill="#0A233E" fill-rule="evenodd" d="M16.11 12.237l-.007-.007L5.258.934A2.993 2.993 0 0 0 3.092 0C2.31 0 1.524.311.926.934-.269 2.182-.27 4.2.926 5.446L9.45 14.5.898 23.554c-1.197 1.247-1.197 3.266 0 4.513a2.98 2.98 0 0 0 4.332 0l10.843-11.296.015-.014c.075-.08.15-.164.22-.25.026-.034.048-.071.075-.105.034-.048.068-.096.1-.146.03-.043.055-.089.08-.133.024-.045.053-.09.075-.134.025-.046.044-.093.065-.14.022-.049.045-.095.064-.143l.049-.14c.017-.051.036-.103.051-.155.015-.047.025-.095.034-.141.015-.054.029-.108.04-.161.011-.056.017-.112.024-.167a3.19 3.19 0 0 0 .019-.773 1.662 1.662 0 0 0-.019-.135c-.007-.06-.013-.115-.024-.173-.01-.052-.025-.104-.038-.155a1.376 1.376 0 0 0-.036-.147c-.013-.05-.032-.1-.05-.148-.016-.05-.031-.098-.05-.147a2.95 2.95 0 0 0-.06-.135c-.023-.048-.044-.1-.069-.148a2.675 2.675 0 0 0-.072-.124 2.166 2.166 0 0 0-.083-.143c-.028-.047-.06-.09-.093-.134-.028-.039-.054-.08-.085-.116a3.174 3.174 0 0 0-.195-.227"/>
          </svg>
        </div>
      </div>
      <div class="px-5 pt-5 network-connections">
        <h3>Network Connections</h3>
        <div class="bar">
          <div class="label-grid">
            <div class="icon">
              <svg width="43" height="43" viewBox="0 0 43 43">
                <path class="check" d="M43 22C43 9.626 33.374 0 22 0 9.626 0 0 9.626 0 22c0 11.374 9.626 21 22 21 11.374 0 21-9.626 21-21zM19 34c-.057.137-.943.137-1 0L8 24c-.137-.115-.137-1.006 0-2l2-2c.937-.097 1.823-.097 2 0l6 7 14-14c.177-.137 1.063-.137 2 0l2 2c.137.954.137 1.845 0 2L19 34z"/>
              </svg>
            </div>
            <div class="sub-label">Network</div>
            <label>{{ networkConnectionStatus }}</label>
          </div>
          <b-form-select v-model="selectedNetworkMode" class="network-enable" :options="enableToggleOpts"></b-form-select>
        </div>
        <div class="bar">
          <div class="label-grid">
            <div class="icon">
              <svg width="43" height="43" viewBox="0 0 43 43">
                <path class="check" d="M43 22C43 9.626 33.374 0 22 0 9.626 0 0 9.626 0 22c0 11.374 9.626 21 22 21 11.374 0 21-9.626 21-21zM19 34c-.057.137-.943.137-1 0L8 24c-.137-.115-.137-1.006 0-2l2-2c.937-.097 1.823-.097 2 0l6 7 14-14c.177-.137 1.063-.137 2 0l2 2c.137.954.137 1.845 0 2L19 34z"/>
              </svg>
            </div>
            <span class="sub-label">BAS MODBUS</span>
            <label>{{ basModbusConnectionStatus }}</label>
          </div>
          <b-form-select v-model="selectedBasMode" class="bas-enable" :options="enableToggleOpts"></b-form-select>
        </div>
        <div class="bar">
          <div class="label-grid">
            <div class="icon">
              <svg width="43" height="43" viewBox="0 0 43 43">
                <path class="check" d="M43 22C43 9.626 33.374 0 22 0 9.626 0 0 9.626 0 22c0 11.374 9.626 21 22 21 11.374 0 21-9.626 21-21zM19 34c-.057.137-.943.137-1 0L8 24c-.137-.115-.137-1.006 0-2l2-2c.937-.097 1.823-.097 2 0l6 7 14-14c.177-.137 1.063-.137 2 0l2 2c.137.954.137 1.845 0 2L19 34z"/>
              </svg>
            </div>
            <span class="sub-label">BACNET</span>
            <label>{{ bacnetConnectionStatus }}</label>
          </div>
          <b-form-select v-model="selectedBacnetMode" class="bacnet-enable" :options="enableToggleOpts"></b-form-select>
        </div>
      </div>
      <div class="px-5 pt-5 unit-details">
        <h3>Unit Details</h3>
        <div class="bar">
          <label>Unit Name</label>
          <input type="text" v-model.lazy="unitName" />
        </div>
        <div class="bar">
          <label>Unit Location</label>
          <input type="text" v-model.lazy="unitLocation" />
        </div>
        <div class="bar">
          <div class="serial-number">
            <span class="sub-label">Serial Number</span>
            <label>{{ serialNumber }}</label>
          </div>
        </div>
      </div>
      <div class="px-5 pt-5">
        <h3>Time</h3>
        <div class="bar">
          <label>Date &#38; Time</label>
          <div class="date-time-grp">
            <date-picker v-model="dateSelected" format="MMMM D, YYYY" class="date" @close="onDatePickerClose"></date-picker>
            <date-picker type="time" v-model="timeSelected" class="time" format="h:mm A" @close="onTimePickerClose"></date-picker>
          </div>
        </div>
        <div class="bar">
          <label>Timezone</label>
          <b-form-select v-model="selectedTimeZone" class="time-zone">
            <option :value="0">(UTC-05:00) Eastern Time (US &#38; Canada)</option>
            <option :value="1">(UTC-04:00) Central Time (US &#38; Canada)</option>
            <option :value="2">(UTC-03:00) Mountain Time (US &#38; Canada)</option>
            <option :value="3">(UTC-02:00) Pacific Time (US &#38; Canada)</option>
          </b-form-select>
        </div>
      </div>
      <div class="p-5 settings-units">
        <h3>Units</h3>
        <div class="bar">
          <label>Temperature</label>
          <b-form-select v-model="selectedTempUnits" class="temp-dropdown" :options="tempToggleOpts"></b-form-select>
        </div>
        <div class="bar">
          <label>Pressure</label>
          <b-form-select v-model="selectedPressureUnits" class="pressure-dropdown" :options="pressureToggleOpts"></b-form-select>
        </div>
        <div class="bar">
          <label>Pump Head</label>
          <b-form-select v-model="selectedPumpUnits" class="pump-dropdown" :options="pumpToggleOpts"></b-form-select>
        </div>
      </div>
      <div class="p-5 btn-grp">
        <b-button @click="gotoDocumentation" class="btn-documentation">Help Center Documentation</b-button>
        <b-button @click="executeFactoryReset" class="btn-factory-reset">Factory Reset</b-button>
      </div>
    </div>
  </base-layout>  
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'
import BaseLayout from './BaseLayout.vue'
import HeaderBase from '../components/HeaderBase.vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import moment from 'moment-timezone'

export default {
  name: 'Settings',
  components: {
    BaseLayout,
    HeaderBase,
    VueSlider,
    DatePicker
  },
  data(){
    return {
      ajustForDaylightSavings: true,
      cabinetLightLevel: 0,
      displayLghtLevel: 0,
      timeSelected: new Date(),
      dateSelected: new Date(),
      today: new Date(),
      options: {  
        dotSize: 75,
        contained: true,
        height: 45,
        lazy: true,
        railStyle: {
          backgroundImage: "linear-gradient(to right, rgba(21, 72, 115, 0.5), rgba(21, 72, 115, 0.15))",
          borderRadius: "22.2px"
        },
         dotStyle: {
          boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.5)",
          border: "solid 1.1px #E5E5E5",
          backgroundColor: "#FFFFFF"
        },
        processStyle: { backgroundColor: 'transparent' }
      },
      tempToggleOpts: [
        { text: 'Celsius', value: 'c' },
        { text: 'Fahrenheit', value: 'f' }
      ],
      pressureToggleOpts: [
        { text: 'Bar', value: 'b' },
        { text: 'PSI', value: 'p' }
      ],
      pumpToggleOpts: [
        { text: 'Meters', value: 'm' },
        { text: 'Feet', value: 'f' }
      ],      
      enableToggleOpts: [
        { text: 'On', value: 1 },
        { text: 'Off', value: 0 }
      ]
    }
  },
  computed: {
    ...mapState([
      'displayLightLevel'
    ]),
    ...mapGetters([
      'topicMap',
      'currentUser',
      'getUsers'
    ]),
    cabinetLight: {
      get:function(){
        return this.topicMap('company/enclosure/ambient_light_level/report')
      },
      set:function(newValue){
        this.cabinetLightLevel = newValue
      }
    },
    displayLight: {
      get:function(){
        return this.displayLightLevel
      },
      set:function(newValue){
        this.displayLghtLevel = newValue
      }
    },
    networkConnectionStatus: {
      get:function(){
        let status=this.topicMap('company/system/network_connected/report')
        if (status == 1){
          return "Connected"
        }
        else{
          return "Not Connected"
        }
      }
    },
    basModbusConnectionStatus: {
      get:function(){
        let status=this.topicMap('company/system/bas_modbus_connected/report')
        if (status == 1){
          return "Connected"
        }
        else{
          return "Not Connected"
        }
      }
    },
    bacnetConnectionStatus: {
      get:function(){
        let status=this.topicMap('company/system/bacnet_connected/report')
        if (status == 1){
          return "Connected"
        }
        else{
          return "Not Connected"
        }
      }
    },
    selectedTimeZone: {
      get:function(){
        let val=0
        let zone=this.topicMap('company/system/timezone/report', 'text')
        if (zone == "America/Chicago"){
          val=1
        }
        else if (zone == "America/Denver"){
          val=2
        }
        else if (zone == "America/Los_Angeles"){
          val=3
        }
        return val
      },
      set:function(index){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          var zonestring = "America/New_York"
          if (index == 1) {
            zonestring = "America/Chicago"
          }
          else if (index == 2) {
            zonestring = "America/Denver"
          }
          else if (index == 3) {
            zonestring = "America/Los_Angeles"
          }
          this.publishSet({ topic: 'company/system/timezone/request', value: zonestring, type: 'text'})
          this.selectedTimezone = index
          // Get timezone offset
          this.timeSelected = moment(moment() + (moment.tz(zonestring).utcOffset() - moment().utcOffset())*60000).toDate()
          this.dateSelected = moment(moment() + (moment.tz(zonestring).utcOffset() - moment().utcOffset())*60000).toDate()
        })
        .catch(()=>{
        })
      }
    },
    selectedTempUnits: {
      get:function(){
        return this.topicMap('company/system/temperature_units/report', 'text')
      },
      set:function(newValue){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          this.publishSet({ topic:'company/system/temperature_units/request', value:newValue, type:'text' })
        })
        .catch(()=>{
        })
      }
    },
    selectedPressureUnits: {
      get:function(){
        return this.topicMap('company/system/pressure_units/report', 'text')
      },
      set:function(newValue){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          this.publishSet({ topic:'company/system/pressure_units/request', value:newValue, type:'text' })
        })
        .catch(()=>{
        })
      }
    },
    selectedPumpUnits: {
      get:function(){
        return this.topicMap('company/cold_inlet/booster_pump/head_units/report', 'text')
      },
      set:function(newValue){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          this.publishSet({ topic:'company/cold_inlet/booster_pump/head_units/request', value:newValue, type:'text' })
        })
        .catch(()=>{
        })
      }
    },
    selectedNetworkMode: {
      get:function(){
        return this.topicMap('company/system/network_enabled/report')
      },
      set:function(newValue){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          this.publishSet({ topic:'company/system/network_enabled/request', value:newValue })
        })
        .catch(()=>{
        })
      }
    },
    selectedBasMode: {
      get:function(){
        return this.topicMap('company/system/bas_modbus_enabled/report')
      },
      set:function(newValue){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          this.publishSet({ topic:'company/system/bas_modbus_enabled/request', value:newValue })
        })
        .catch(()=>{
        })
      }
    },
    selectedBacnetMode: {
      get:function(){
        return this.topicMap('company/system/bacnet_enabled/report')
      },
      set:function(newValue){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          this.publishSet({ topic:'company/system/bacnet_enabled/request', value:newValue })
        })
        .catch(()=>{
        })
      }
    },
    getUnitNameAndLoc(){
      let n = this.topicMap('company/system/unit_name/report', 'text')
      let l = this.topicMap('company/system/unit_location/report', 'text')
      return n + ' ' + l
    },
    unitName: {
      get:function(){
        return this.topicMap('company/system/unit_name/report', 'text')
      },
      set:function(newValue){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          this.publishSet({ topic:'company/system/unit_name/request', value: newValue, type: 'text' })
        })
        .catch(()=>{
        })
      }
    },
    unitLocation: {
      get:function(){
        return this.topicMap('company/system/unit_location/report', 'text')
      },
      set:function(newValue){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          this.publishSet({ topic:'company/system/unit_location/request', value: newValue, type: 'text' })
        })
        .catch(()=>{
        })
      }
    },
    serialNumber: {
      get:function(){
        return this.topicMap('company/system/serial_number/report', 'text')
      }
    }
  },
  mounted(){
    this.publishGet('company/enclosure/ambient_light_level/request')
    this.publishGet(`${this.topicBase}/request`)
    this.publishGet('company/system/timezone/request') 
    this.publishGet('company/system/unit_name/request')
    this.publishGet('company/system/unit_location/request')
    this.publishGet('company/system/serial_number/request')
    this.publishGet('company/system/temperature_units/request')
    this.publishGet('company/system/pressure_units/request')
    this.publishGet('company/cold_inlet/booster_pump/head_units/request')
    this.publishGet('company/system/network_connected/request')
    this.publishGet('company/system/network_enabled/request')
    this.publishGet('company/system/bas_modbus_connected/request')
    this.publishGet('company/system/bas_modbus_enabled/request')
    this.publishGet('company/system/bacnet_connected/request')
    this.publishGet('company/system/bacnet_enabled/request')

    let timeZone = this.topicMap('company/system/timezone/report', 'text')
    // Get timezone offset
    this.timeSelected = moment(moment() + (moment.tz(timeZone).utcOffset() - moment().utcOffset())*60000).toDate()
    this.dateSelected = moment(moment() + (moment.tz(timeZone).utcOffset() - moment().utcOffset())*60000).toDate()

    this.publishGet('user/userlist/get/request')
    this.getDisplayLightLevel()
  },
  methods: {
    ...mapMutations([
       'toggleTempScale',
       'togglePressureScale',
       'toggleHeadUnit'
    ]),
    ...mapActions([
      'publishSet',
      'publishGet',
      'adjustDisplayLighting',
      'getDisplayLightLevel',
      'getTimezone',
      'logoutUser',
      'restrictAction'
    ]),
    onCabinetSliderDrag(value) {
      this.cabinetLightLevel = value;
      this.publishSet({ topic: 'company/enclosure/ambient_light_level/request', value: this.cabinetLightLevel })
    },
    onDisplaySliderChange(value) {
      this.displayLghtLevel = value;
      this.adjustDisplayLighting(this.displayLghtLevel)
    },
    manageUsers(){
      this.$router.push({ name: 'users'})
    },
    gotoUser(){
      this.$router.push({ name: 'user', query: { id: this.currentUser.userId }})
    },
    disconnectNetwork(){

    },
    disconnectModbus(){
      
    },
    gotoDocumentation(){

    },
    executeFactoryReset(){
    
    },
    onTimePickerClose(){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          let timeZone = this.topicMap('company/system/timezone/report', 'text')
          let time = moment(moment(this.timeSelected.valueOf()) - (moment.tz(timeZone).utcOffset() - moment().utcOffset())*60000).toDate()
          let newTime = Math.round(time.valueOf()/1000)
          this.publishSet({ topic:'company/system/timeset/request', value:newTime })
        }).close(()=>{
        })
    },
    onDatePickerClose(){
        this.restrictAction({action: 'systemSetting'}).then(()=>{
          let newTime = Math.round(this.dateSelected.valueOf()/1000)
          this.timeSelected = this.dateSelected
          this.publishSet({ topic:'company/system/timeset/request', value:newTime }) 
        }).close(()=>{
        })
    }
  }
}
</script>

<style lang="scss">
  .vue-slider {
    padding: 0 !important;
  }
  .network-connections .btn-group-toggle .btn-secondary:not(:disabled):not(.disabled).active,
  .network-connections .btn-group-toggle .btn-secondary:not(:disabled):not(.disabled):active,
  .settings-units .btn-group-toggle .btn-secondary:not(:disabled):not(.disabled).active,
  .settings-units .btn-group-toggle .btn-secondary:not(:disabled):not(.disabled):active {
    background-color: $white;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
    border: solid 0.5px $mortar;
    color: $deep-blue;
  }
  .vue-slider-dot-tooltip-inner {
    padding: 16px;
    font-size: 26px;
    background-color: $dark-teal;
    border-color: $dark-teal;
  }
</style>

<style scoped lang="scss">
  h3 {
    color: $deep-blue;
    font-size: 32px;
    margin-bottom: 20px;
    font-weight: 500;
  }
  label {
    font-size: 24px;
    margin-bottom: unset;
  }
  .unit-details input[type=text] {
    width: 600px;
  }
  .mx-datepicker.date {
    width: 344px;
  }
  .mx-datepicker.time {
    width: 263px;
  }
  .mx-datepicker.time .mx-icon-calendar,
  .mx-datepicker.am-pm .mx-icon-calendar {
    display: none !important;
  }
  .date-time-grp {
    display: inline-grid;
    grid-template-columns: auto auto auto;
    grid-column-gap: 10px;
  }
  .slider-container {
    width: 50vw;
    margin-left: 50px;
    margin-right: 50px
  }
  .bar {
    background-color: $deep-blue-faint;
    height: 106px;
    justify-content: space-between;
    padding-left: 25px;
    padding-right: 25px;
  }
  .bar:not(:last-child) {
    margin-bottom: 15px;
  }
  .btn,
  button {
    background-color: $grey;
    width: 191px;
    height: 60px;
    font-size: 18px;
    border: solid 1px $grey;
    color: $white;
  }
  .btn-documentation,
  .btn-factory-reset {
    font-size: 24px;
    height: 106px;
    width: 100%;
  }
  .btn-factory-reset {
    background-color: $brick;
  }
  .btn-grp {
    display: grid;
    grid-row-gap: 12px;
    border-top: solid 1px;
    border-top-color:rgba(9, 34, 63, .15);
  }
  .custom-select.network-enable,
  .custom-select.bas-enable,
  .custom-select.bacnet-enable,
  .custom-select.temp-dropdown,
  .custom-select.pressure-dropdown,
  .custom-select.pump-dropdown {
    width: 263px;
  }
  .custom-select.time-zone {
    width: 627px;
  }
  .check {
    fill: $deep-blue;
  }
  .label-grid {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 30px 30px;
    grid-column-gap: 15px;
  }
  .icon {
    grid-area: 1 / 1 / span 2 /span 1; 
  }
  .sub-label {
    color: $grey;
  }
  .serial-number {
    display: grid;
    grid-template-rows: auto auto;
    grid-row-gap: 5px;
  }
  .manage-users {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 5px;
  }
  .slider-area,
  .label-grid > *,
  .bar,
  .manage-users > * {
    display: flex;
    align-items: center;
  }
  .brightness {
    width: 23px;
  }
</style>
