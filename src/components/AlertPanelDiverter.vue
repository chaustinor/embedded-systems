<template>
  <div>
    <alerts-base 
      :fields="fields" 
      :cssClass="cssClass"
      :status="status"
      :openModal="openModal">
      <template v-slot:svgs>
        <path v-show="isRunning" fill="#FFF" d="M17.57 2.63l-.173-.568c-.651-2.36-4.056-2.47-4.794 0C8.766 15.003.563 18.52.563 27.642.563 35.715 7.02 42.25 15 42.25c7.98 0 14.437-6.534 14.437-14.609 0-9.032-7.946-12.477-11.867-25.011zM15 37c-5.065 0-9.188-4.122-9.188-9.187a1.312 1.312 0 1 1 2.625 0A6.57 6.57 0 0 0 15 34.375 1.312 1.312 0 1 1 15 37z"/>
        <path v-show="!isRunning" fill="#09223F" d="M51.993 37.578l-11.39-8.803a14.8 14.8 0 0 0 .084-1.384c0-9.033-7.947-12.477-11.867-25.012l-.173-.567c-.652-2.36-4.056-2.47-4.794 0-1.273 4.294-3.025 7.544-4.798 10.31L3.73.277a1.313 1.313 0 0 0-1.843.23L.277 2.58a1.312 1.312 0 0 0 .23 1.842L48.77 41.723a1.313 1.313 0 0 0 1.842-.23l1.611-2.073a1.313 1.313 0 0 0-.231-1.842zm-40.18-10.187c0-2.443.599-4.481 1.535-6.409l22.45 17.351C33.253 40.61 29.918 42 26.25 42c-7.98 0-14.438-6.534-14.438-14.609z"/>
      </template>
      <template v-slot:title>
        <div v-if="isRunning">
          <span class="valve-open">Valve Open:</span><now class="countdown" format="hh:mm:ss" :targetTime="status.time"></now>
        </div>
      </template>
      <template v-slot:action-btn>
        <div v-if="status.state !== 'O_S_IDLE'" class="action-box" :class="cssClass" @click="openModal()">
          <span class="action-label">{{ status.actionLabel }}</span>
        </div> 
      </template>    
    </alerts-base>

    <modal-thresholds id="edit-valve" 
      :seedLft="0"
      :seedRgt="5"
      unitLft="%"
      unitRgt="MIN"
      :meta="adjustValve"
      :on-save="saveAdjustValve">
      <template v-slot:title>
        {{ meta.title }}
      </template>
      <template v-slot:sub-title>
        Adjust Valve
      </template>
    </modal-thresholds>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ModalThresholds from '../components/ModalThresholds.vue'
import Now from '../components/Now.vue'
import AlertsBase from '../components/AlertsBase.vue'

export default {
  name: 'AlertPanelDiverter',
  props: { status: Object, fields: Array, meta: Object },
  data(){
    return {
      topicBase: null,
      valveOpenTime: null,
      adjustValve: {
        titleLft: 'OPEN VALVE',
        titleRgt: 'DURATION',
        descLft: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
        descRgt: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut.',
      }
    };
  },
  components: {
    ModalThresholds,
    Now,
    AlertsBase
  },
  mounted(){
    this.valveOpenTime = this.alert? this.alert.msg : null
    this.topicBase = this.meta.topicBase
  },
  computed: {
    isRunning(){
      return this.status.state === 'O_S_RUNNING'
    },
    cssClass(){
      if (this.status.state === 'STATE_ERROR'){
        return 'error'
      }
      if (this.status.state === 'STATE_WARN'){
        return 'warning'
      }
      return this.status.state === 'O_S_RUNNING' ? 'running' : ''
    }
  },
  methods: {
    ...mapActions([
      'publishSet',
      'restrictAction'
    ]),
    openModal(){ 
      this.restrictAction({action: 'operation'}).then(()=>{
        this.$bvModal.show('edit-valve')
      })
      .catch((loggedIn)=>{

        let location = {
          name: "login",
          query: {loggedIn}
        };
        this.$router.push(location);
      })

    },
    saveAdjustValve(comment, percentOpen, duration){
      let schedule = {
        duration: duration,
        comment: this.comment,
        isOneTime: true,
        active: true,
        timestamp: (new Date()).getTime(),
        diverterSettings: {
          percentOpen: percentOpen
        }
      }

      this.publishSet({ topic: `${this.topicBase}/setpoint_position/request`, value: percentOpen })     
      this.publishSet({ topic: `${this.topicBase}/schedule/request`, value: schedule, type: 'schedule' })
    },
    openHelpCenter(){

    }
  }
};
</script>

<style scoped lang="scss">
  .title > div {
    display: flex;
  }
  .valve-open {
    padding-right: 7px;
  }
</style>

<style lang="scss">
  .alert.error {
    background-color: $red;
    color: $white;
  }
  .alert.warning {
    background-color: $mustard;
    color: $deep-blue;
  }
  .alert.running {
    background-color: $deep-blue;
    color: $white;
  }
  .alert-dropdown.warning,
  .alert-dropdown.error, 
  .alert-dropdown.running {
    background-color: $white !important;
  }
  .alert-dropdown.warning path,
  .alert-dropdown.error path,
  .alert-dropdown.running path {
    fill: $deep-blue;
  }
  .alert-dropdown.warning,
  .alert-dropdown.error,
  .alert-dropdown.running {
    width: 74px;
  }
  .alert.warning .dropdown-menu,
  .alert.error .dropdown-menu,
  .alert.running .dropdown-menu {
    width: unset;
  }
</style>
