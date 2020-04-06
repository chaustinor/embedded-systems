<template>
  <div>
    <div class="popover-container" :style="{width: `${containerWidth}px`}">
      <div
        v-if="isSanitation"
        :class="['range-bar']"
        :style="{ left: `${calcBarPoints.markers[0].percent * 0.92 * containerWidth}px`, width: `${containerWidth- 5 - (calcBarPoints.markers[0].percent * containerWidth)}px`}"
      ></div>
      <div
        v-if="isSanitation && calcBarPoints.active"
        :class="['active-bar']"
        :style="{width: `${calcBarPoints.fillWidth}px`}"
      >
        <span id="popover-anchor">.</span>
      </div>
      <div
        v-if="!isSanitation || !calcBarPoints.active"
        :class="['fill', cssClass]"
        :style="{width: `${calcBarPoints.fillWidth}px`}"
      >
        <span id="popover-anchor">.</span>
      </div>
      <div class="marker-container">
        <div
          v-for="(marker, index) in calcBarPoints.markers"
          :key="index"
          class="marker"
          :class="getMarkerColor(index)"
          :style="{ left: `${marker.percent * 100}%` }"
        >
          <div class="marker-label">
            <span v-show="showValues">{{ marker.marker.value }}</span>
            <span
              v-show="showValues"
              class="marker-unit"
              v-if="index === calcBarPoints.markers.length - 1"
            >{{ data.markerUnits}}</span>
            <span v-show="showLabels && !marker.marker.smallLabel">{{ marker.marker.label }}</span>
            <span v-show="showLabels" class="marker-label-small">{{ marker.marker.smallLabel }}</span>
          </div>
        </div>
      </div>
    </div>
    <b-popover
      :key="load"
      custom-class="my-popover"
      target="popover-anchor"
      :placement="calcBarPoints.placement"
      :fallback-placement="[calcBarPoints.placement]"
      boundary="app"
      :show="true"
      variant="$deep-blue"
    >
      <div>
        <div class="header">{{ data.header }}</div>
        <div>
          <span
            class="value"
          >{{ (data.currentValue || data.currentValue === 0) ? data.currentValue.toLocaleString() : 'N/A' }}</span>
          <span class="units">{{ data.units }}</span>
        </div>
      </div>
    </b-popover>
  </div>
</template>

<script>
import statusBar from "./statusBar.js";

export default {
  name: "StatusBar",
  mixins: [statusBar],
  props: {
    data: Object,
    showLabels: Boolean,
    showValues: Boolean,
    status: Object,
    isSanitation: Boolean
  },
  data() {
    return {
      load: 0,
      currentValue: 0
    };
  },
  watch: {
    data: function() {
      if (this.calcBarPoints.fillWidth != this.currentValue) {
        this.currentValue = this.calcBarPoints.fillWidth;
        this.load++;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.popover-container {
  height: 45px;
  border-radius: 22.2px;
  background-color: rgba(9, 34, 63, 0.15);
  position: relative;
  // padding-left: 15.7px;
  // padding-right: 27.7px;
}
.fill {
  height: 37px;
  border-radius: 18.5px;
  background-color: $white;
  position: absolute;
  left: 5px;
  top: 4px;
}
.range-bar {
  background-color: rgba(106, 67, 135, 0.15);
  position: absolute;
  top: 4px;
  height: 37px;
  border-radius: 18.5px;
}
.active-bar {
  background-color: $purple;
  position: absolute;
  top: 4px;
  left: 5px;
  height: 37px;
  border-radius: 18.5px;
}
.fill.warning {
  background-color: $mustard;
}
.fill.error {
  background-color: $red;
}
.marker-container {
  position: relative;
}
.marker {
  position: absolute;
  top: 15px;
  width: 13px;
  height: 13px;
  border-radius: 9.3px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
}
.marker-unit {
  padding-left: 5px;
}
.marker.yellow {
  background-color: $mustard;
}
.marker.gray {
  background-color: $grey;
}
.marker.red {
  background-color: $red;
}
.marker.purple {
  background-color: $purple;
}
.marker.white {
  background-color: $white;
}
.marker.error,
.marker.warning {
  background-color: rgba(9, 34, 63, 0.15);
}
.marker-label {
  opacity: 0.5;
  font-weight: bold;
  position: absolute;
  top: 35px;
  font-size: 26px;
  display: inherit;
}
.marker-label-small {
  font-weight: bold;
  position: absolute;
  top: 35px;
  font-size: 18px;
  display: inherit;
  white-space: nowrap;
}
.marker:first-child .marker-label {
  left: -10px;
  text-align: left;
}
.marker:last-child .marker-label {
  text-align: right;
  right: 0px;
}
.marker:last-child .marker-label-small {
  text-align: right;
  right: 0px;
}
.my-popover {
  border-radius: 0;
  background-color: $deep-blue;
  line-height: 0.8;
  z-index: 0;
}
#popover-anchor {
  right: 15px;
  position: absolute;
  opacity: 0;
  top: -20px;
}
.header {
  opacity: 0.5;
  font-size: 24px;
  text-align: center;
  text-transform: uppercase;
  height: 12px;
}
.value {
  font-size: 60px;
  line-height: normal;
}
.units {
  opacity: 0.5;
  font-size: 30px;
  margin-left: 3px;
}
.header,
.value,
.units {
  color: $white;
  font-weight: bold;
}
.arrow::after {
  background-color: $red;
}
.arrow::before {
  background-color: $teal;
}
</style>

<style lang="scss">
.my-popover div.arrow::after {
  border-top-color: $deep-blue;
}
.my-popover .popover-body {
  padding: 0.75rem 2rem;
  text-align: center;
}
.my-popover.popover {
  max-width: unset;
}
</style>

