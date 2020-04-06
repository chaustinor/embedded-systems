<template>
  <base-layout>
    <template v-slot:header>
      <header-base>
        <template v-slot:left>
          <div class="sign-in" @click="login">
            <svg v-show="!currentUser" width="32" height="37" viewBox="0 0 32 37">
              <path
                fill="#FFF"
                d="M28.125 36.5a3.376 3.376 0 0 0 3.375-3.375v-13.5a3.376 3.376 0 0 0-3.375-3.375h-1.688v-5.062C26.437 5.295 21.642.5 15.75.5 9.858.5 5.062 5.295 5.062 11.188v5.062H3.375A3.376 3.376 0 0 0 0 19.625v13.5A3.376 3.376 0 0 0 3.375 36.5h24.75zm-7.313-20.25H10.687v-5.062a5.068 5.068 0 0 1 5.063-5.063 5.068 5.068 0 0 1 5.062 5.063v5.062z"
              />
            </svg>
            <svg v-show="currentUser" width="32" height="37" viewBox="0 0 448 512">
              <path fill="#fff" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
            </svg>
            <div v-if="!currentUser">Sign In</div>
            <div v-if="currentUser">{{currentUser && currentUser.firstName}} {{currentUser && currentUser.lastName}}</div>
          </div>
        </template>
        <div class="primary">Welcome</div>
      </header-base>
    </template>
    <b-container fluid class="content">
      <div class="tiles" v-on:click="onClick">
        <tile class="top tempered-supply" :status="homeTileStatus('tempered_supply')">
          <div
            v-show="homeTileTemp('tempered_supply')"
            class="current-temp"
          >{{ homeTileTemp('tempered_supply') | tempScale }}°</div>
          <spinner
            v-show="!homeTileTemp('tempered_supply')"
            spinnerSize="0 0 65 31"
            spinnerWidth="65px"
          ></spinner>
          <div class="temp-title">Tempered Supply</div>
          <template v-slot:setPoint>
            <div
              v-show="topicMap(`${tempSupplyTopicBase}/report`)"
              class="set-point-temp"
            >{{ topicMap(`${tempSupplyTopicBase}/report`) | tempScale }}°</div>
            <spinner
              v-show="!topicMap(`${tempSupplyTopicBase}/report`)"
              spinnerSize="0 0 65 31"
              spinnerWidth="65px"
            ></spinner>
            <div class="temp-subtitle">Set Point</div>
          </template>
        </tile>
        <tile class="top hot-supply" :status="homeTileStatus('hot_supply')">
          <div
            v-show="homeTileTemp('hot_supply')"
            class="current-temp"
          >{{ homeTileTemp('hot_supply') | tempScale }}°</div>
          <spinner v-show="!homeTileTemp('hot_supply')" spinnerSize="0 0 65 31" spinnerWidth="65px"></spinner>
          <div class="temp-title">High Temp. Supply</div>
          <template v-slot:setPoint>
            <div
              v-show="topicMap(`${hotSupplyTopicBase}/report`)"
              class="set-point-temp"
            >{{ topicMap(`${hotSupplyTopicBase}/report`) | tempScale }}°</div>
            <spinner
              v-show="!topicMap(`${hotSupplyTopicBase}/report`)"
              spinnerSize="0 0 65 31"
              spinnerWidth="65px"
            ></spinner>
            <div class="temp-subtitle">Set Point</div>
          </template>
        </tile>
        <tile
          class="bottom recirc-inlet"
          :status="homeTileStatus('recirc_inlet')"
          :arrow-dir="'left'"
        >
          <div
            v-show="homeTileTemp('recirc_inlet')"
            class="current-temp"
          >{{ homeTileTemp('recirc_inlet') | tempScale }}°</div>
          <spinner
            v-show="!homeTileTemp('recirc_inlet')"
            spinnerSize="0 0 65 31"
            spinnerWidth="65px"
          ></spinner>
          <div class="temp-title">Recirculation Inlet</div>
        </tile>
        <tile class="bottom cold-inlet" :status="homeTileStatus('cold_inlet')" :arrow-dir="'left'">
          <div
            v-show="homeTileTemp('cold_inlet')"
            class="current-temp"
          >{{ homeTileTemp('cold_inlet') | tempScale }}°</div>
          <spinner v-show="!homeTileTemp('cold_inlet')" spinnerSize="0 0 65 31" spinnerWidth="65px"></spinner>
          <div class="temp-title">Cold Water Inlet</div>
        </tile>
      </div>
      <div class="quasi-footer">
        <div class="system-manuals-arrow">
          <div>Powered by</div>
          <!-- <img src="../../public/assets/arrow-down.png" v-on:click="onShowDocumentation"> -->
          <svg viewBox="0 0 30 18" width="30" height="18" v-on:click="onShowDocumentation">
            <g>
              <g>
                <path
                  d="M13.16 16.611l-.01-.007L1.467 5.76A2.944 2.944 0 0 1 .5 3.593c0-.784.322-1.568.967-2.165C2.755.232 4.845.232 6.134 1.427L15.5 9.952l9.366-8.555c1.288-1.195 3.38-1.197 4.667 0 1.29 1.196 1.29 3.137 0 4.332L17.85 16.574c-.004.005-.01.008-.016.013a2.91 2.91 0 0 1-.257.22c-.036.027-.073.051-.11.075-.05.036-.098.071-.15.104-.046.027-.092.052-.139.077-.046.026-.09.052-.137.077-.049.024-.098.043-.146.063-.05.023-.098.045-.148.064-.047.02-.095.033-.144.05-.054.018-.106.036-.16.052-.049.014-.098.023-.146.034a2.53 2.53 0 0 1-.168.038c-.056.012-.113.018-.17.026-.05.005-.098.014-.149.018-.216.02-.435.02-.65 0-.049-.004-.095-.011-.143-.018-.059-.008-.119-.014-.176-.026-.056-.01-.108-.024-.162-.036-.051-.011-.102-.022-.152-.036-.052-.015-.104-.033-.154-.05s-.101-.032-.152-.052c-.047-.018-.092-.04-.14-.059-.05-.023-.102-.044-.151-.07-.045-.02-.087-.046-.13-.07-.05-.027-.1-.053-.147-.084-.049-.029-.092-.061-.138-.092-.041-.03-.082-.055-.122-.086a3.372 3.372 0 0 1-.233-.195"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div class="docs" v-show="showDocumentation">
        <div v-for="(doc, index) in documents" v-bind:key="index">
          <documentation :data="doc"></documentation>
        </div>
      </div>
    </b-container>
  </base-layout>
