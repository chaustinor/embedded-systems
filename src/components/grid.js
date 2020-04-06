import { mapGetters } from 'vuex'
import { Grid } from "ag-grid-community";
import 'ag-grid-community'
import moment from 'moment'

export default {
  props: {
    data: Array, 
    maxHeight: {
      type: Number,
      default: 600
    }
  },
  data(){
    return { 
      gridOptions: null,
      handleGridWidthMethod: null,
      myGrid: null
    };
  },
  components: {
    Grid
  },
  computed:{
    ...mapGetters([
      'protobufRoot',
      'status'
    ])
  },
  beforeMount(){
    this.gridOptions = {
      defaultColDef: {
        suppressMenu:true, 
        lockPosition: true,
        tempScale: this.$options.filters.tempScale,
        pressureScale: this.$options.filters.pressureScale,
        headScale: this.$options.filters.headScale,
        protobuf: this.protobufRoot
      },
      rowSelection: 'single',
      onGridReady: this.onGridReady,
      onRowDataChanged: this.onRowDataChanged.bind(this)
    }
  },
  mounted(){
    setTimeout(() => {
      this.createGrid()
    })
  },
  watch: {
    options: function(){
      setTimeout(() => {
        this.createGrid()
      })
    }
  },
  methods: {
    onGridReady(params){ 
      this.handleGridWidth(params)
      this.handleGridWidthMethod = this.handleGridWidth.bind(null, params)
      window.addEventListener('resize', this.handleGridWidthMethod)
    },  
    getDateTime(rawTime){
      let d = moment(Number(rawTime))
      return `${d.format('MMM DD, YYYY')} at ${d.format('h:mm A')} EST`
    },
    getRelativeTime(rawTime){
      return moment(Number(rawTime)).fromNow();
    },
    getSelector(){
      return `#${this.id}`
    },
    onRowDataChanged(params){
      let eGridDiv = document.querySelector(this.getSelector());
      eGridDiv.style.height = this.calculateGridHeight(params.api.rowModel.rowsToDisplay.length);
      params.api.doLayout();
      params.api.sizeColumnsToFit();
      this.handleGridWidth(params)
    },
    handleGridWidth(params){  
      setTimeout(() => {
        let eGridDiv = document.querySelector(this.getSelector());
        eGridDiv.style.width = `100%`;
        params.api.doLayout();
        params.api.sizeColumnsToFit();
      }, 100)
    }
  },
  beforeDestroy: function(){
    if (this.myGrid)
      setTimeout(() => {
        this.myGrid.destroy()
      })
    
    window.removeEventListener('resize', this.handleGridWidthMethod)
  }
};
