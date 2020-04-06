<template>
  <base-layout>
    <template v-slot:header>
      <img class="header-shadow" src="../../public/assets/header-shadow.png" />
      <header-base>
        <div class="primary">{{ meta.title || 'Details'}}</div>
        <div class="secondary">{{ getUnitNameAndLoc }}</div>
      </header-base>
    </template>
    <b-container fluid>
      <b-row class="mt-5">
        <b-col>
          <div class="nav-detail">
            <div v-if="!loaded" style="height:447px;width:424px;"></div>
            <carousel
              v-if="loaded"
              :per-page="1"
              :mouse-drag="true"
              :navigation-enabled="true"
              :navigation-next-label="rightCaretIcon"
              :navigation-prev-label="leftCaretIcon"
              :navigation-click-target-size="30"
              :pagination-size="22"
              pagination-active-color="#0A233E"
            >
              <slide v-for="(image, index) in meta.images" v-bind:key="index">
                <img class="comp-img" :src="getImage(index)" />
              </slide>
            </carousel>
          </div>
        </b-col>
        <b-col>
          <div class="nav-detail">
            <div v-if="!loaded" style="height:386px;width:472px;"></div>
            <nav-control v-if="loaded"></nav-control>
          </div>
        </b-col>
      </b-row>
      <b-row class="mt-5">
        <b-col class="status-alert">
          <div v-if="!loaded" style="height:45px;width:620px;"></div>
          <status-bar
            v-if="loaded"
            class="status-bar"
            :data="statusBarData"
            :show-labels="showStatusBarLabels"
            :show-values="showStatusBarValues"
            :status="alertPanelStatus"
          ></status-bar>
          <div>
            <div v-if="!loaded" style="height:245px;width:550px;"></div>
            <component
              v-if="loaded"
              v-bind:is="alertPanelComp"
              :status="alertPanelStatus"
              :fields="alertPanelDropdownItems"
              :meta="meta"
            ></component>
          </div>
        </b-col>
      </b-row>
      <b-row class="mt-4">
        <b-col style="padding: 0; position: relative">
          <div class="date-rng-opts-container">
            <b-dropdown v-if="loaded" right no-caret toggle-class="date-rng-opts">
              <template v-slot:button-content>
                <div class="text">{{ selectedDateRngTxt }}</div>
                <svg width="16" height="26" viewBox="0 0 16 26">
                  <path
                    fill="white"
                    d="M15.484 17.475c.688.633.688 1.66 0 2.293L9.253 25.51l-.009.007c-.043.04-.09.08-.138.116-.018.014-.038.026-.057.04l-.081.055-.074.04c-.024.014-.048.028-.074.04l-.038.018-.039.017-.078.034c-.026.01-.051.017-.077.025l-.086.029-.077.018-.09.02c-.03.005-.06.009-.092.012-.026.004-.051.009-.078.011-.116.01-.232.01-.347 0l-.077-.01-.094-.013a1.26 1.26 0 0 1-.085-.02 1.15 1.15 0 0 1-.082-.019l-.082-.026c-.027-.01-.054-.017-.08-.027-.026-.01-.05-.022-.075-.033l-.082-.035-.069-.038c-.026-.015-.053-.028-.078-.044l-.074-.05c-.021-.015-.043-.028-.064-.045a1.916 1.916 0 0 1-.125-.103l-.004-.004-6.232-5.74A1.556 1.556 0 0 1 0 18.636c0-.415.171-.83.515-1.146a1.867 1.867 0 0 1 2.49 0L8 22.004l4.995-4.53c.688-.632 1.802-.632 2.49 0zM8.182.008l.077.01.094.014.085.02c.028.006.055.012.082.02.028.008.055.018.082.027l.08.028c.026.01.05.022.075.033.027.012.055.024.082.038.023.011.046.025.069.039.026.014.053.028.078.045l.074.05c.021.017.043.03.064.047.043.034.085.07.125.107l.004.004 6.232 5.923c.343.327.515.755.515 1.183 0 .428-.171.856-.515 1.183a1.825 1.825 0 0 1-2.49 0L8 4.123 3.005 8.795a1.826 1.826 0 0 1-2.49 0 1.615 1.615 0 0 1 0-2.366L6.748.506l.009-.007c.043-.042.09-.083.138-.12.018-.015.038-.028.057-.042.027-.018.053-.038.081-.056L7.068.26l.038-.021C7.13.225 7.154.21 7.18.198c.025-.014.05-.024.077-.036.026-.012.051-.024.078-.035.026-.01.051-.018.077-.026l.086-.03.077-.018c.03-.007.06-.015.09-.02.03-.006.06-.01.092-.014l.078-.011c.116-.01.232-.01.347 0z"
                  />
                </svg>
              </template>
              <template v-for="(item, index) in dateRngOpts">
                <b-dropdown-item @click="applyDateRange(index)" :key="index">{{ item.text }}</b-dropdown-item>
                <b-dropdown-divider v-if="index != dateRngOpts.length - 1" :key="`${index}-div`"></b-dropdown-divider>
              </template>
            </b-dropdown>
          </div>
          <b-tabs
            v-model="selectedTab"
            class="details"
            content-class="p-5"
            lazy
            active-nav-item-class="active-tab"
            nav-class="nav-class"
          >
            <b-tab id="monitoring" active>
              <template v-slot:title>
                <div class="tab-text">Monitoring</div>
              </template>
              <div
                v-if="loaded"
                v-show="!chartReady"
                class="chart-construction"
              >Chart Under Construction</div>
              <chart-details
                class="mb-5 mt-2"
                v-if="chartOptions && loaded"
                :options="chartOptions"
                :status="status"
                :statusData="statusBarData"
                :timezone="timezone"
              ></chart-details>
              <grid-history
                v-if="gridHistoryOptions && loaded"
                :data="gridHistoryData"
                :options="gridHistoryOptions"
                :max-height="250"
              ></grid-history>
            </b-tab>
            <b-tab id="event-history">
              <template v-slot:title>
                <div class="tab-text">Event History</div>
              </template>
              <grid-events v-if="loaded" :data="gridEventsData" :max-height="250" :modalClosed="getData"></grid-events>
            </b-tab>
            <template v-slot:tabs-end>
              <div class="tabs-filler details"></div>
            </template>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </base-layout>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import BaseLayout from "./BaseLayout.vue";
