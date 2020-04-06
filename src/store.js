import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

const protobuf = require("protobufjs");

Vue.use(Vuex)

const state = {
  protos: null,
  router: null,
  connected: false,
  convertTempScale: true,
  convertPressureScale: false,
  convertHeadUnit: false,
  error: '',
  baseServer: `http://${window.location.hostname}:3000`,
  historicalData: [],
  eventData: [],
  topicMapLastUpdate: new Date(),
  topicMap: new Map(),
  currentRoute: null,
  displayLightLevel: 0,
  isScrolling: null,
  userToken:null,
  extendedViews: [{
    name: 'recirc_sediment_filter',
    topicBase: 'company/recirc_inlet/sediment_filter',
    title: 'Filter: Recirculation',
    protobufComp: 'RECIRC_SEDIMENT_FILTER',
    images: ['filter-recirc-3', 'filter-recirc-1', 'filter-recirc-2']
  },
  {
    name: 'cold_sediment_filter',
    topicBase: 'company/cold_inlet/sediment_filter',
    title: 'Filter: Cold Water',
    protobufComp: 'COLD_SEDIMENT_FILTER',
    images: ['filter-cold-inlet-3', 'filter-cold-inlet-1', 'filter-cold-inlet-2']
  },
  {
    name: 'cold_uv_disinfect',
    topicBase: 'company/cold_inlet/uv_disinfect',
    title: 'UV: Cold Water',
    protobufComp: 'COLD_UV_DISINFECT',
    images: ['uv-cold-2', 'uv-cold-3', 'uv-cold-1']
  },
  {
    name: 'recirc_uv_disinfect',
    topicBase: 'company/recirc_inlet/uv_disinfect',
    title: 'UV: Recirculation',
    protobufComp: 'RECIRC_UV_DISINFECT',
    images: ['uv-recirc-3', 'uv-recirc-2', 'uv-recirc-1']
  },
  {
    name: 'cold_temp_sensor',
    topicBase: 'company/cold_inlet/temp_sensor',
    title: 'Cold Temp Sensor',
    protobufComp: 'COLD_TEMP_SENSOR',
  },
  {
    name: 'recirc_temp_sensor',
    topicBase: 'company/recirc_inlet/temp_sensor',
    title: 'Recirc Temp Sensor',
    protobufComp: 'RECIRC_TEMP_SENSOR',
  },
  {
    name: 'hot_temp_sensor',
    topicBase: 'company/hot_supply/temp_sensor',
    title: 'Hot Temp Sensor',
    protobufComp: 'HOT_TEMP_SENSOR',
  },
  {
    name: 'tempered_temp_sensor',
    topicBase: 'company/tempered_supply/temp_sensor',
    title: 'Tempered Temp Sensor',
    protobufComp: 'TEMPERED_TEMP_SENSOR',
  }],
  views: [{ 
    name: 'water_heater', 
    title: 'Water Heater',
    protobufComp: 'WATER_HEATER',
    topicBase: 'company/hot_supply/water_heater',
    images: ['water-heater-1', 'water-heater-2'],
    alertPanelData: {
      dropdownItems: [
        {modal: 'edit-set-point-temp', text: 'Edit Set Point', actionType: 'setting'},
        {modal: 'edit-alert-thresholds-temp', text: 'Edit Alert Thresholds', actionType: 'setting'}
      ],
      computedStatus: (topicMap, topicBase) => {
        // Compute the status of the water heater alert component
        let status = topicMap(`${topicBase}/status/report`, 'state') || {}

        if (status.state === 'STATE_OK') {
          return { state: 'O_S_IDLE' }
        }
        else {
          return { state: status.state, title: status.text, actionLabel: 'Edit Alert Thresholds', modal: 'edit-alert-thresholds-temp', actionType: 'setting' } 
        }
      }
    },
    statusBarData: {
      topics: [
        'setpoint_temp',
        'outlet_temp',
        'low_alert_temp',
        'high_alert_temp',
        'status'
      ],
      markers: [{ 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/low_alert_temp/report`)
          },
          color: 'red',
          name: 'Low Threshold'
        },
        { 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/setpoint_temp/report`)
          },
          color: 'gray',
          name: 'Set Point'
        },
        { 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/high_alert_temp/report`)
          },
          color: 'red',
          name: 'High Threshold'
      }],
      header: 'Process Output',
      currentValue: (topicMap, topicBase) => {
        let val = topicMap(`${topicBase}/outlet_temp/report`)
        return (val || val === 0) ? val.toFixed(0) : 'N/A'
      },
      units: (convertTempScale, convertPressureScale, convertHeadUnit) => {
        if (convertTempScale){
          return '°F' 
        }
        return '°C'
      }
    },
    setpointValueGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/setpoint_temp/report`)
    },
    setpointValueSet: (publishSet, topicBase, value) => {
      publishSet({ topic: `${topicBase}/setpoint_temp/request`, value: value })
    },
    lowAlertValueGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/low_alert_temp/report`)
    },
    lowAlertValueSet: (publishSet, topicMap, topicBase, value) => {
      publishSet({ topic: `${topicBase}/low_alert_temp/request`, value: value })
    },
    highAlertValueGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/high_alert_temp/report`)
    },
    highAlertValueSet: (publishSet, topicMap, topicBase, value) => {
      publishSet({ topic: `${topicBase}/high_alert_temp/request`, value: value })
    },
    gridOptions: {
      columnDefs: [{
        headerName: 'Date & Time', 
        width: 70,
        minWidth: 70,
        valueGetter: ({ data }) => {
          let date = moment(data.time)
          return `${date.format('MM/DD/YYYY')} at ${date.format('h:mm a')} EST` // TODO Use configured TZ?
        } 
      },
      {
        headerName: 'Set Point', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data})  => {
          return colDef.tempScale(data.setpoint, 0)
        }  
      },
      {
        headerName: 'Inlet', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data}) => {
          return colDef.tempScale(data.inlet_temp, 0)
        },
      },
      {
        headerName: 'Outlet', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data}) => {
          return colDef.tempScale(data.outlet_temp, 0)
        }  
      },
      {
        headerName: 'Low Limit', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data}) => {
          return colDef.tempScale(data.low_alert, 0)
        }  
      },
      {
        headerName: 'High Limit', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data}) => {
          return colDef.tempScale(data.high_alert, 0)
        }  
      }]
    },
    chart: {
      yAxis: {
        isTemp: true,
        labels: {}   
      },
      series: [
        { color: '#09223f', name: 'Process Output', field: 'outlet_temp', yAxis: 1 },
        { color: '#6c7c93', name: 'Set Point', field: 'setpoint', yAxis: 1, referenceLine: true },
        { color: '#dd0000', name: 'High Limit', id:"high_limit", field: 'high_alert', yAxis: 1, referenceLine: true },
        { color: '#dd0000', name: 'Low Limit', id:"low_limit", field: 'low_alert', yAxis: 1, referenceLine: true }
      ]
    } 
  },
  { 
    name: 'mixing_valve', 
    title: 'Mixing Valve',
    protobufComp: 'MIXING_VALVE',
    topicBase: 'company/tempered_supply/mixing_valve',
    images: ['mixing-valve-2', 'mixing-valve-1', 'mixing-valve-3'],
    alertPanelData: {
      dropdownItems: [
        {modal: 'edit-set-point-temp', text: 'Edit Set Point', actionType: 'setting'},
        {modal: 'edit-alert-thresholds-temp', text: 'Edit Alert Thresholds', actionType: 'setting'},
        {modal: 'anti-scald-toggle', text: 'Configure Anti-Scald Protection', actionType: 'setting'},
      ],
      computedStatus: (topicMap, topicBase) => {
        // Compute the status of the mixing valve alert component
        let status = topicMap(`${topicBase}/status/report`, 'state') || {}

        if (status.state === 'STATE_OK') {
          return { state: 'O_S_IDLE' }
        }
        else {
          return { state: status.state, title: status.text, actionLabel: 'Edit Alert Thresholds', modal: 'edit-alert-thresholds-temp', actionType: 'setting' } 
        }
      }
    },
    statusBarData: {
      topics: [
        'outlet_setpoint_temp',
        'outlet_actual_temp',
        'low_alert_temp',
        'high_alert_temp',
        'anti_scald_enabled'
      ],
      markers: [{ 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/outlet_setpoint_temp/report`) - topicMap(`${topicBase}/low_alert_temp/report`)
          },
          color: 'yellow',
          name: 'Low Temp'
        },
        { 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/outlet_setpoint_temp/report`)
          },
          color: 'gray',
          name: 'Set Point'
        },
        { 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/outlet_setpoint_temp/report`) + topicMap(`${topicBase}/high_alert_temp/report`)
          },
          color: 'yellow',
          name: 'High Temp'
      }],
      header: 'Tempered Supply',
      currentValue: (topicMap, topicBase) => {
        return topicMap(`${topicBase}/outlet_actual_temp/report`)
      },
      units: (convertTempScale, convertPressureScale, convertHeadUnit) => {
        if (convertTempScale){
          return '°F'
        }
        return '°C'
      }
    },
    setpointValueGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/outlet_setpoint_temp/report`)
    },
    setpointValueSet: (publishSet, topicBase, value) => {
      publishSet({ topic: `${topicBase}/outlet_setpoint_temp/request`, value: value })
    },
    lowAlertValueGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/outlet_setpoint_temp/report`) - topicMap(`${topicBase}/low_alert_temp/report`)
    },
    lowAlertValueSet: (publishSet, topicMap, topicBase, value) => {
      let lowValue = topicMap(`${topicBase}/outlet_setpoint_temp/report`) - value
      publishSet({ topic: `${topicBase}/low_alert_temp/request`, value: lowValue })
    },
    highAlertValueGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/outlet_setpoint_temp/report`) + topicMap(`${topicBase}/high_alert_temp/report`)
    },
    highAlertValueSet: (publishSet, topicMap, topicBase, value) => {
      let highValue = value - topicMap(`${topicBase}/outlet_setpoint_temp/report`)
      publishSet({ topic: `${topicBase}/high_alert_temp/request`, value: highValue })
    },
    gridOptions: {
      columnDefs: [{
        headerName: 'Date & Time', 
        width: 70,
        minWidth: 70,
        valueGetter: ({ data }) => {
          let date = moment(data.time)
          return `${date.format('MM/DD/YYYY')} at ${date.format('h:mm a')} EST`
          //return moment(data.timestamp * 1000).format('MM/DD/YYYY at')
        } 
      },
      {
        headerName: 'Set Point', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data})  => {
          return colDef.tempScale(data.setpoint, 0)
        }  
      },
      {
        headerName: 'Tempered Supply', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data}) => {
          return colDef.tempScale(data.low_supply_temp, 0)
        },
      },
      {
        headerName: 'Low Limit', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data}) => {
          return colDef.tempScale(data.low_alert, 0)
        }  
      },
      {
        headerName: 'High Limit', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data}) => {
          return colDef.tempScale(data.high_alert, 0)
        }  
      }]
    },
    chart: {
      yAxis: {
        isTemp: true,
        labels: {}   
      },
      series: [
        { color: '#09223f', name: 'Tempered Supply', field: 'low_supply_temp', yAxis: 1 },
        { color: '#6c7c93', name: 'Set Point', field: 'setpoint', yAxis: 1, referenceLine: true },
        { color: '#dba53c', name: 'High Limit', field: 'high_alert', yAxis: 1, referenceLine: true },
        { color: '#dba53c', name: 'Low Limit', field: 'low_alert', yAxis: 1, referenceLine: true }
      ]
    } 
  },
  { 
    name: 'filter',
    alertPanelData: {
      dropdownItems: [
        {modal: 'ack-filter-order', text: 'Log Order', actionType: 'maintenance'},
        {modal: 'ack-filter-replaced', text: 'Log Replacement', actionType: 'maintenance'},
        {modal: 'calibrate-pressure-sensors', text: 'Calibrate Pressure Sensors', actionType: 'maintenance'},
        {modal: 'edit-alert-thresholds-psi', text: 'Edit Alert Thresholds', actionType: 'setting'}
      ],
      computedStatus: (topicMap, topicBase) => {
        // Compute the status of the filter component
        let status = topicMap(`${topicBase}/status/report`, 'state') || {}

        if (status.state === 'STATE_OK') {
          return { state: 'O_S_IDLE' }
        }
        else {
          var a = 'Log Order'
          var m = 'ack-filter-order'
          if (status.text){
            if (status.text.toLowerCase().includes("replace")){
              a = 'Log Replacement'
              m = 'ack-filter-replaced'
            }
          }
          return { state: status.state, title: status.text, actionLabel: a, modal: m, actionType: 'maintenance' } 
        }
      }
    },
    isPressure: true,
    chart: {
      xAxis: {
        labels: {
          formatter: function() {
            return moment(this.value).format("M/D HH:mm");
          }
        }
      },
      yAxis: {
        labels: {
          format: '{value} PSI' // TODO toggle based on convertPressureScale
        }   
      },
      series: [
        { yAxis: 1, color: '#09223f', name: 'Δ', field: 'pressure_delta', isPressure: true }, 
        { yAxis: 1, color: '#dba53c', name: 'Order Filter', field: 'order_threshold', referenceLine: true, isPressure: true },
        { yAxis: 1, color: '#dba53c', name: 'Replace Filter', field: 'replace_threshold', referenceLine: true, isPressure: true }
      ]
    },
    statusBarData: {
      topics: [
        'order_threshold',
        'replace_threshold',
        'pressure_delta',
        'status'
      ],
      markers: [{ 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/replace_threshold/report`)
          },	     
          color: 'yellow'
        },
        { 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/order_threshold/report`) 
          },
          color: 'yellow'
        },
        { 
          computed: (topicMap, topicBase) => {
            return 0
          },
          label: ' ',
          color: 'gray'
      }],
      header: 'Pressure Delta',
      currentValue: (topicMap, topicBase) => {
        let val = topicMap(`${topicBase}/pressure_delta/report`)
        return (val || val === 0) ? val.toFixed(1) : 0 
      },
      units: (convertTempScale, convertPressureScale, convertHeadUnit) => {
        if (convertPressureScale){
          return 'Δbar'
        }
        return 'ΔPSI'
      },
      isNegative: true
    },
    gridOptions: {
      columnDefs: [{
        headerName: 'Date & Time', 
        width: 80,
        minWidth: 80,
        valueGetter: ({ data }) => {
          return `${moment(data.time).format('M/D/YYYY')} - ${moment(data.time).format('hh:mm')}`
        } 
      },
      {
        headerName: 'Inlet', 
        width: 50,
        minWidth: 50,
        valueGetter: ({ colDef, data }) => {
          return (data.pressure_before || data.pressure_before === 0) ? colDef.pressureScale(data.pressure_before): ''
        }  
      },
      {
        headerName: 'Outlet', 
        width: 60,
        minWidth: 60,
        valueGetter: ({ colDef, data }) => {
          return (data.pressure_after || data.pressure_after === 0) ? colDef.pressureScale(data.pressure_after): ''
        }  
      },
      {
        headerName: 'Δ', 
        width: 60,
        minWidth: 60,
        valueGetter: ({ colDef, data }) => {
          return (data.pressure_delta || data.pressure_delta === 0) ? colDef.pressureScale(data.pressure_delta): ''
        }  
      },
      {
        headerName: 'Order', 
        width: 70,
        minWidth: 70,
        valueGetter: ({ colDef, data }) => {
          return (data.order_threshold || data.order_threshold === 0) ? colDef.pressureScale(data.order_threshold): ''
        }
      },
      {
        headerName: 'Replace', 
        width: 70,
        minWidth: 70,
        valueGetter: ({ colDef, data }) => {
          return (data.replace_threshold || data.replace_threshold === 0) ? colDef.pressureScale(data.replace_threshold): ''
        }
      }]
    },
    orderFilterPsiGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/order_threshold/report`)
    },
    orderFilterPsiSet: (publishSet, topicMap, topicBase, value) => {
      publishSet({ topic: `${topicBase}/order_threshold/request`, value: value })
    },
    replaceFilterPsiGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/replace_threshold/report`)
    },
    replaceFilterPsiSet: (publishSet, topicMap, topicBase, value) => {
      publishSet({ topic: `${topicBase}/replace_threshold/request`, value: value })
    },
  },
  { 
    name: 'anti_scaling',  
    title: 'Anti-Scale',
    topicBase: 'company/cold_inlet/anti_scaling',
    protobufComp: 'ANTI_SCALING',
    images: ['anti-scale-2', 'anti-scale-1'],
    gridOptions: {
      columnDefs: [{
        headerName: 'Date - Time', 
        width: 35,
        minWidth: 35,
        valueGetter: ({ data }) => {
          return ' '
        }  
      },
      {
        headerName: 'Event #', 
        valueGetter: ({ data }) => {
          return ' '
        },
        width: 20,
        minWidth: 20
      },
      {
        cellClass: 'vertical',
        headerName: 'Open/Closed', 
        width: 10,
        minWidth: 10,
        valueGetter: ({ data }) => {
          return ' '
        }  
      },
      {
        headerName: 'Comments', 
        width: 70,
        minWidth: 70,
        cellStyle: { 'text-align': "left" },
        valueGetter: ({ data }) => {
          return ' '
        }  
      },
      {
        headerName: 'Initials', 
        width: 15,
        minWidth: 15,
        valueGetter: ({ data }) => {
          return ' '
        }  
      }]
    },
    alertPanelData: {
      dropdownItems: [
        {modal: 'ack-media-order', text: 'Log Order', actionType: 'maintenance'},
        {modal: 'ack-media-replaced', text: 'Log Replacement', actionType: 'maintenance'},
        {modal: 'edit-alert-thresholds-days', text: 'Edit Alert Thresholds', actionType: 'setting'}
      ],
      computedStatus: (topicMap, topicBase) => {
        // Compute the status of the anti-scale component
        let status = topicMap(`${topicBase}/status/report`, 'state') || {}

        if (status.state === 'STATE_OK') {
          return { state: 'O_S_IDLE' }
        }
        else {
          var a = 'Log Order'
          var m = 'ack-media-order'
          if (status.text){
            if (status.text.toLowerCase().includes("replace")){
              a = 'Log Replacement'
              m = 'ack-media-replaced'
            }
          }
          return { state: status.state, title: status.text, actionLabel: a, modal: m, actionType: 'maintenance' }
        }
      }
    },
    orderMediaDaysGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/order_threshold/report`)
    },
    orderMediaDaysSet: (publishSet, topicMap, topicBase, value) => {
      publishSet({ topic: `${topicBase}/order_threshold/request`, value: value })
    },
    replaceMediaDaysGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/replace_threshold/report`)
    },
    replaceMediaDaysSet: (publishSet, topicMap, topicBase, value) => {
      publishSet({ topic: `${topicBase}/replace_threshold/request`, value: value })
    },
    statusBarData: {
      topics: [
        'media_life_rem',
        'media_lifetime',
        'order_threshold',
        'replace_threshold',
        'status'
      ],
      markers: [{ 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/replace_threshold/report`)   
          },
          color: 'yellow'
        },
        { 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/order_threshold/report`)   
          },
          color: 'yellow'
        },
        { 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/media_lifetime/report`) 
          },
          color: 'gray'
      }],
      header: 'Media Life',
      currentValue: (topicMap, topicBase) => {
        return topicMap(`${topicBase}/media_life_rem/report`)
      },
      units: () => {
        return 'DAYS'
      }
    },
    chart: {
      xAxis: {
        labels: {
          formatter: function() {
            return moment(this.value).format("M/D HH:mm");
          }
        }
      },
      yAxis: {
        isTemp: false,
        labels: {
          format: '{value}°'
        }   
      },
      series: [
        { color: '#09223f', name: 'Media Life', field: 'media_life', yAxis: 1 },
        { color: '#6c7c93', name: 'Expected Life', field: 'expected_life', yAxis: 1, referenceLine: true },
        { color: '#dba53c', name: 'Order Threshold', field: 'order', yAxis: 1, referenceLine: true },
        { color: '#dba53c', name: 'Replace Threshold', field: 'replace', yAxis: 1, referenceLine: true }
      ]
    } 
  },
  { 
    name: 'diverter_valve', 
    title: 'Diverter Valve', 
    protobufComp: 'DIVERTER_VALVE',
    topicBase: 'company/recirc_inlet/diverter_valve',
    images: ['diverter-valve-1', 'diverter-valve-2', 'diverter-valve-3'],
    gridOptions: {
      columnDefs: [{
        headerName: 'Date & Time', 
        width: 35,
        minWidth: 35,
        valueGetter: ({ data }) => {
          let date = moment(data.timestamp)
          return `${date.format('MM/DD/YYYY')} at ${date.format('h:mm a')} EST`
        } 
      },
      {
        headerName: 'Valve Status', 
        valueGetter: ({ data }) => {
          return `${data.status}%`
        }
      }]
    },
    statusBarData: {
      topics: [
        'actual_position',
        'status',
        'operation_status'
      ],
      markers: [{ 
          computed: () => {
            return 0
          },
          label:'CLOSED',
          color: 'gray'
        },
        { 
          computed: () => {
            return 100
          },
          label:'OPEN',
          color: 'gray'
      }],
      header: 'VALVE',
      currentValue: (topicMap, topicBase) => {
        let val = topicMap(`${topicBase}/actual_position/report`)
        return (val || val === 0) ? val.toFixed(0) : 'N/A'
      },
      units: () => {
        return '%'
      },
      markerUnits: ''
    },
    alertPanelData: {
      dropdownItems: [
        { modal: 'edit-valve', text: 'Adjust Valve', actionType: 'operation' }
      ],
      computedStatus: (topicMap, topicBase) => {
        let opstatus = topicMap(`${topicBase}/operation_status/report`, 'operationStatus') || {}
        let status = topicMap(`${topicBase}/status/report`, 'state') || {}
  
        if (opstatus.state === 'O_S_RUNNING') {
          return { state: 'O_S_RUNNING', msg: new Date(Number(opstatus.endTime)), actionLabel: 'Adjust Valve', modal: 'edit-valve', actionType: 'operation' } 
        }
        else {
          if (status.state === 'STATE_OK') {
            return { state: 'O_S_IDLE', title: 'Valve Closed' }  
          }
          else {
            return { state: status.state, title: status.text, actionLabel: 'Adjust Valve', modal: 'edit-valve', actionType: 'operation' }
          }
        }
      }
    }
  },
  {
    name: 'booster_pump',
    title: 'Booster Pump',
    topicBase: 'company/cold_inlet/booster_pump',
    protobufComp: 'BOOSTER_PUMP',
    images: ['booster-pump-1', 'booster-pump-2', 'booster-pump-3'],
    gridOptions: {
      columnDefs: [{
        headerName: 'Date & Time', 
        width: 70,
        minWidth: 70,
        valueGetter: ({ data }) => {
          let date = moment(data.timestamp)
          return `${date.format('MM/DD/YYYY')} at ${date.format('h:mm a')} EST`
        } 
      },
      {
        headerName: 'Head Pressure', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data})  => {
          return colDef.headScale(data.actual_pressure)
        }  
      },
      {
        headerName: 'Set Point', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data}) => {
          return colDef.headScale(data.setpoint_pressure)
        },
      },
      {
        headerName: 'Low Limit', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data}) => {
          return colDef.headScale(data.low_threshold)
        }  
      },
      {
        headerName: 'High Limit', 
        width: 40,
        minWidth: 40,
        valueGetter: ({colDef, data}) => {
          return colDef.headScale(data.high_threshold)
        }  
      }]
    },
    alertPanelData: {
      dropdownItems: [
        {modal: 'edit-set-point-pressure', text: 'Edit Set Point', actionType: 'setting'},
        {modal: 'edit-alert-thresholds-pressure', text: 'Edit Alert Thresholds', actionType: 'setting'}
      ],
      computedStatus: (topicMap, topicBase) => {
        // Compute the status of the booster pump component
        let status = topicMap(`${topicBase}/status/report`, 'state') || {}

        if (status.state === 'STATE_OK') {
          return { state: 'O_S_IDLE' }
	}
        else {
          return { state: status.state, title: status.text, actionLabel: 'Edit Alert Thresholds', modal: 'edit-alert-thresholds-pressure', actionType: 'setting' } 
        }
      }
    },
    setpointValueGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/setpoint_pressure/report`)
    },
    setpointValueSet: (publishSet, topicBase, value) => {
      publishSet({ topic: `${topicBase}/setpoint_pressure/request`, value: value })
    },
    lowAlertValueSet: (publishSet, topicMap, topicBase, value) => {
      publishSet({ topic: `${topicBase}/low_threshold/request`, value: value })
    },
    highAlertValueSet: (publishSet, topicMap, topicBase, value) => {
      publishSet({ topic: `${topicBase}/high_threshold/request`, value: value })
    },
    isBooster: true,
    statusBarData: {
      topics: [
        'setpoint_pressure',
        'actual_pressure',
        'low_threshold',
        'high_threshold',
        'head_units',
        'status'
      ],
      markers: [{ 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/low_threshold/report`)   
          },
          color: 'yellow'
        },
        { 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/setpoint_pressure/report`)   
          },
          color: 'gray'
        },
        { 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/high_threshold/report`)   
          },
          color: 'yellow'
      }],
      header: 'Head pressure',
      currentValue: (topicMap, topicBase) => {
        let val = topicMap(`${topicBase}/actual_pressure/report`)   
        return (val || val === 0) ? val.toFixed(0) : 'N/A'
      },
      units: (convertTempScale, convertPressureScale, convertHeadUnit) => {
	if (convertHeadUnit){
          return 'm'
	}
	return 'ft'
      }
    },
    chart: {
      xAxis: {
        labels: {
          formatter: function() {
            return moment(this.value).format("M/D HH:mm");
          }
        }
      },
      yAxis: {
        labels: {
          format: '{value} ft'
        }   
      },
      series: [
        { yAxis: 1, color: '#00DCFF', name: 'Setpoint', field: 'setpoint_pressure' }, 
        { yAxis: 1, color: '#0088FF', name: 'Low Thresh', field: 'low_threshold' },
        { yAxis: 1, color: '#FFB300', name: 'High Thresh', field: 'high_threshold' }
      ]
    }
  },
  { 
    name: 'sanitation_loop', 
    title: 'Sanitation Pump',
    topicBase: 'company/hot_supply/water_heater',
    protobufComp: 'SANITATION_PUMP',
    alertPanelData: {
      dropdownItems: [
        { modal: 'sanitation-loop-manual-1', text: 'Start Sanitation Loop', actionType: 'operation' },
        { modal: 'sanitation-loop-schedule-1', text: 'Edit Schedule', actionType: 'operation' }
      ],
      computedStatus: (topicMap, topicBase) => {
        let opstatus = topicMap(`${topicBase}/sanitation_loop/operation_status/report`, 'operationStatus') || {}
        let status = topicMap(`${topicBase}/sanitation_loop/status/report`, 'state') || {}
      
        if (opstatus.state === 'O_S_SCHEDULED' || opstatus.state === 'O_S_AUTH_ACQUIRED') {
          let d = moment(Number(opstatus.startTime))
          let startTime = `${d.format('L')} at ${d.format('h:mm A')} EST`
          return { state: opstatus.state, title: 'Scheduled', msg: `Next Sanitation Loop ${startTime}`, actionLabel: 'Edit Schedule', modal: 'sanitation-loop-schedule-1', actionType: 'operation' }  
        }
        if (opstatus.state === 'O_S_IMMINENT') {
          let startTime = moment(Number(opstatus.startTime))
          return { state: opstatus.state, title: 'Sanitation Loop', subtitle: 'Starting', time: startTime, actionLabel: 'Cancel', actionType: 'operation' }  
        }
        if (opstatus.state === 'O_S_RUNNING') {
          let startTime = moment(Number(opstatus.startTime))
          return { state: opstatus.state, title: 'Sanitation Loop', subtitle: 'Active for', timeSince: startTime, actionLabel: 'Emergency Stop', actionType: 'emergency' }  
        }
        if (opstatus.state === 'O_S_AUTH_PENDING') {
          let d = moment(Number(opstatus.startTime))
          let nextAuthTime = `${d.format('L')} at ${d.format('h:mm A')} EST`
          return { state: opstatus.state, title: 'Authorization Required', msg: `Next Sanitation Loop ${nextAuthTime}`, actionLabel: 'Review & Authorize', modal: 'sanitation-loop-auth-1', actionType: 'operation'  }  
        }
        if (opstatus.state === 'O_S_AUTH_ACQUIRED') {
          let d = moment(Number(opstatus.startTime))
          let nextAuthTime = `${d.format('L')} at ${d.format('h:mm A')} EST`
          return { state: opstatus.state, title: 'Authorized', msg: `Next Sanitation Loop ${nextAuthTime}`, actionLabel: 'Deauthorize', actionType: 'operation' }  
        }
        else {
          if (status.state === 'STATE_OK'){
            return { state: 'O_S_IDLE', msg: 'Tap the actions menu to start or schedule a Sanitation Loop' }  
          }
          else {
            return { state: status.state, title: status.text, actionLabel: 'Edit Schedule', modal: 'sanitation-loop-schedule-1', actionType: 'operation' }
          }
        }
      }
    },
    statusBarData: {
      topics: [
        'setpoint_temp',
        'inlet_temp',
        'sanitation_loop/operation_status',
        'sanitation_loop/status',
        'sanitation_loop/next_schedule'
      ],
      isTemp: true,
      markers: [{ 
          computed: (topicMap, topicBase) => {
            let opstatus = topicMap(`${topicBase}/sanitation_loop/operation_status/report`, 'operationStatus') || {}
            let schedule = opstatus.schedule
            if (schedule && schedule.sanitationSettings){
              return schedule.sanitationSettings.killTemp
            }
          },
          smallLabel: 'Kill Temperature',
          color: 'purple'
        },
        { 
          computed: (topicMap, topicBase) => {
            let opstatus = topicMap(`${topicBase}/sanitation_loop/operation_status/report`, 'operationStatus') || {}
            let schedule = opstatus.schedule
            if (schedule && schedule.sanitationSettings){
              return schedule.sanitationSettings.dcsp
            }
          },
          smallLabel: 'Disinfection Set Point',
          color: 'purple'
      }],
      header: 'Inlet Temp',
      currentValue: (topicMap, topicBase) => {
        return topicMap(`${topicBase}/inlet_temp/report`)
      },
      units: (convertTempScale, convertPressureScale, convertHeadUnit) => {
        if (convertTempScale){
          return '°F'
        }
        return '°C'
      }
    },
    chart: {
      yAxis: {
        isTemp: true,
        labels: {}   
      },
      series: [
        { yAxis: 1, color: '#6A4387', name: 'DCSP', field: 'dcsp', referenceLine: true}, 
        { yAxis: 1, color: '#FFB300', name: 'KT', field: 'kill_temp', referenceLine: true }, 
        { yAxis: 1, color: '#6a4387', name: 'Unit Temp', field: 'unit_temp'}, 
        { yAxis: 1, color: '#5f7694', name: 'NOSP', field: 'nosp', referenceLine: true }, 
      ]
    } 
  },
  { 
    name: 'blowdown_cycle',
    title: 'Blowdown Valve',
    protobufComp: 'BLOWDOWN_VALVE',
    topicBase: 'company/hot_supply/water_heater',
    alertPanelData: {
      dropdownItems: [
        { modal: 'blowdown-manual-1', text: 'Start Blowdown Cycle', actionType: 'operation' },
        { modal: 'blowdown-schedule-1', text: 'Edit Schedule', actionType: 'operation' }
      ],
      computedStatus: (topicMap, topicBase) => {
        let opstatus = topicMap(`${topicBase}/blowdown/operation_status/report`, 'operationStatus') || {}
        let status = topicMap(`${topicBase}/blowdown/status/report`, 'state') || {}

        if (opstatus.state === 'O_S_SCHEDULED') {
          let d = moment(Number(opstatus.startTime))
          let startTime = `${d.format('L')} at ${d.format('h:mm A')} EST`
          return { state: opstatus.state, title: 'Scheduled', msg: `Next Blowdown Cycle ${startTime}`, actionLabel: 'Edit Schedule', modal: 'blowdown-schedule-1', actionType: 'operation' }  
        }
        if (opstatus.state === 'O_S_IMMINENT') {
          let startTime = moment(Number(status.startTime))
          return { state: opstatus.state, title: 'Blowdown Cycle Starting', time: startTime, actionLabel: 'Cancel', actionType: 'operation'}  
        }
        if (opstatus.state === 'O_S_RUNNING') {
          let endTime = moment(Number(status.endTime))
          return { state: opstatus.state, title: 'Blowdown Cycle Active', time: endTime, actionLabel: 'Emergency Stop', actionType: 'emergency'}  
        }
        else {
          if (status.state === 'STATE_OK'){
            return { state: 'O_S_IDLE',  msg: 'Tap the actions menu to start or schedule a Blowdown Cycle' }  
          }
          else {
            return { state: status.state, title: status.text, actionLabel: 'Edit Schedule', modal: 'blowdown-schedule-1', actionType: 'operation' }
          }
        }
      }
    }
  },
  {
    name: 'chemical_shock',
    title: 'Chemical Sanitation',
    protobufComp: 'WATER_HEATER',
    condition: 'CHEMICAL_SHOCK_OPERATION',
    topicBase: 'company/hot_supply/water_heater',
    alertPanelData: {
      dropdownItems: [
        { modal: 'chemical-shock-manual-1', text: 'Start Chemical Sanitation', actionType: 'operation' },
      ],
      computedStatus: (topicMap, topicBase) => {
        let opstatus = topicMap(`${topicBase}/chemical_shock/operation_status/report`, 'operationStatus') || {}

        if (opstatus.state === 'O_S_RUNNING') {
          let startTime = moment(Number(opstatus.startTime))
          return { state: opstatus.state, title: 'Chemical Sanitation', subtitle: 'Active for', timeSince: startTime, actionLabel: 'End Sanitation Mode', actionType: 'operation'}
        }
        else {
          return { state: 'O_S_IDLE',  msg: 'Tap the actions menu to start Chemical Sanitation' }
        }
      }
    },
    statusBarData: {
      topics: [
        'chemical_shock/operation_status',
      ],
      isTemp: false,
      markers: [{
          computed: () => {
            return 0
          },
          label:'CLOSED',
          color: 'gray'
        },
        {
          computed: () => {
            return 100
          },
          label:'OPEN',
          color: 'gray'
        }
      ],
      header: 'VALVE',
      currentValue: (topicMap, topicBase) => {
        let o = topicMap(`${topicBase}/chemical_shock/operation_status/report`, 'operationStatus')
        if (o.state === 'O_S_RUNNING') {
          if (o.schedule.chemicalShockSettings.openDiverterValve) {
            return 100
          }
        }
        return 0
      },
      units: () => { 
        return '%' 
      },
      markerUnits: ''
    }
  },
  { 
    name: 'uv_disinfect', 
    orderLampHoursGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/order_threshold/report`)
    },
    orderLampHoursSet: (publishSet, _, topicBase, value) => {
      publishSet({ topic: `${topicBase}/order_threshold/request`, value: value })
    },
    replaceLampHoursGet: (topicMap, topicBase) => {
      return topicMap(`${topicBase}/replace_threshold/report`)
    },
    replaceLampHoursSet: (publishSet, _, topicBase, value) => {
      publishSet({ topic: `${topicBase}/replace_threshold/request`, value: value })
    },
    alertPanelData: {
      dropdownItems: [
        {modal: 'ack-uv-lamp-order', text: 'Log Order', actionType: 'maintenance'},
        {modal: 'ack-uv-lamp-replaced', text: 'Log Replacement', actionType: 'maintenance'},
        {modal: 'edit-alert-thresholds-hours', text: 'Edit Alert Thresholds', actionType: 'setting'}
      ],
      computedStatus: (topicMap, topicBase) => {
        // Compute the status of the UV disinfect component
        let status = topicMap(`${topicBase}/status/report`, 'state') || {}

        if (status.state === 'STATE_OK') {
          return { state: 'O_S_IDLE' }
        }
        else {
          var a = 'Log Order'
          var m = 'ack-uv-lamp-order'
          if (status.text){
            if (status.text.toLowerCase().includes("replace")){
              a = 'Log Replacement'
              m = 'ack-uv-lamp-replaced'
            }
          }
          return { state: status.state, title: status.text, actionLabel: a, modal: m, actionType: 'maintenance' }          
        }
      }
    },
    statusBarData: {
      topics: [
        'lamp_life_rem',
        'replace_threshold',
        'order_threshold',
        'lamp_rated_op_time',
        'status'
      ],
      markers: [{ 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/replace_threshold/report`)
          },
          color: 'yellow'
        },
        { 
          computed: (topicMap, topicBase) => {
            return topicMap(`${topicBase}/order_threshold/report`)
          },
          color: 'yellow'
        },
        { 
          computed: (topicMap, topicBase) => {
          return topicMap(`${topicBase}/lamp_rated_op_time/report`)
          },
          color: 'gray'
      }],
      header: 'Lamp Life',
      currentValue: (topicMap, topicBase) => {
        return topicMap(`${topicBase}/lamp_life_rem/report`)
      },
      units: () => {
        return 'HRS'
      }
    },
    gridOptions: {
      columnDefs: [{
        headerName: 'Date & Time', 
        width: 70,
        minWidth: 70,
        valueGetter: ({ data }) => {
          let date = moment(data.time)
          return `${date.format('MM/DD/YYYY')} at ${date.format('h:mm a')} EST` // TODO Use configured TZ?
        } 
      },
      {
        headerName: 'Lamp Life', 
        width: 40,
        minWidth: 40,
        valueGetter: ({ data })  => {
          return data.lamp_life_rem * 24
        }  
      },
      {
        headerName: 'Order', 
        width: 40,
        minWidth: 40,
        valueGetter: ({ data }) => {
          return data.order_threshold
        },
      },
      {
        headerName: 'Replace', 
        width: 40,
        minWidth: 40,
        valueGetter: ({ data }) => {
          return data.replace_threshold
        }  
      },
      {
        headerName: 'Expected Life', 
        width: 40,
        minWidth: 40,
        valueGetter: ({ data }) => {
          return data.lamp_rated_op_time
        }  
      }]
    },
    chart: {
      xAxis: {
        labels: {
          formatter: function() {
            return moment(this.value).format("M/D HH:mm");
          }
        }
      },
      yAxis: {
        isTemp: false,
        labels: {
          format: '{value}°'
        }   
      },
      series: [
        { color: '#09223f', name: 'Lamp Life', field: 'lamp_life_rem', yAxis: 1 },
        { color: '#6c7c93', name: 'Lamp Rated Time', field: 'lamp_rated_op_time', yAxis: 1, referenceLine: true },
        { color: '#dba53c', name: 'Order Threshold', field: 'order_threshold', yAxis: 1, referenceLine: true },
        { color: '#dba53c', name: 'Replace Threshold', field: 'replace_threshold', yAxis: 1, referenceLine: true }
      ]
    } 
  }]
}

const mutations = {
  SOCKET_CONNECT(state) {
    state.connected = true
  },
  SOCKET_DISCONNECT(state) {
    state.connected = false
  },
  SOCKET_MESSAGE(state, message) {
    state.message = message
  },
  SOCKET_REPORT(state, response) {
    let report = response[0]
    if (report.goHome){
        let location = { name: 'index'}
        state.router.replace(location)
    }
    else 
    {
      if (!state.protos || state.protos.Validity_e[report.data.validity]===state.protos.Validity_e.UNCHANGED){
        // Verify that this value is not stored in the state, for first time population
        if(state.topicMap.get(report.topic)){
          return
        }
      }
      state.topicMap.set(report.topic, report.data)
      state.topicMapLastUpdate = new Date()
    }
  },
  SOCKET_ERROR(state, message) {
    state.error = message.error
  },
  setHistoricalData(state, payload) {
    if (payload){
      state.historicalData = payload.map(row=>({...row, timestamp: row.timestamp*1000}))
    }
    else {
      state.historicalData = []
    }
  },
  setEventData(state, payload) {
    state.eventData = payload
  },
  toggleTempScale(state, payload) {
    state.convertTempScale = payload
  },
  togglePressureScale(state, payload) {
    state.convertPressureScale = payload
  },
  toggleHeadUnit(state, payload) {
    state.convertHeadUnit = payload
  },
  clearHistoricalData(state) {
    state.historicalData = []
  },
  clearEventData(state) {
    state.eventData = []
  },
  setCurrentRoute(state, payload) {
    state.currentRoute = payload
  },
  setDisplayLightLevel(state, payload) {
    state.displayLightLevel = payload
  },
  setProtos(state, payload) {
    state.protos = payload
  },
  setRouter(state,payload){
    state.router = payload
  },
  setIsScrolling(state, payload){
    state.isScrolling = payload
  },
  loadCabinetUnits(state){
    let temp = state.topicMap.get('company/system/temperature_units/report')
    if (temp)
    {
      if (temp.text == 'c')
      {
        state.convertTempScale = false
      }
      else
      {
        state.convertTempScale = true
      }
    }

    let pressure = state.topicMap.get('company/system/pressure_units/report')
    if (pressure)
    {
      if (pressure.text == 'p')
      {
        state.convertPressureScale = false
      }
      else
      {
        state.convertPressureScale = true
      }
    }

    let head = state.topicMap.get('company/cold_inlet/booster_pump/head_units/report')
    if (head)
    {
      if (head.text == 'm')
      {
        state.convertHeadUnit = true
      }
      else
      {
        state.convertHeadUnit = false
      }
    }
  },
  setUserToken(state, payload){
    state.userToken = payload
  }
}

const actions = {
  getHistoricalData({ state, commit }, params) {
    return axios.post(`${state.baseServer}/historicalData`,  { table: params.table, startDate: params.startDate, eventId: params.eventId, query: params.query })
      .then(response => {
        commit('setHistoricalData', response.data)
      });
  },
  getEventData({ state, commit }, params) {
    return axios.post(`${state.baseServer}/eventData`,  { query: params.query })
      .then(response => {
        commit('setEventData', response.data)
      });
  },
  publishGet ({ state }, topic) {
    axios.post(`${state.baseServer}/mqttPublish`, { topic: topic, type: 'get', token: state.userToken })
  },
  publishSet ({ state }, params) {
    axios.post(`${state.baseServer}/mqttPublish`, { topic: params.topic, payload: params.value, type: params.type, token: state.userToken })
  },
  publishEvent ({ state }, params) {
    axios.post(`${state.baseServer}/mqttPublish`, { topic: params.topic, payload: params.value, type: 'event' })
  },
  publishComment ({ state }, params) {
    axios.post(`${state.baseServer}/mqttPublish`, { topic: params.topic, payload: params.value, type: 'comment' })
  },
  async authenticateUserPin({state, commit}, params){
    let response = await axios.post(`${state.baseServer}/authenticateUserPin`,  { data: params })
    commit('setUserToken', response.data.token)
    return response.data.status == 'PASS'
  },
  async updateUserPin({state}, params){
    let payload = {...params, token: state.userToken}
    let response = await axios.post(`${state.baseServer}/updateUserPin`,  { data: payload })
    return response.data.status == 'PASS'
  },
  async createUser({state}, params){
    let payload = {...params, token: state.userToken}
    let response = await axios.post(`${state.baseServer}/createUser`,  { data: payload })
    return response.data
  },
  logoutUser({commit}){
    commit('setUserToken', null)
  },
  adjustDisplayLighting ({ state }, percent) {
    axios.post(`${state.baseServer}/adjustDisplayLighting`, { percent: percent })
  },
  getDisplayLightLevel ({ state, commit }) {
    axios.get(`${state.baseServer}/displayLightLevel`)
    .then(response => {
      commit('setDisplayLightLevel', response.data)
    });
  },
  subscribe ({ state }, topic) {
    axios.post(`${state.baseServer}/mqttSubscribe`, { topic: topic })
  },
  unsubscribe ({ state }, topic) {
    axios.post(`${state.baseServer}/mqttUnsubscribe`, { topic: topic })
  },
  async loadProtos ({state, commit }) {
    if (!state.protos){
      try {
        let protos = await protobuf.load("mqtt.proto")
        commit('setProtos', protos)
      } catch(err) { }
    }
  },
  // Implements action restrictions based on logged in role
  restrictAction({state}, parameters){
    return new Promise((resolve, reject)=>{

      if (parameters.action === 'route'){
        // Take care of universal actions
        if (parameters.to.name === 'index' || 
            parameters.to.name === 'login' ||
            parameters.to.name === 'pin' ||
            parameters.to.name === 'status' ||
            parameters.to.name === 'details'){
              resolve()
            }
        // Take care of role-based restrictions
        if (state.userToken && state.userToken.role){
          if (parameters.to.name === 'settings' ||
              parameters.to.name === 'maintenance' ||
              parameters.to.name === 'sanitation'){
            if (
              state.userToken.role === 'U_R_ENGINEERING_CHIEF' ||
              state.userToken.role === 'U_R_FACILITIES_MANAGER' ||
              state.userToken.role === 'U_R_INFECTION_CONTROL' ||
              state.userToken.role === 'U_R_MAINTENANCE_TECH' ||
              state.userToken.role === 'U_R_INSTALLER' ||
              state.userToken.role === 'U_R_SALES_REP' ||
              state.userToken.role === 'U_R_THIRD_PARTY_TECH' ||
              state.userToken.role === 'U_R_THIRD_PARTY_WMP'){
                resolve()
              }
          }
          if (parameters.to.name === 'users' ||
              parameters.to.name === 'user' ||
              parameters.to.name === 'infectioncontrol'){
            if (
              state.userToken.role === 'U_R_ENGINEERING_CHIEF' ||
              state.userToken.role === 'U_R_FACILITIES_MANAGER' ||
              state.userToken.role === 'U_R_INFECTION_CONTROL'){
                resolve()
              }
            else if (state.userToken.userId === parameters.to.query.id){
                resolve()
            }
          }
        }
      }
      else if (!state.userToken){
        reject(false)
      }
      else if (parameters.action === 'setting'){
        if (
          state.userToken.role === 'U_R_ENGINEERING_CHIEF' ||
          state.userToken.role === 'U_R_FACILITIES_MANAGER' ||
          state.userToken.role === 'U_R_INFECTION_CONTROL' ||
          state.userToken.role === 'U_R_MAINTENANCE_TECH' ||
          state.userToken.role === 'U_R_INSTALLER'){
            resolve()
          }
      }
      else if (parameters.action === 'systemSetting'){
        if (
          state.userToken.role === 'U_R_ENGINEERING_CHIEF' ||
          state.userToken.role === 'U_R_FACILITIES_MANAGER' ||
          state.userToken.role === 'U_R_INFECTION_CONTROL' ||
          state.userToken.role === 'U_R_MAINTENANCE_TECH' ||
          state.userToken.role === 'U_R_INSTALLER' ||
          state.userToken.role === 'U_R_SALES_REP'){
            resolve()
          }
      }
      else if (parameters.action === 'maintenance'){
        if (
          state.userToken.role === 'U_R_ENGINEERING_CHIEF' ||
          state.userToken.role === 'U_R_FACILITIES_MANAGER' ||
          state.userToken.role === 'U_R_INFECTION_CONTROL' ||
          state.userToken.role === 'U_R_MAINTENANCE_TECH' ||
          state.userToken.role === 'U_R_INSTALLER' ||
          state.userToken.role === 'U_R_SALES_REP' ||
          state.userToken.role === 'U_R_THIRD_PARTY_TECH' ||
          state.userToken.role === 'U_R_THIRD_PARTY_WMP'){
            resolve()
          }
      }
      else if (parameters.action === 'operation'){
        if (
          state.userToken.role === 'U_R_ENGINEERING_CHIEF' ||
          state.userToken.role === 'U_R_FACILITIES_MANAGER' ||
          state.userToken.role === 'U_R_INFECTION_CONTROL' ||
          state.userToken.role === 'U_R_MAINTENANCE_TECH' ||
          state.userToken.role === 'U_R_INSTALLER'){
            resolve()
          }
      }
      else if (parameters.action === 'modifyEvent'){
        if (
          state.userToken.role === 'U_R_ENGINEERING_CHIEF' ||
          state.userToken.role === 'U_R_FACILITIES_MANAGER' ||
          state.userToken.role === 'U_R_INFECTION_CONTROL' ||
          state.userToken.role === 'U_R_MAINTENANCE_TECH' ||
          state.userToken.role === 'U_R_INSTALLER' ||
          state.userToken.role === 'U_R_SALES_REP'){
            resolve()
          }
      }
      else if (parameters.action === 'comment'){
            if (
              state.userToken.role === 'U_R_ENGINEERING_CHIEF' ||
              state.userToken.role === 'U_R_FACILITIES_MANAGER' ||
              state.userToken.role === 'U_R_INFECTION_CONTROL' ||
              state.userToken.role === 'U_R_MAINTENANCE_TECH' ||
              state.userToken.role === 'U_R_INSTALLER' ||
              state.userToken.role === 'U_R_SALES_REP' ||
              state.userToken.role === 'U_R_THIRD_PARTY_TECH' ||
              state.userToken.role === 'U_R_THIRD_PARTY_WMP'){
                resolve()
              }
      }
      else if (parameters.action === 'emergency'){
        resolve()
      }
      reject(state.userToken ? true : false)
    })
  } 
}

const getters = {
  view: state => (viewName, extViewName) => {
    let view = state.views.find(x => (x.name === viewName || x.protobufComp === viewName))
    let extendedView = state.extendedViews.find(x => (x.name === extViewName || x.protobufComp == extViewName))
    return { ...view, ...extendedView }
  },
  topicMap: state => (topic, field) => {
    let fld = field || 'value'
    let dataPoint = (!state.topicMap.size || !state.topicMap.has(topic)) ? '' : state.topicMap.get(topic)[fld]

    //This is a work-around of Vue's limitation of not firing on map updates 
    if (state.topicMapLastUpdate > new Date(0)) 
      return dataPoint
  },
  homeTileTemp: (state, getters) => name => {
    return getters.topicMap(`company/${name}/actual_temp/report`, 'value')
  },
  homeTileStatus: (state, getters) => name => {
    let status = getters.topicMap(`company/${name}/status/report`, 'state')
   
    if (status.state === 'STATE_WARN') {
      return 'warning'
    }
    else if (status.state === 'STATE_ERROR') {
      return 'error'
    }
    else {
      return 'ok'
    }
  },
  status: (state, getters) => name => {
    let status = getters.topicMap(`company/${name}/status/report`, 'state')
   
    if (status.state === 'STATE_WARN') {
      return 'warning'
    }
    else if (status.state === 'STATE_ERROR') {
      return 'error'
    }
    else {
      return 'ok'
    }
  },
  historicalData: state => showLess => {
    if (!state.historicalData)
    return []

    if (state.historicalData && !Array.isArray(state.historicalData)) {
      return state.historicalData
    }
   
    if (showLess) {
      return state.historicalData.slice(0, 3)
    }
    else {
      return state.historicalData.slice(0, 100)
    }
  },
  eventData: state => showLess => {
    if (!state.eventData)
    return []

    if (state.eventData && !Array.isArray(state.eventData)) {
      return state.eventData
    }
   
    if (showLess) {
      return state.eventData.slice(0, 3)
    }
    else {
      return state.eventData.slice(0, 50)
    }
  },
  chartData: state => (seriesConfig, tempScale, pressureScale, headScale) => {
    if (!state.historicalData.length)
      return { series: [] }   

    return {
      series: 
      seriesConfig.map(x => {
        let data = state.historicalData.map(row => {
          let yValue = null
          if (row.hasOwnProperty(x.field)){
            yValue = row[x.field]
          }
          else if (row.hasOwnProperty('details')) {
            let desc = row.details
            yValue = desc[x.field]
          }
          let scaledYValue = yValue
          scaledYValue = tempScale ? parseFloat(tempScale(yValue)) : scaledYValue
          scaledYValue = pressureScale ? parseFloat(pressureScale(yValue)) : scaledYValue
          scaledYValue = headScale ? parseFloat(headScale(yValue)) : scaledYValue
          return [new Date(row.time).valueOf(), scaledYValue]
        })
        return {...x, ...{ data: data }}
      })
    }
  },
  currentRoute: state => {
    return state.currentRoute
  },
  protobufRoot: state => {
    return state.protos
  },
  currentUser : (state, getters) => {
    let userList = getters.topicMap('user/userlist/get/response', 'userList')
    if (userList && state.userToken){
      let result = userList.users.filter((user)=>user.userId==state.userToken.userId)
      if (result.length == 1){
        return result[0]
      }
    }
    return null
  },
  getInactiveUsers: (state, getters) =>{
    // Format the users to exist in a list
    return getters.getUsers.filter(user=>!user.activated)
  },
  getActiveUsers: (state, getters) =>{
    // Format the users to exist in a list
    return getters.getUsers.filter(user=>user.activated)
  },
  getUsers: (state, getters) =>{
    // Format the users to exist in a list
    let userList = getters.topicMap('user/userlist/get/response', 'userList')
    if (userList){
      return userList.users
    }
    else {
      return []
    }
  },
  getUser: (state, getters) => (userId)=>{
    // Format the users to exist in a list
    let userList = getters.topicMap('user/userlist/get/response', 'userList')
    if (userList){
        return userList.users.filter(
          user => user.userId == userId
        )[0];
    }
    else {
      return {}
    }
  },
  getUserRoles: () => {
    return [
      {
        protoName: 'U_R_INVALID',
        name: 'Select Role',
        permissions: {
          unit: [
            "View all components",
            "Change thresholds Log Orders & Replacements",
            "Calibrate Settings",
            "View event history",
            "View and add event comments",
            "Close and reopen events",
            "View monitoring data",
            "View MODBUS log:",
            "View, provision or delete units"
          ],
          user: [
            'View and edit your own user account',
            'View, edit, create, and delete other user accounts',
            'Configure date and time a user’s account or access expires'
          ],
          report: [
            'View and export maintenance report',
            'View and export infection control/sanitation report',
            'View and export MODBUS report'
          ],
          settings: [
            'Adjust Network Configurations',
            'Change Unit Measurements',
            'Change Time Settings'
          ]
        }
      },
      {
        protoName: 'U_R_ENGINEERING_CHIEF',
        name: 'Engineering Chief',
        permissions: {
          Unit: [
            "View all components",
            "Change thresholds Log Orders & Replacements",
            "Calibrate Settings",
            "View event history",
            "View and add event comments",
            "Close and reopen events",
            "View monitoring data",
            "View MODBUS log:",
            "View, provision or delete units"
          ],
          User: [
            'View and edit your own user account',
            'View, edit, create, and delete other user accounts',
            'Configure date and time a user’s account or access expires'
          ],
          Report: [
            'View and export maintenance report',
            'View and export infection control/sanitation report',
            'View and export MODBUS report'
          ],
          Settings: [
            'Adjust Network Configurations',
            'Change Unit Measurements',
            'Change Time Settings'
          ]
        }
      },
      {
        'protoName': 'U_R_FACILITIES_MANAGER',
        'name': 'Facilities Manager'
      },
      {
        'protoName': 'U_R_INFECTION_CONTROL',
        'name': 'Infection Control'
      },
      {
        'protoName': 'U_R_MAINTENANCE_TECH',
        'name': 'Maintenance Technician'
      },
      {
        'protoName': 'U_R_INSTALLER',
        'name': 'Installer'
      },
      {
        'protoName': 'U_R_SALES_REP',
        'name': 'Sales Representative'
      },
      {
        'protoName': 'U_R_THIRD_PARTY_TECH',
        'name': 'Third Party Technician'
      },
      {
        'protoName': 'U_R_THIRD_PARTY_WMP',
        'name': 'Third Party Water Management Planner'
      }
    ]
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
