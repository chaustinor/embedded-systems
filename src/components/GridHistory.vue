<template>
  <div :id="id" class="ag-theme-balham"></div>
</template>

<script>
import { Grid } from "ag-grid-community";
import grid from "./grid";

export default {
  name: 'GridHistory',
  mixins: [grid],
  props: {
    options: Object
  },
  data(){
    return { 
      id: 'ag-grid-history'
    }
  },
  beforeMount(){
    this.gridOptions = {       
      defaultColDef: {
        tempScale: this.$options.filters.tempScale,
        pressureScale: this.$options.filters.pressureScale,
        headScale: this.$options.filters.headScale,
        lockPosition: true
      },
      headerHeight: 60,
      rowHeight: 70,
      onRowDataChanged: this.onRowDataChanged.bind(this)
    }
  },
  methods: {
    createGrid(){
      if (this.myGrid)
        this.myGrid.destroy()
      
      this.gridOptions = { ...this.gridOptions, ...this.options } 
      this.gridOptions.rowData = this.data

      let eGridDiv = document.querySelector(this.getSelector());
      this.myGrid = new Grid(eGridDiv, this.gridOptions);
    },
    calculateGridHeight(rowCount){
      let bodyHeight = (!rowCount) ? 100 : Math.min(rowCount, 9) * 70 + 2
      let headerHeight = this.gridOptions.headerHeight || 60
      let gridHeight = bodyHeight + headerHeight;
      return `${gridHeight}px`
    }
  },
  watch: {
    data :function(){
      setTimeout(()=>{

        // Watch the data parameter for updates, re-create grid
        this.myGrid.gridOptions.api.setRowData(this.data)
      },0)
    }
  }
};
</script>
<style lang="scss">
.ag-header-viewport {
  background-color:$deep-blue;
}
</style>