import NavControl from "../components/NavControl.vue";
import ChartDetails from "../components/ChartDetails.vue";
import GridEvents from "../components/GridEvents.vue";
import GridHistory from "../components/GridHistory.vue";
import moment from "moment";
import Now from "../components/Now.vue";
import { Carousel, Slide } from "vue-carousel";
import { BDropdown, BDropdownItem, BTabs, BTab } from "bootstrap-vue";
import AlertPanel from "../components/AlertPanel.vue";
import AlertPanelDiverter from "../components/AlertPanelDiverter.vue";
import StatusBar from "../components/StatusBar.vue";
import HeaderBase from "../components/HeaderBase.vue";

export default {
  name: "Details",
  props: { meta: Object },
  data() {
    return {
      monitorTabSelected: true,
      historicalDataTable: "",
      selectedRange: moment().subtract(30, "days"),
      selectedDateRngTxt: "",
      dateRngOpts: [
        { text: "Last Year", days: 365 },
        { text: "Last 6 Months", days: 180 },
        { text: "Last 30 Days", days: 30 },
        { text: "Last 7 Days", days: 7 },
        { text: "Last 24 Hours", days: 1 }
      ],
      topicBase: null,
      tempScale: null,
      pressureScale: null,
      headScale: null,
      selectedTab: 0,
      loaded: false,
      rightCaretIcon:
        '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="29" viewBox="0 0 17 29"><path fill="#0A233E" fill-rule="evenodd" d="M16.11 12.237l-.007-.007L5.258.934A2.993 2.993 0 0 0 3.092 0C2.31 0 1.524.311.926.934-.269 2.182-.27 4.2.926 5.446L9.45 14.5.898 23.554c-1.197 1.247-1.197 3.266 0 4.513a2.98 2.98 0 0 0 4.332 0l10.843-11.296.015-.014c.075-.08.15-.164.22-.25.026-.034.048-.071.075-.105.034-.048.068-.096.1-.146.03-.043.055-.089.08-.133.024-.045.053-.09.075-.134.025-.046.044-.093.065-.14.022-.049.045-.095.064-.143l.049-.14c.017-.051.036-.103.051-.155.015-.047.025-.095.034-.141.015-.054.029-.108.04-.161.011-.056.017-.112.024-.167a3.19 3.19 0 0 0 .019-.773 1.662 1.662 0 0 0-.019-.135c-.007-.06-.013-.115-.024-.173-.01-.052-.025-.104-.038-.155a1.376 1.376 0 0 0-.036-.147c-.013-.05-.032-.1-.05-.148-.016-.05-.031-.098-.05-.147a2.95 2.95 0 0 0-.06-.135c-.023-.048-.044-.1-.069-.148-.022-.043-.047-.084-.072-.124a2.166 2.166 0 0 0-.083-.143c-.028-.047-.06-.09-.093-.134-.028-.039-.054-.08-.085-.116a3.174 3.174 0 0 0-.195-.227"/></svg>',
      leftCaretIcon:
        '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="29" viewBox="0 0 17 29"><path fill="#0A233E" fill-rule="evenodd" d="M.89 16.763l.006.007L11.74 28.066c.6.623 1.383.934 2.166.934.785 0 1.568-.311 2.168-.934 1.196-1.248 1.196-3.266 0-4.512L7.549 14.5l8.554-9.053C17.3 4.2 17.3 2.18 16.103.933a2.981 2.981 0 0 0-4.332 0L.928 12.229c-.006.003-.011.01-.015.014-.078.08-.15.164-.22.25-.026.034-.049.071-.075.105a1.86 1.86 0 0 0-.103.146c-.028.043-.052.089-.077.133a3.164 3.164 0 0 0-.078.136 2.39 2.39 0 0 0-.064.139c-.02.048-.043.094-.064.142-.017.047-.032.093-.05.14-.016.051-.035.103-.05.155a1.905 1.905 0 0 0-.035.141c-.013.054-.028.108-.037.161-.012.056-.017.112-.025.167a3.242 3.242 0 0 0-.02.143c-.02.207-.02.42 0 .63.005.046.012.09.018.137.01.058.015.113.027.17.007.053.022.105.036.156.01.049.022.099.035.147.016.05.033.1.052.15l.049.145c.02.046.041.09.062.135.021.048.044.1.068.148.021.043.048.084.07.124.029.049.053.097.083.143.03.047.063.09.095.134.028.039.055.08.083.116.063.08.129.154.197.227"/></svg>'
    };
  },
  components: {
    BaseLayout,
    NavControl,
    ChartDetails,
    GridEvents,
    GridHistory,
    Now,
    carousel: Carousel,
    slide: Slide,
    BDropdown,
    BDropdownItem,
    AlertPanel,
    StatusBar,
    HeaderBase,
    BTabs,
    BTab,
    AlertPanelDiverter
  },
  mounted() {
    setTimeout(() => {
      this.loaded = true;
      this.publishGet("company/system/unit_name/request");
    });
  },
  computed: {
    ...mapState([
      "convertTempScale",
      "convertPressureScale",
      "convertHeadUnit"
    ]),
    ...mapGetters([
      "protobufRoot",
      "historicalData",
      "eventData",
      "chartData",
      "view",
      "topicMap"
    ]),
    chartOptions() {
      if (!this.meta.chart) return null;

      let tempScale = this.meta.chart.yAxis.isTemp
        ? this.$options.filters.tempScale
        : null;
      let pressureScale = this.meta.isPressure
        ? this.$options.filters.pressureScale
        : null;
      let headScale = this.meta.isBooster
        ? this.$options.filters.headScale
        : null;
      let dataSeries = this.chartData(
        this.meta.chart.series,
        tempScale,
        pressureScale,
        headScale
      );
      return {
        ...this.meta.chart,
        ...dataSeries,
        ...{ seletedRng: this.selectedRange }
      };
    },
    gridEventsData() {
      return this.eventData();
    },
    gridHistoryOptions() {
      return this.meta.gridOptions;
    },
    gridHistoryData() {
      return this.historicalData().filter(row => {
        for (var key in row) {
          if (row[key] === null) {
            return false;
          }
        }
        return true;
      });
    },
    status() {
      let apd = this.meta.alertPanelData;
      return (apd && apd.computedStatus) || {};
    },
    statusBarData() {
      let tempScale = this.tempScale ? this.tempScale : temp => temp;
      let pressureScale = this.pressureScale
        ? this.pressureScale
        : pressure => pressure;
      let headScale = this.headScale ? this.headScale : pressure => pressure;
      let data = {
        markers: [],
        isNegative: this.meta.statusBarData.isNegative
      };
      if (this.meta.statusBarData) {
        this.meta.statusBarData.markers.forEach(element => {
          let label = headScale(
            pressureScale(
              tempScale(element.computed(this.topicMap, this.topicBase))
            )
          );
          label = element.label ? element.label : label ? label.toLocaleString() : '';

          data.markers.push({
            color: element.color,
            name: element.name,
            value: headScale(
              pressureScale(
                tempScale(element.computed(this.topicMap, this.topicBase))
              )
            ),
            label: label
          });
        });
        data.units = this.meta.statusBarData.units(
          this.convertTempScale,
          this.convertPressureScale,
          this.convertHeadUnit
        );
        data.markerUnits =
          this.meta.statusBarData.markerUnits !== undefined
            ? this.meta.statusBarData.markerUnits
            : this.meta.statusBarData.units(
                this.convertTempScale,
                this.convertPressureScale,
                this.convertHeadUnit
              );

        data.currentValue = headScale(
          pressureScale(
            tempScale(
              this.meta.statusBarData.currentValue(
                this.topicMap,
                this.topicBase
              )
            )
          )
        );
        data.header = this.meta.statusBarData.header;
      }
      return data;
    },
    alertPanelStatus() {
      return this.meta.alertPanelData.computedStatus(
        this.topicMap,
        this.topicBase
      );
    },
    alertPanelDropdownItems() {
      return this.meta.alertPanelData.dropdownItems;
    },
    alertPanelComp() {
      return this.historicalDataTable !== "diverter_valve"
        ? "AlertPanel"
        : "AlertPanelDiverter";
    },
    showStatusBarLabels() {
      return this.meta.name === "diverter_valve";
    },
    showStatusBarValues() {
      return this.meta.name !== "diverter_valve";
    },
    chartReady() {
      return true;
    },
    getUnitNameAndLoc() {
      let n = this.topicMap("company/system/unit_name/report", "text");
      let l = this.topicMap("company/system/unit_location/report", "text");
      return n + " " + l;
    },
    timezone() {
      return this.topicMap("company/system/timezone/report", "text");
    }
  },
  methods: {
    ...mapActions([
      "publishGet",
      "getHistoricalData",
      "getEventData",
      "publishEvent"
    ]),
    applyDateRange(index) {
      this.selectedDateRngTxt = this.dateRngOpts[index].text;
      this.selectedRange = moment().subtract(
        this.dateRngOpts[index].days,
        "days"
      );
      this.getHistoricalData({
        table: this.historicalDataTable,
        startDate: this.selectedRange
      });
    },
    getImage(index) {
      return require(`../../public/assets/${this.meta.images[index]}.png`);
    },
    goBack() {
      this.$router.go(-1);
    },
    getData() {
      this.historicalDataTable =
        this.$router.currentRoute.query.extViewName ||
        this.$router.currentRoute.query.viewName;
      this.selectedDateRngTxt = this.dateRngOpts[2].text;
      this.topicBase = this.meta.topicBase;

      setTimeout(() => {
        if (this.meta.statusBarData) {
          this.meta.statusBarData.topics.forEach(element => {
            this.publishGet(`${this.meta.topicBase}/${element}/request`);
          });
        }
        // Disabled selection logic for now as this prevents events from updating
        // TODO: Integrate with tab selection to re-enable this
        // if (this.monitorTabSelected){
        //   this.getMonitoringData()
        // }
        // else {
        //   this.getEventHistory()
        // }
        this.getMonitoringData();
        this.getEventHistory();
      });
    },
    getMonitoringData() {
      this.monitorTabSelected = true;
      this.getHistoricalData({
        table: this.historicalDataTable,
        startDate: this.selectedRange.valueOf()
      });
    },
    getEventHistory() {
      this.monitorTabSelected = false;

      let routeQry = this.$router.currentRoute.query;
      let view = this.view(routeQry.viewName, routeQry.extViewName);

      if (view.protobufComp) {
        let root = this.protobufRoot;

        let payload = {
          component: root.Component_e[view.protobufComp],
          timestamp: this.selectedRange.valueOf()
        };

        this.getEventData({ query: payload });
      }
    }
  },
  watch: {
    meta: {
      handler: function() {
        setTimeout(() => {
          if (this.meta.chart) {
            this.tempScale = this.meta.chart.yAxis.isTemp
              ? this.$options.filters.tempScale
              : temp => temp;
            this.tempScaleSet = this.meta.chart.yAxis.isTemp
              ? this.$options.filters.tempScaleSet
              : temp => temp;
          } else {
            this.tempScale = this.tempScaleSet = temp => temp;
          }
          this.pressureScale = this.meta.isPressure
            ? this.$options.filters.pressureScale
            : pressure => pressure;
          this.headScale = this.meta.isBooster
            ? this.$options.filters.headScale
            : pressure => pressure;
          this.historicalDataTable =
            this.$router.currentRoute.query.extViewName ||
            this.$router.currentRoute.query.viewName;
          this.getData();
        });
      },
      immediate: true
    },
    selectedTab: {
      handler: function() {
        this.getData();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.nav-detail {
  justify-content: center;
  display: flex;
}
.comp-img {
  height: 365px;
  width: 425px;
}
.status-bar {
  margin-top: 60px;
}
.status-alert {
  display: grid;
  grid-template-columns: 53% auto;
  align-items: center;
}
.status-alert > div {
  display: flex;
  justify-content: center;
}
.chart-construction {
  text-align: center;
  margin-bottom: 30px;
  font-size: 30px;
  color: $grey;
}
.tabs-filler.details {
  width: calc(100vw - 517px);
}
.grid-container {
  height: 500px;
}
</style>

<style lang="scss">
.VueCarousel {
  width: 424px;
}
.VueCarousel-slide {
  width: 300px;
}
.VueCarousel-navigation-next,
.VueCarousel-navigation-prev {
  font-size: 25px;
}
.VueCarousel-dot {
  //box-sizing: border-box !important;
  background-color: transparent !important;
  border: 2px solid $deep-blue !important;
  padding: 0px !important;
  margin-top: 23px !important;
  margin-left: 12px !important;
  margin-right: 11px !important;
}
.VueCarousel-dot--active {
  background-color: $deep-blue !important;
}
.VueCarousel-dot-container {
  margin-top: 0px !important;
}
.range-selector-container {
  position: absolute;
  top: 5px;
  right: 51px;
}
.range-selector {
  height: 54px;
  width: 278px;
  background-color: $gray !important;
  border: 0;
  border-radius: 0;
  font-size: 26px;
  color: $white;
}
.range-selector path {
  fill: $white;
}
.range-selector .text {
  margin-right: 10px;
}
.date-rng-opts-container .dropdown-menu {
  width: 100%;
}
.date-rng-opts-container {
  position: absolute;
  right: 54px;
  top: 17px;
  z-index: 20;
}
.date-rng-opts {
  background-color: $gray !important;
  width: 278px;
  height: 54px;
  color: $white;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
