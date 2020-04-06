export default {
  props: { data: Object, showLabels: Boolean, showValues: Boolean, status: Object },
  data() {
    return {
      containerWidth: 0,
      minLftMarkerSpan: .09,
      minRgtMarkerSpan: .12,
      minFillWidth: 37,
      minFillPercent: .07
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize(){
      this.containerWidth = (window.innerWidth / 2) - 35;
    },
    getMarkerColor(index){
      if (this.cssClass && (this.data.markers[index].value < this.data.currentValue)){
        return this.cssClass
      }
      else if (this.calcBarPoints.active && this.isSanitation && (this.data.markers[index].value <= this.data.currentValue)){
        return 'white'
      }
      return this.data.markers[index].color
    }
  },
  computed: {
    calcBarPoints(){
      let markerPoints = [];
      if (this.data.isNegative){
        for(const marker of this.data.markers){
          marker.value = -marker.value;
        }
      }
      let active = false;

      // Set low and high markers at 8 and 95 percent
      if ((this.data.markers[0].value <= this.data.currentValue)){
        markerPoints[0] = {marker: this.data.markers[0], percent: 0.08}
        active = true;
      }
      else {
        markerPoints[0] = {marker: this.data.markers[0], percent: 0.18}
      }
      markerPoints[this.data.markers.length-1] = {marker: this.data.markers[this.data.markers.length-1], percent: 0.95}

      // Add a middle marker if applicable
      if (this.data.markers.length > 2){
        // Calculate mid marker relative to high and low
        let middlePosition = (this.data.markers[1].value - markerPoints[0].marker.value) / (markerPoints[2].marker.value - markerPoints[0].marker.value)
        if (middlePosition <= markerPoints[0].percent +0.15){
          middlePosition = markerPoints[0].percent + 0.15;
        }
        if (middlePosition > 0.7){
          middlePosition = 0.7;
        }
        markerPoints[1] = {marker: this.data.markers[1], percent: middlePosition}
      }

      // Determine the flag position based on the marker values
      let fillPercent = 0;
      if (this.data.currentValue < markerPoints[0].marker.value){
        let segmentPercent = (this.data.currentValue - markerPoints[0].marker.value) / (markerPoints[1].marker.value - markerPoints[0].marker.value)
        fillPercent = Math.max(0, (segmentPercent) * (markerPoints[1].percent - markerPoints[0].percent) + markerPoints[0].percent )
      }
      // Calculate flag position when between the first and second markers
      else if (this.data.currentValue >= markerPoints[0].marker.value && this.data.currentValue < markerPoints[1].marker.value){
        let segmentPercent = (this.data.currentValue - markerPoints[0].marker.value) / (markerPoints[1].marker.value - markerPoints[0].marker.value)
        fillPercent = (segmentPercent) * (markerPoints[1].percent - markerPoints[0].percent) + markerPoints[0].percent 
      }
      // Calculate flag position when between the second and third markers
      else if (this.data.markers.length > 2 && this.data.currentValue >= markerPoints[1].marker.value && this.data.currentValue <= markerPoints[2].marker.value){
        let segmentPercent = (this.data.currentValue - markerPoints[1].marker.value) / (markerPoints[2].marker.value - markerPoints[1].marker.value)
        fillPercent = (segmentPercent) * (markerPoints[2].percent - markerPoints[1].percent) + markerPoints[1].percent 
      }
      else {
        fillPercent = 0.98;
      }
      // Create the fill width based on the container width
      let fillWidth = (fillPercent > this.minFillPercent) ? fillPercent * this.containerWidth : this.minFillWidth

      // Determine placement of the popover
      let placement = 'top';
      if (fillPercent < .4){
        placement = 'topright';
      }
      else if (fillPercent > .6){
        placement = 'topleft';
      }
      if (this.data.isNegative){
        for(const marker of this.data.markers){
          marker.value = -marker.value;
        }
      }

      return {markers: markerPoints, fillPercent, fillWidth, placement, active}
    },
    isWarning(){
      return this.status.state === 'STATE_WARN'
    },
    isError(){
      return this.status.state === 'STATE_ERROR'
    },
    cssClass(){
      if (this.status.state === 'STATE_WARN'){
        return 'warning'
      }
      if (this.status.state === 'STATE_ERROR'){
        return 'error'
      }
      return ''
    }
  }
};
