<template>
  <div class="chart-container">
    <div class="series-select-container">
      <b-dropdown right no-caret toggle-class="series-select">
        <template v-slot:button-content>
          <div class="text">{{ primarySeries ? primarySeries.name : '' }}</div>
          <svg width="16" height="26" viewBox="0 0 16 26">
            <path fill="white" d="M15.484 17.475c.688.633.688 1.66 0 2.293L9.253 25.51l-.009.007c-.043.04-.09.08-.138.116-.018.014-.038.026-.057.04l-.081.055-.074.04c-.024.014-.048.028-.074.04l-.038.018-.039.017-.078.034c-.026.01-.051.017-.077.025l-.086.029-.077.018-.09.02c-.03.005-.06.009-.092.012-.026.004-.051.009-.078.011-.116.01-.232.01-.347 0l-.077-.01-.094-.013a1.26 1.26 0 0 1-.085-.02 1.15 1.15 0 0 1-.082-.019l-.082-.026c-.027-.01-.054-.017-.08-.027-.026-.01-.05-.022-.075-.033l-.082-.035-.069-.038c-.026-.015-.053-.028-.078-.044l-.074-.05c-.021-.015-.043-.028-.064-.045a1.916 1.916 0 0 1-.125-.103l-.004-.004-6.232-5.74A1.556 1.556 0 0 1 0 18.636c0-.415.171-.83.515-1.146a1.867 1.867 0 0 1 2.49 0L8 22.004l4.995-4.53c.688-.632 1.802-.632 2.49 0zM8.182.008l.077.01.094.014.085.02c.028.006.055.012.082.02.028.008.055.018.082.027l.08.028c.026.01.05.022.075.033.027.012.055.024.082.038.023.011.046.025.069.039.026.014.053.028.078.045l.074.05c.021.017.043.03.064.047.043.034.085.07.125.107l.004.004 6.232 5.923c.343.327.515.755.515 1.183 0 .428-.171.856-.515 1.183a1.825 1.825 0 0 1-2.49 0L8 4.123 3.005 8.795a1.826 1.826 0 0 1-2.49 0 1.615 1.615 0 0 1 0-2.366L6.748.506l.009-.007c.043-.042.09-.083.138-.12.018-.015.038-.028.057-.042.027-.018.053-.038.081-.056L7.068.26l.038-.021C7.13.225 7.154.21 7.18.198c.025-.014.05-.024.077-.036.026-.012.051-.024.078-.035.026-.01.051-.018.077-.026l.086-.03.077-.018c.03-.007.06-.015.09-.02.03-.006.06-.01.092-.014l.078-.011c.116-.01.232-.01.347 0z"/>
          </svg>
        </template>
        <div v-for="(serie, index) in seriesGrp" :key="index">
          <div class="series-select-item">
            <b-form-checkbox class="input-check" :checked="serie != null" @change="val => onSeriesSelect(val, serie)">
            </b-form-checkbox>
            <span class="name">{{ serie.name }}</span>
            <span class="key" :style="{ backgroundColor: serie.color }"></span>
          </div>
          <b-dropdown-divider v-if="index != seriesGrp.length - 1" :key="`${index}-div`"></b-dropdown-divider>
        </div>
      </b-dropdown>
    </div>
    <button v-show="rangeSelected" class="btn-reset-zoom" @click="getSelectedDataRange()">Reset Zoom</button>
    <div id="chart-details" class="chart"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Highcharts from 'highcharts/highstock';
import HighchartsNoData from 'highcharts/modules/no-data-to-display';
import moment from 'moment'
import chart from "./chart"

//HighchartsNoData(Highcharts)

