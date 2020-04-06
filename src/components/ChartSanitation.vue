<template>
  <div id="chart-sanitation" class="chart"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsNoData from 'highcharts/modules/no-data-to-display';
import moment from 'moment'
import chart from "./chart"

HighchartsMore(Highcharts)

export default {
  name: 'ChartSanitation',
  mixins: [chart],
  data() {
    return {
      chart: null,
      topicBase: 'company/hot_supply/water_heater',
      flags: {
        data: []
      },
      areaRangeSeries: {
        name: 'Range',
        type: 'arearange',
        lineWidth: 0,
        color: '#6A4387',
        fillOpacity: 0.15,
        yAxis: 1, 
        marker: {
          enabled: false
        }
      }
    };
  },
  mounted(){
    this.getHistoricalData({ table: 'sanitation_loop' })

    this.chart = Highcharts.stockChart('chart-sanitation', this.baseChartOptions)
    this.chart.showLoading('Loading data from server...')
  },
  watch: {
    options: function(){
      if (this.options.series.length){
        this.buildFlags(this.options.event)
        this.applyMarkers()
        this.buildChart()
      }
    }
  },
  computed: {
    ...mapGetters([
      'topicMap'
    ]),
    primarySeries(){
      return this.options.series.filter(x => x.field === 'unit_temp')[0]
    }
  },
  methods: {
    ...mapActions([
      'getHistoricalData'
    ]),
    buildAreaRangeSeries(series){
      let areaRangeData = []
      for(let i = 0; i < series[0].data.length; i++){
        areaRangeData.push([ series[1].data[i][0], series[1].data[i][1], series[0].data[i][1] ])
      }

      this.areaRangeSeries.data = areaRangeData
      return [this.areaRangeSeries, series[2], series[3]]
    },
    buildChart(){
      this.chart.hideLoading();
      // Determine what 10% in the future of the last data point is
      if (this.options.series[0] && this.options.series[0].data){
        
        let minTime = moment(this.options.series[0].data.reduce((accum, curr) => curr[0] < accum ? curr[0] : accum, new Date()))
        let maxTime = moment(this.options.series[0].data.reduce((accum, curr) => curr[0] > accum ? curr[0] : accum, moment().add(-1, 'y').valueOf()))
        let diff = maxTime.diff(minTime)

        maxTime = maxTime.add(diff * .05, 'ms').valueOf()
        minTime = minTime.subtract(diff * .05, 'ms').valueOf()

        let ktLine = this.options.series[1]
        let dcspLine = this.options.series[0]
        let refLine = this.options.series[3]
        let seriesMin = refLine.data[0][0]
     
        while(seriesMin > minTime){
          seriesMin = moment(seriesMin).subtract(5, 's').valueOf()
          refLine.data.unshift([seriesMin, refLine.data[0][1]])
          ktLine.data.unshift([seriesMin, ktLine.data[0][1]])
          dcspLine.data.unshift([seriesMin, dcspLine.data[0][1]])
        }

        let seriesMax = refLine.data[refLine.data.length - 1][0]
        
        while(seriesMax < maxTime){
          seriesMax = moment(seriesMax).add(5, 's').valueOf()
          refLine.data.push([seriesMax, refLine.data.slice(-1)[0][1]])
          ktLine.data.push([seriesMax, ktLine.data.slice(-1)[0][1]])
          dcspLine.data.push([seriesMax, dcspLine.data.slice(-1)[0][1]])
        }

        // Determine y axis max and min values through all series
        let minValue = this.options.series.reduce((accum, curr)=> {
          let seriesMin = curr.data.reduce((accum, curr) => curr[1] < accum ? curr[1] : accum, Infinity)
          return seriesMin < accum ? seriesMin : accum
        }, Infinity)

        let maxValue = this.options.series.reduce((accum, curr)=> {
          let seriesMax = curr.data.reduce((accum, curr) => curr[1] > accum ? curr[1] : accum, -Infinity)
          return seriesMax > accum ? seriesMax : accum
        }, -Infinity)
     
        this.baseChartOptions.yAxis[1].max = maxValue + Math.max(maxValue - minValue, 10) * 0.6
        this.baseChartOptions.yAxis[1].min = minValue - Math.max(maxValue - minValue, 10) * 0.1
      }
      else {
        //Highcharts.theme.xAxis.max = moment().add(1, this.xAxisInfo.resolution).valueOf()
      }

      this.baseChartOptions.xAxis[0].dateTimeLabelFormats = {
        minute: '%l:%M %p',
        hour: '%l %p',
      }
      this.baseChartOptions.xAxis[0].tickPixelInterval = 200
      this.baseChartOptions.xAxis[0].ordinal = false
      this.baseChartOptions.yAxis[1].title.text = this.statusData.units
      let formattedSeries = this.buildAreaRangeSeries(this.options.series)
      this.chartOptions = { ...this.baseChartOptions, ...{ series: [...formattedSeries, this.flags] }}
    
      this.chart = Highcharts.stockChart('chart-sanitation', this.chartOptions)
    },
    buildFlags(eventDetails){
      let map = new Map()
      this.flags = {...this.flags, ...{ color: this.primarySeries.color }, ...{ fillColor: this.primarySeries.color }}
      this.flags.data = []
     
      map.set('Start', 'startTime')
      map.set('Cool', 'coolTime')
      map.set('Stop', 'stopTime')
    
      for(const [key, val] of map.entries()){
        let value = eventDetails[val]
        if (value){
          
          let flag = {
            x: value,
            time: value,
            title: `
              <div class="flag">
                <div class="header desc">${key}</div>
                <div class="time">${ moment(value).format('h:mm')}</div>
                <div class="desc">${ moment(value).format('A')}</div>
              </div>`
          }
          this.flags.data.push(flag)
        }
      }
      if (!eventDetails.stopTime){
        let d = this.primarySeries.data
        let inletDate = d[d.length - 1][0]
        let inletTemp = d[d.length - 1][1]
     
        let flag = {
          x: inletDate,
          title: `
            <div class="flag">
              <div class="header desc">Inlet Temp</div>
              <div class="time">${ inletTemp }</div>
              <div class="desc">${ this.statusData.units }</div>
            </div>`
        }
        this.flags.data.push(flag)
      }
    },
    applyMarkers(){
      let ps = this.primarySeries.data
      let fd = this.flags.data
      
      for (let f = 0; f < fd.length - 1; f++) {
        let flagX = fd[f].x
        for (let i = 0; i < ps.length - 1; i++){
          if (flagX >= ps[i][0] && flagX <= ps[i + 1][0]){
            let flagMarker = {
              x: flagX,
              y: parseInt((ps[i][1] + ps[i + 1][1])/2),
              marker:{
                enabled: true,
                fillColor: this.primarySeries.color,
                symbol: 'square',
                radius: 8
              }
            }
            this.primarySeries.data = [...ps.slice(0, i), flagMarker, ...ps.slice(i + 1, ps.length)]
            f++;
          }
          if(f === fd.length)
            break;
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
  #chart-sanitation.chart {
    height: 275px;
    width: 100%;
  }
  #chart-sanitation.chart > div {
    height: 275px;
    width: 100%;
  }
</style>

<style lang="scss">
  .plot-line {
    stroke: $purple;
    opacity: 0.15;
  }
  .flag {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 4px;
    grid-row-gap: 2px;
    padding: 3px;
  }
  .header {
    grid-area: 1 / 1 / span 1 / span 2;
  }
  .flag > div:first-child {
    text-align: center;
    align-items: baseline;
  }
  .desc {
    opacity: 0.5;
    font-size: 16px;
    color: $white;
    text-transform: uppercase;
  }
  .time {
    font-size: 20px;
    text-align: right;
  }
</style>