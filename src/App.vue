<template>
  <div id="app" @click="deactivateLight">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapGetters([
      'protobufRoot'
    ])
  },
  mounted() {
    this.publishGet('company/system/temperature_units/request')
    this.publishGet('company/system/pressure_units/request')
    this.publishGet('company/cold_inlet/booster_pump/head_units/request')
  },
  methods: {
    ...mapActions([
      'publishEvent',
      'publishGet'
    ]),
    deactivateLight(){
      setTimeout(()=> { 
        let root = this.protobufRoot
        if (!root)
          return 
        
        let payload = {
          component: root.Component_e.INVALID_COMPONENT,
          action: root.Action_e.SNOOZE_ALARMS
        }

        this.publishEvent({ topic: 'company/system/event', value: payload })
      });
    }
  }
}
</script>

<style lang="scss">
  @import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
  @import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";

  @import '~bootstrap/scss/bootstrap.scss';
  @import '~bootstrap-vue/src/index.scss';

  @import './highcharts.css';
 
  @font-face {
    font-family: "HelveticaNeueLTStd-Md";
    src: url('../public/assets/fonts/HelveticaNeueLTStd-Md.otf');
  }
  @font-face {
    font-family: "HelveticaNeue";
    src: url('../public/assets/fonts/HelveticaNeueLTStd-Md.otf');
  }
  @font-face {
    font-family: "Helvetica Neue";
    src: url('../public/assets/fonts/HelveticaNeueLTStd-Md.otf');
  }
  html {
    overflow-y: auto !important;
    scroll-behavior: smooth;
  }
  body {
    margin:0;
    user-select: none;
    line-height: unset !important;
    font-size: 18px;
    font-weight: normal;
    font-family:"Helvetica Neue";
    touch-action:none;
  }
  #app {
    overflow-y: hidden;
    font-size: 18px;
    color: $deep-blue;
    box-sizing: border-box;
    background-image: linear-gradient(to bottom, #7eb5bb 0%, #b3ceca 21%, #d3dfd6 49%, #87b4c3 80%, #517d94 100%);
  }
  body::-webkit-scrollbar {
    display:none;
  }
  .background-gradient{fill:url(#linear-gradient);}
  .background {
    position:fixed;
    bottom: 0;
    z-index: -1;
  }
  .content {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .content > div {
    display: flex;
    justify-content: center;
  }
  .text-area {
    width: 100%; 
    border: solid 1px $light-grey;
    background-color: $white;
    color: $deep-blue; 
    font-size: 18px; 
    padding: 10px;
    resize: none;
    outline: none;
  }
  label {
    margin-bottom: 0;
  }
  .text-area::placeholder {
    color: $light-grey;
  }
  .header-shadow {
    width: 100%;
    height: 168px;
    position: absolute;
    top: 0;
  }  
  .modal-content {
    border-radius: 0;
  }
  .modal-content .form-text.text-muted {
    font-size: 18px;
    color: $grey;
  }
  .modal-title {
    font-size: 16px;
    color:$grey;
    font-weight: normal;
  }
  .modal-header {
    align-items: center;
  }
  .modal-body {
    color:$deep-blue;
  }
  .modal-body .panel {
    background-color: $deep-blue-faint;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    align-items: center;
    display: flex;
  }
  .modal-dialog.modal-md {
    max-width: 650px;
  }
  .modal-dialog .modal-header button.close {
    color: $deep-blue;
    font-size: 3rem;
    opacity: 1;
    font-weight: 200;
    padding-top: 4px;
  }
  .modal-dialog.modal-xl {
    max-width: 1010px;
  }
  .modal-footer > :not(:last-child) {
    margin-right: 0;
  }
  .modal-footer > :not(:first-child){
    margin-left: 0;
  }
  .modal-body button,
  .modal-footer button {
    border-radius: 0;
    width: 191px;
    height: 60px;
    font-size: 18px;
    border: 1px solid $sky-blue;
  }
  .modal-body button.cancel,
  .modal-footer button.cancel {
    color: $sky-blue;
    background-color: transparent;
  }
  .modal-body button.save,
  .modal-footer button.save {
    background-color: $sky-blue;
    color: $white;
  }
  .ag-theme-balham .ag-header {
    border: 1px solid $deep-blue;
  }
  .ag-theme-balham .ag-cell {
    color: $deep-blue;
  }
  .ag-theme-balham .ag-cell,
  .ag-theme-balham .ag-header-cell {
    font-size: 20px;
    display: flex;
    align-items: center;
  }
  .ag-theme-balham .ag-cell:first-child,
  .ag-theme-balham .ag-header-cell:first-child {
    padding-left: 35px;
  }
  .ag-theme-balham .ag-header-cell {
    background-color: $deep-blue;
    color: $white;
  }
  .ag-theme-balham .ag-header-cell:after {
    display: none;
  }
  .ag-theme-balham .ag-header-cell-label .ag-header-cell-text {
    align-items: center;
    display: flex;
  }
  .ag-theme-balham .ag-cell-focus, .ag-cell-no-focus {
    border: none !important;
  }
  .ag-theme-balham .ag-row {
    background-color: $white-smoke;
    border-color: $light-grey;
  }
  .ag-theme-balham.grid-event .summary {
    display: grid;
    grid-template-columns: 60px auto;
    grid-template-rows: 22px 18px;
    grid-column-gap: 20px;
    grid-row-gap: 2px;
  }
  .ag-theme-balham.grid-event .event-box {
    grid-area: 1 / 1 / span 2 /span 1; 
    color: $deep-blue;
    background-color: $light-grey;
    height: 36px;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-top: 5px;
  }
  .ag-theme-balham.grid-event .event-box.warning {
    background-color: $mustard;
  }
  .ag-theme-balham.grid-event .event-box.error {
    background-color: $red;
    color: $white;
  }
  .ag-theme-balham.grid-event .activity .comment {
    margin-left: 5px;
    color: $sky-blue;
  }
  .ag-theme-balham.grid-event .author,
  .ag-theme-balham.grid-event .date {
    font-size: 17px;
    color: $grey;
  }
  .custom-checkbox .custom-control-label::before {
    border-radius: 0;
    width: 20px;
    height: 20px;
  }
  .btn,
  .button,
  button {
    border-radius: 0;
  }
  button:disabled {
    opacity: .5;
  }
  .btn:focus,
  button:focus {
    outline: none;
    box-shadow: none;
  }
  .btn-secondary:not(:disabled):not(.disabled).active {
    border: 0;
    outline: none;
    box-shadow: none;
  }
  input[type=text] {
    height: 60px;
    border: solid 1px $grey;
    font-size: 24px;
    color: $deep-blue;
    padding-left: 25px;
    padding-right: 25px;
    border-radius: 0;
    outline: none;
  }
  .dropdown-divider {
    border-top: 2px solid $haze;
  }
  ol, ul {
    padding-left: 15px;
    margin-bottom: 0;
  }
  .nav-tabs {
    border-bottom: unset !important;
  }
  .nav-class {
    margin-left: -18px;
  }
  .nav-tabs .nav-item {
    margin-bottom: -2px;
  }
  .nav-tabs .nav-link {
    height: 72px;
    border-radius: 0;
    border: 2px solid $gray;
    background-color: $gray;
    color: $white;
    font-size: 30px;
    display: flex;
    align-items: center;
    padding-left: 3rem;
    padding-right: 3rem;
  }
  .nav-tabs .nav-link.active {
    border: 2px solid $gray;
    border-bottom: unset !important;
    background-color: transparent;
    color: $deep-blue;
  }
  .nav-tabs .nav-item {
    transform: skewX(24deg);
  }
  .tabs-filler {
    border-bottom: 2px solid $gray;
    transform: skewX(23deg);
    margin-bottom: -2px;
  }
  .tab-text {
    transform: skewX(-24deg);
  }
  .custom-select {
    padding-top: 9px;
    height: 70px;
    font-size: 24px;
    border-radius: 0;
    color: $deep-blue;
    padding-left: 25px;
    padding-right: 25px;
    border: solid 1px $grey;
    background: url('../public/assets/select.png') no-repeat right 1.25rem center/13px 20px;
    background-color: $white;
  }
  .custom-switch .custom-control-label {
    margin-left: -44px;
    margin-top: -15px
  }
  .custom-switch .custom-control-label::before {
    height: 48px;
    width: 80px;
    border-radius: 24.2px;
  }
  .custom-switch .custom-control-label::after {
    width: 44px;
    height: 44px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.5);
    border: solid 0.5px $mortar;
    background-color: $white;
    border-radius: 22px;
  }
  .custom-switch .custom-control-input:checked ~ .custom-control-label::after {
    transform: translateX(2rem);
  }
  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: $sky-blue;
    background-color: $sky-blue;
  }
  .btn-group-toggle .btn-secondary {
    background-color:rgba(247, 251, 251, 0.25);
    width: 100px;
    height: 70px;
    border: solid 1.5px $haze;
    font-size: 24px;
    color: $deep-blue;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dropdown-menu {
    border-radius: 0;
    margin-top: 0;
    font-size: 28px;
    color: $deep-blue;
  }
  .mx-datepicker-popup {
    z-index: 10000 !important;
  }
  .custom-control-input:focus ~ .custom-control-label::before { 
    box-shadow: none;
  }
  .custom-radio .custom-control-label::before,
  .custom-radio .custom-control-label::after {
    height: 40px;
    width: 40px;
    top: .5rem;
  }
  .custom-control-label > div {
    margin-left: 2rem;
  }
  .col-form-label,
  .d-block {
    text-transform: uppercase;
    opacity: 0.5;
    font-weight: bold;
    margin-bottom: .75rem;
    padding-bottom: 0;
  }
  .highcharts-loading {
    background-color: $deep-blue-faint !important;
  }
  .highcharts-loading-inner {
    font-size: 24px;
  }
  .highcharts-loading .highcharts-axis-line {
    display: none !important;
  }
</style>