export default {
  name: 'ChartDetails',
  mixins: [chart],
  data() {
    return {
      rangeSelected: false,
      scale: null,
      areaSeries: {
        yAxis: 1, 
        type: 'arearange',
        lineWidth: 0,
        fillOpacity: 0.5,
        zIndex: 10
      }
    };
  },
  mounted(){
    this.chart = Highcharts.stockChart('chart-details', this.baseChartOptions)
    this.chart.showLoading('Loading data from server...')
  },
  watch: {
    options: function(){
      if (this.options.series.length){
        this.buildFlags()
        this.buildAreaRangeSeries()
        this.applyMarkers()
        this.buildChart()
      }
    }
  },
  computed: {
    xAxisInfo(){
      let daysDiff = moment().diff(this.options.seletedRng, 'days')   
    
      if (daysDiff > 31){
        return { resolution: 'M', tickInterval: 30 * 24 * 3600 * 1000 }
      }
      else if (daysDiff > 1 && daysDiff <= 31){
        return { resolution: 'd', tickInterval: 24 * 3600 * 1000 }
      }
      return { resolution: 'h', tickInterval: 15 * 60 * 1000 }
    },
    currentView(){
      return this.$router.currentRoute.query.extViewName || this.$router.currentRoute.query.viewName
    },
    seriesGrp(){
      return this.options.series.reduce((accum, series) => {
        if (series.referenceLine){
          return [ ...accum, ...[{ color: series.color, name: series.name }] ]
        }
        return accum
      }, [])
    },
    referenceSeries(){
      return this.options.series.filter(x => x.referenceLine)
    },
    primarySeries(){
      let s = this.options.series
      if (s.length){
        return s.filter(x => !x.referenceLine)[0]
      }
      return {}
    }
  },
  methods: {
    ...mapActions([
      'getHistoricalData'
    ]),
    buildChart(){
      // Determine what 10% in the future of the last data point is
      if (this.options.series[0] && this.options.series[0].data){
        let initSeriesData = this.options.series[0].data
        
        let avgInterval = initSeriesData.reduce((accum, curr, i, arr) => {
          if (i > 1 && i < arr.length - 1){
            return accum + Math.abs(arr[i][0] - arr[i + 1][0])
          }
          return accum
        }, 0) / initSeriesData.length

        let minTime = moment(initSeriesData.reduce((accum, curr) => curr[0] < accum ? curr[0] : accum, new Date()))
        let maxTime = moment(initSeriesData.reduce((accum, curr) => curr[0] > accum ? curr[0] : accum, moment().add(-1, 'y').valueOf()))
        let diff = maxTime.diff(minTime)

        maxTime = maxTime.add(diff * .05, 'ms').valueOf()
    
        // Assign high and low limit series based on the content of the view's chart
        let series = this.primarySeries
        let refLine = null
        // If the series is long enough, a refline (setpoint - type line) exists.
        if (this.options.series.length>5){
          refLine = this.options.series[1]
        }

        let highLimit = this.options.series[this.options.series.length-4]
        let lowLimit = this.options.series[this.options.series.length-3]
    
        let seriesMax = this.primarySeries.data[this.primarySeries.data.length - 1][0]
      
        while(seriesMax < maxTime){
          seriesMax = moment(seriesMax).add(avgInterval, 'ms').valueOf()
          // Also extend the refline if it exists
          if(refLine){
            refLine.data.push([seriesMax, refLine.data.slice(-1)[0][1]])
          }
          highLimit.data.push([seriesMax, highLimit.data.slice(-1)[0][1]])
          lowLimit.data.push([seriesMax, lowLimit.data.slice(-1)[0][1]])
          series.data.push([seriesMax, NaN])
        }

        // Determine y axis max and min values through all series
        let minValue = this.options.series.reduce((accum, curr)=> {
          let seriesMin = curr.data.reduce((accum, curr) => !isNaN(curr[1]) && curr[1] < accum ? curr[1] : accum, Infinity)
          return seriesMin < accum ? seriesMin : accum
        }, Infinity)

        let maxValue = this.options.series.reduce((accum, curr)=> {
          let seriesMax = curr.data.reduce((accum, curr) => curr[1] > accum ? curr[1] : accum, -Infinity)
          return seriesMax > accum ? seriesMax : accum
        }, -Infinity)

        if (this.primarySeries.isPressure){
          this.baseChartOptions.yAxis[1].reversed = true;
          this.baseChartOptions.yAxis[1].max = maxValue + Math.max(maxValue - minValue, 10) * 0.1
          this.baseChartOptions.yAxis[1].min = minValue - Math.max(maxValue - minValue, 10) * 0.6
        }
        else{
          this.baseChartOptions.yAxis[1].reversed = false;
          this.baseChartOptions.yAxis[1].max = maxValue + Math.max(maxValue - minValue, 10) * 0.6
          this.baseChartOptions.yAxis[1].min = minValue - Math.max(maxValue - minValue, 10) * 0.1
        }
      }
      else {
        //Highcharts.theme.xAxis.max = moment().add(1, this.xAxisInfo.resolution).valueOf()
      }

      this.baseChartOptions.xAxis[0].dateTimeLabelFormats = {
        minute: '%l:%M %p',
        hour: '%l %p',
        day: '%b %e',
        week: '%b %e',
        month: '%b'
      }

      this.baseChartOptions.yAxis[1].title.text = this.statusData.units
      this.baseChartOptions.xAxis[0].ordinal = false
      this.baseChartOptions.xAxis[0].tickPixelInterval = 160
      this.baseChartOptions.series = [ ...this.options.series, this.flags ]
      this.chart = Highcharts.stockChart('chart-details', this.baseChartOptions)
    },
    buildFlags(){
      let d = this.primarySeries.data
      let inletDate = d[d.length - 1][0]
      let inletTemp = d[d.length - 1][1]

      let highLimit = this.options.series[this.options.series.length-2]
      let lowLimit = this.options.series[this.options.series.length-1]

      if (inletTemp >= highLimit.data[highLimit.data.length - 1][1] || inletTemp <= lowLimit.data[lowLimit.data.length - 1][1]){
        this.flags = {...this.flags, ...{ color: highLimit.color }, ...{ fillColor: highLimit.color }}
      }
      else {
        this.flags = {...this.flags, ...{ color: this.primarySeries.color }, ...{ fillColor: this.primarySeries.color }}
      }
      this.flags.data = []
      
      let flag = {
        x: inletDate,
        title: `
          <div class="flag">
            <div class="time">${ inletTemp }</div>
            <div class="desc">${ this.statusData.units }</div>
          </div>`
      }
    
      this.flags.data.push(flag)
    },
    buildAreaRangeSeries(){
      let s = this.options.series
      let s0 = s[0].data
      let refLines = [s[[s.length-2]],s[s.length-1]]
      let i,j,isect;
      let areaSeriesData = null
     
      for (let r = 0; r < refLines.length; r++){
        areaSeriesData = []
        let refData = refLines[r].data
        for (i = 1; i < s0.length; i++){
          for (j = 1; j < refData.length; j++){  
            if (isect = this.getLineIntersection(refData[j-1], refData[j], s0[i-1], s0[i])){           
              let intY = isect[1]
              areaSeriesData.push([isect[0], intY, intY])
            }
          } 

          let serVal = s0[i][1]
          let refVal = refData[i][1]
          let date = s0[i][0]

          if (serVal >= refVal && r === 0){
            areaSeriesData.push([date, refVal, serVal])
          }
          else if (serVal < refVal && r === 1){
            areaSeriesData.push([date, serVal, refVal])
          }
        }
        let areaSeries = {...this.areaSeries, ...{ data: areaSeriesData, linkedTo: refLines[r].id, color: refLines[r].color }}
        this.options.series.push(areaSeries)
      }
    },
    onSelection(event){
      this.rangeSelected = true
      let startDate, endDate = 0
      
      if (event.xAxis){
        startDate = event.xAxis[0].min
        endDate = event.xAxis[0].max
      }
      this.getHistoricalData({ table: this.currentView, startDate: moment(startDate), endDate: moment(endDate) })
      return false
    },
    onSeriesSelect(val, serie){
      let series = this.chart.series.filter(x => x.name === serie.name)[0]
    
      if (val){
        series.show()
      }
      else {
        series.hide()
      }
    },
    getSelectedDataRange(){
      this.rangeSelected = false
      this.getHistoricalData({ table: this.currentView, startDate: this.options.seletedRng })
    },
    applyMarkers(){
      let s = this.options.series
      let s0 = s[0].data
      let refLines = [s[2],s[3]]
      let i,j,isect;

      for (let r = 0; r < refLines.length; r++){
        for (i = 1; i < s0.length; i++){
          let refData = refLines[r].data
          for (j = 1; j < refData.length; j++){
            if (isect = this.getLineIntersection(refData[j-1], refData[j], s0[i-1], s0[i])){           
              let marker = {
                x: isect[0],
                y: isect[1],
                marker:{
                  enabled: true,
                  fillColor: 'red',
                  symbol: 'square',
                  radius: 8
                }
              }
              refLines[r].data = [...refData.slice(0, j), marker, ...refData.slice(j + 1, refData.length)]
            }
          } 
        }
      }
    },
    getLineIntersection(p0, p1, p2, p3){   
      var p0_x = p0[0];
      var p0_y = p0[1];
      var p1_x = p1[0];
      var p1_y = p1[1];
      var p2_x = p2[0];
      var p2_y = p2[1];
      var p3_x = p3[0];
      var p3_y = p3[1];  

      var s1_x, s1_y, s2_x, s2_y;
      s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
      s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

      var s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
      var t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

      if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
      {
        return [p0_x + (t * s1_x),p0_y + (t * s1_y)];
      }
      return false;
    }
  }
};
</script>

