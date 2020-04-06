import Highcharts from 'highcharts/highstock';
import HighchartsNoData from 'highcharts/modules/no-data-to-display';
import moment from 'moment-timezone'

//HighchartsNoData(Highcharts)

export default {
  name: 'Graph',
  props: ['options', 'status', 'statusData', 'timezone'],
  data() {
    return {
      chart: null,
      flags: null,
      baseChartOptions: {
        title: {
          text: ''
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        time: {
          timezone: this.timezone
        },
        xAxis: {
          type: 'datetime',
          gridLineWidth: 1,
          tickLength: 0
        },
        yAxis: [{
          visible: false,
          startOnTick: false,
          endOnTick: false,
        },{
          gridLineColor: '#197F07',
          lineWidth: 2,
          gridLineWidth: 0,
          minorGridLineWidth: 0,
          opposite: true,
          startOnTick: false,
          endOnTick: false,
          title: {
            align: 'high',
            y: -10,
            rotation: 0,
            offset: 18,
            style: {
              fontWeight: 'bold',
              fontSize: '20px',
              color: '#09223f'
            }
          }
        }],
        noData: {
          style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030',
            border: '1px solid black'
          }
        }//,
        // series: [{
        //   name: 'intersect',
        //   yAxis: 1, 
        //   data: [],
        //   type: 'scatter'
        // }]
      }
    };
  },
  mounted(){
    window.moment = moment;
    Highcharts.theme = {
      chart: {
        type: 'line',
        zoomType: 'x',
        backgroundColor: 'transparent',
        spacingTop: 45
      },
      navigator: {
        enabled: false
      },
      rangeSelector: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      tooltip:{
        enabled: false
      },
      xAxis: {
        labels: {
          style: {
            fontSize: '20px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: "#09223f"
          }
        }   
      },
      yAxis: {
        labels: {
          align: 'left',
          style: {
            fontSize:'20px',
            color: "#09223f"
          }
        }   
      },
      plotOptions: {
        series: {
          lineWidth: 4,
          states: {
            hover: {
              enabled: false
            },
            inactive: {
              opacity: 1
            }
          }
        },
        scatter: {
          marker: {
            symbol: 'square',
            radius: 8
          }
        }
      }
    }

    Highcharts.setOptions(Highcharts.theme)

    this.flags = {
      type: 'flags',
      shape: 'squarepin',
      y: -180,
      lineWidth: 4,
      useHTML: true,
      style:{
        color: 'white',
        fontSize: '20px',
        padding: '20px'
      },
      data: []
    }
  },
  beforeDestroy(){
    if (this.chart)
      this.chart.destroy()
  }
};
