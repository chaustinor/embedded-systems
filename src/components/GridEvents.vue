<template>
  <div>
    <div :id="id" class="ag-theme-balham grid-event"></div>
    <modal-event-details ref="modalEventDetails"
    :onSave="modalClosed? modalClosed : ()=>{}"
    ></modal-event-details>
  </div>
</template>

<script>
import { Grid } from "ag-grid-community";
import { mapGetters } from 'vuex'
import grid from "./grid"
import ModalEventDetails from "./ModalEventDetails"

export default {
  name: 'GridEvents',
  mixins: [grid],
  props: {
    showComponents: Boolean,
    hideModal: Boolean,
    modalClosed: Function
  },
  data(){
    return { 
      id: 'ag-grid-events'
    }
  },
  components: {
    ModalEventDetails
  },
  beforeMount() {
    this.gridOptions = {
      defaultColDef: {
        lockPosition: true,
        comp: this.view
      },
      headerHeight: 60,
      columnDefs: [{
          headerName: 'Event', 
          width: 80,
          minWidth: 80,
          cellRenderer: ({ data }) => {
            let details = data.lastSysComment.details
             return `
              <div class="summary">
                <div class="event-box ${data.status}">
                  ${data.eventNumber}
                </div>
                <div class="name">${details.headline || details.text.split("\n")[0]}</div>
                <div class="date">${this.getDateTime(data.timestamp)}</div>
              </div>
            `
          }
        },
        {
          headerName: 'Component', 
          width: 35,
          minWidth: 35,
          hide: !this.showComponents,
          cellStyle: { 'color': "#209fda"},
          valueGetter: params => {
            let comp = params.colDef.comp(params.data.component)
            if (!comp.title){
              comp = params.colDef.comp(null,params.data.component)
            }
            return comp.title
          }  
        },
        {
          headerName: 'Activity', 
          cellRenderer: ({ data }) => {
            let desc = data.lastSysComment.details
            let comment = data.comments.length ? `${data.comments.length} Comments` : `Add a Comment`
            let lastComment = data.comments[data.comments.length-1];
            
            return `
              <div class="activity">
                <div>
                  <svg width="14" height="15" viewBox="0 0 14 15"><path fill="#209FDA" d="M12.25.75c.965 0 1.75.785 1.75 1.75v7.875c0 .965-.785 1.75-1.75 1.75H8.312l-3.415 2.562a.329.329 0 0 1-.522-.265v-2.297H1.75c-.965 0-1.75-.785-1.75-1.75V2.5C0 1.535.785.75 1.75.75h10.5z"/></svg>
                  <span class="comment">${comment}</span>
                </div>
                <div class="author">${this.getRelativeTime(lastComment.timestamp)} by ${lastComment.initials}</div>
              </div>`
          },
          width: 50,
          minWidth: 50 
      }],
      getRowHeight: function(params) {
        return params.data.isFullWidth ? 40 : 90
      },
      fullWidthCellRenderer: function({ data }) {
        return `<div class="text">${ data.header }</div>`
      },
      isFullWidthCell: rowNode => {
        return rowNode.data.isFullWidth
      },
      getRowClass: function({ node }) {
        if (node.data.isFullWidth) {
          return 'sub-header'
        }
        else if (!node.data.isOpen) {
          return 'closed'
        }
      },
      onRowDataChanged: this.onRowDataChanged.bind(this),
      onRowClicked: this.onRowClicked.bind(this)
    }
  },
  computed: {
    ...mapGetters([
      'view'
    ]),
    dataGrps(){
      let dataGrps = this.data.filter(x => x.isOpen)
      dataGrps.push({ isFullWidth: true, header: 'CLOSED' })
      dataGrps = [...dataGrps, ...this.data.filter(x => !x.isOpen)]
      dataGrps.unshift({ isFullWidth: true, header: 'OPEN' })
      return dataGrps
    },
  },
  methods: {
    onRowClicked({ data }){
      if (this.hideModal)
        return
        
      this.$refs.modalEventDetails.show(data)
    },
    createGrid(){
      if (this.myGrid)
        this.myGrid.destroy()

      this.gridOptions.rowData = this.dataGrps

      let eGridDiv = document.querySelector(this.getSelector());
      this.myGrid = new Grid(eGridDiv, this.gridOptions);
    },
    calculateGridHeight(rowCount){
      let bodyHeight = (!rowCount) ? 100 : (Math.min(rowCount, 12) - 2) * 90 + 83
      let headerHeight = this.hideHeaders ? 0 : (this.gridOptions.headerHeight || 60)
      let gridHeight = bodyHeight + headerHeight;
      return `${gridHeight}px`
    }
  },
  watch: {
    data :function(){
      // Watch the data parameter for updates, re-create grid
      this.myGrid.gridOptions.api.setRowData(this.dataGrps)
    }
  }
};
</script>

<style lang='scss'>
  #ag-grid-events .sub-header {
    background-color: $grey !important;
    border-top: 1px solid $grey !important;
    border-bottom: 1px solid $grey !important;
  }
  #ag-grid-events .sub-header .text {
    display: flex;
    align-items: center;
    height: 100%;
    color: $white;
    font-family: "HelveticaNeueLTStd-Md";
    margin-left: 35px;
    font-size: 18px;
  }
  #ag-grid-events .ag-theme-balham .ag-row.closed {
    background-color: $haze;
  }
</style>