<style scoped lang="scss">
  #chart-details.chart {
    height: 275px;
    width: 100%;
  }
  #chart-details.chart > div {
    height: 275px;
    width: 100%;
  }
  .chart-container {
    position: relative;
  }
  .btn-reset-zoom {
    position: absolute;
    right: 5rem;
    top: 3rem;
    width: 84px;
    height: 30px;
    background-color:#f7f7f7;
    font-weight: normal;
    font-size: 12px;
    font-family: Helvetica;
    z-index: 1000;
    border: 0;
  }
</style>

<style lang="scss">
  .flag {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 4px;
    grid-row-gap: 2px;
    padding: 3px;
  }
  .flag > div:first-child {
    text-align: center;
    align-items: baseline;
  }
  .time {
    font-size: 20px;
    text-align: right;
  }
  .highcharts-tooltip-box {
    fill: $deep-blue;
  }
  .tooltip-val {
    font-weight: bold;
    font-size: 20px;
    color: $white;
  }
  .tooltip-unit {
    color: $white;
    opacity: 0.5;
    font-size: 16px;
    font-weight: bold;
  }
  .series-select-container .dropdown-menu {
    width: 100%;
  }
  .series-select {
    background-color: $deep-blue !important;
    width: 278px;
    height: 54px;
    color: $white;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .series-select-item {
    padding: 0 10px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .series-select-item .key {
    height: 30px;
    width: 30px;
    position: absolute;
    right: 10px;
  }
  .series-select-item > .name {
    height: 30px;
    font-size: 24px;
    font-family: Helvetica;
    padding-left: 5px;
  }
</style>