</template>

<script>
import BaseLayout from "./BaseLayout.vue";
import Documentation from "../components/Documentation.vue";
import Tile from "../components/Tile.vue";
import Spinner from "../components/Spinner.vue";
import { mapGetters, mapActions } from "vuex";
import HeaderBase from "../components/HeaderBase.vue";

export default {
  name: "Index",
  data() {
    return {
      showDocumentation: false,
      tempSupplyTopicBase:
        "company/tempered_supply/mixing_valve/outlet_setpoint_temp",
      hotSupplyTopicBase: "company/hot_supply/water_heater/setpoint_temp",
      tileColorSchemes: new Map([
        [
          "tempered_supply",
          { temp: "#002b5c", text: "#395a80", background: "#93a4ba" }
        ],
        [
          "hot_supply",
          { temp: "#002b5c", text: "#395a80", background: "#dce1e9" }
        ],
        [
          "recirc_inlet",
          { temp: "#e3e7ed", text: "#aab8c9", background: "#49688b" }
        ],
        [
          "cold_inlet",
          { temp: "#e3e7ed", text: "#aab8c9", background: "#002b5c" }
        ]
      ]),
      documents: [
        {
          name: "Conquest",
          options: [
            {
              text: "PVI Conquest 1000",
              image: "",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
            },
            {
              text: "Aerco SmartPlate Double Wall",
              image: "",
              description: "sed do eiusmod tempor incididunt ut"
            },
            {
              text: "Aerco SmartPlate Single Wall",
              image: "",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit. "
            }
          ]
        },
        {
          name: "FlowMax",
          options: [
            {
              text: "FlowMax",
              image: "",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
            }
          ]
        },
        {
          name: "OneFLow",
          options: [
            {
              text: "OneFlow LDX",
              image: "",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
            }
          ]
        },
        {
          name: "SmartStream",
          options: [
            {
              text: "SmartStream",
              image: "",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
            }
          ]
        },
        {
          name: "IntelliStation",
          options: [
            {
              text: "IntelliStation Jr.",
              image: "",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
            }
          ]
        }
      ]
    };
  },
  components: {
    BaseLayout,
    Documentation,
    Tile,
    Spinner,
    HeaderBase
  },
  computed: {
    ...mapGetters(["topicMap", "homeTileTemp", "homeTileStatus", "currentUser"])
  },
  mounted() {
    this.publishGet("company/cold_inlet/actual_temp/request");
    this.publishGet("company/tempered_supply/actual_temp/request");
    this.publishGet("company/recirc_inlet/actual_temp/request");
    this.publishGet("company/hot_supply/actual_temp/request");

    this.publishGet("company/cold_inlet/status/request");
    this.publishGet("company/tempered_supply/status/request");
    this.publishGet("company/recirc_inlet/status/request");
    this.publishGet("company/hot_supply/status/request");

    this.publishGet(`${this.hotSupplyTopicBase}/request`);
    this.publishGet(`${this.tempSupplyTopicBase}/request`);
  },
  methods: {
    ...mapActions(["publishGet", "restrictAction"]),
    onClick: function() {
      this.$router.push({ path: "status" });
    },
    onShowDocumentation: function() {
      this.showDocumentation = !this.showDocumentation;
    },
    formStatusTopic: function(device) {
      return `company/${device}/status/report`;
    },
    getColors: function(tile) {
      return this.tileColorSchemes.get(tile);
    },
    login() {
      this.$router.push({ path: "login" });
    }
  }
};
</script>

<style scoped lang="scss">
.header > .left > .sign-in {
  margin-left: -38px;
  padding: 38px;
  height: 156px;
}
.footer {
  justify-content: flex-end;
  align-items: center;
  font-size: 29px;
}
.content {
  margin-top: 159px;
}
main {
  padding-bottom:0px
}
.tiles {
  display: flex;
  flex-wrap: wrap;
  margin-top: -12px;
}
.quasi-footer {
  margin-top: 189px;
  z-index: 30;
}
.system-manuals-arrow {
  color: $white;
  text-align: center;
  line-height: 1.4;
  font-size: 32px;
}
.system-manuals-arrow svg {
  fill: $off-white;
}
.docs {
  display: flex;
  flex-wrap: wrap;
}
.tile.top {
  fill: $teal;
}
.tile.top .current-temp {
  color: $teal;
}
.tile.bottom {
  fill: $dark-teal;
}
.tile.bottom .current-temp {
  color: $dark-teal;
}
</style>
