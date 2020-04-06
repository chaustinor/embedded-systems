<template>
  <div>
    <div class="sanitation">
      <alerts-base :fields="fields" :cssClass="cssClass" :status="status" :openModal="openModal">
        <template v-slot:svgs>
          <path
            v-show="status.state === 'O_S_IDLE'"
            fill="#09223F"
            d="M43 22C43 9.626 33.374 0 22 0 9.626 0 0 9.626 0 22c0 11.374 9.626 21 22 21 11.374 0 21-9.626 21-21zM19 34c-.057.137-.943.137-1 0L8 24c-.137-.115-.137-1.006 0-2l2-2c.937-.097 1.823-.097 2 0l6 7 14-14c.177-.137 1.063-.137 2 0l2 2c.137.954.137 1.845 0 2L19 34z"
          />
          <path
            v-show="status.state === 'O_S_SCHEDULED' || status.state === 'O_S_AUTH_ACQUIRED'"
            fill="#09223F"
            d="M22 43c11.377 0 21-9.623 21-21C43 9.623 33.377 0 22 0 9.623 0 0 9.623 0 22c0 11.377 9.623 21 22 21zm4-13l-8-6c.154.106 0-.203 0-1V9c0-.537.461-1 1-1h4c.691 0 1.153.463 1 1v12l6 4c.04.144.135.787 0 1l-3 4c.058.035-.583.138-1 0z"
          />
          <path
            v-show="isActive"
            fill="#FFFFFF"
            d="M29.585 16.906C30.883 19.935 32 22.517 32 24.755c0 6.513-3.483 11.832-9.057 14.49-4.117 2.393-9.632 2.416-13.886 0C3.537 36.668 0 31.315 0 24.755c0-2.24 1.119-4.827 2.415-7.85 3.636-4.772 7.986-9.71 12.076-15.094 1.226-2.452 1.812-2.441 3.018 0 4.073 5.373 8.433 10.31 12.076 15.095zM15.698 14.49c-6.021 0-11.116 5.248-11.472 12.075H1.811l4.227 6.038 5.434-6.038H7.849c.526-4.669 3.921-8.167 7.85-8.453 2.96.286 5.33 1.738 6.64 3.623l2.416-2.415c-2.087-3.16-5.252-4.83-9.057-4.83zm4.83 12.075h3.623c-.533 4.067-3.927 7.56-7.85 7.85-2.96-.29-5.328-1.74-6.64-3.624l-2.416 3.02c2.088 2.557 5.253 4.226 9.057 4.226 6.017 0 11.11-5.245 11.472-11.472h2.415l-4.227-6.641-5.434 6.641z"
          />
          <path
            v-show="status.state === 'O_S_AUTH_PENDING'"
            fill="#09223F"
            d="M23.999 0L48 42H0L23.999 0zm1.34 31.504h-3.128v3.161h3.128v-3.16zm-.225-17.172h-2.678v6.265l.705 8.857h1.268l.705-8.857v-6.265z"
          />
        </template>
        <template v-slot:title>{{ getTitle }}</template>
        <template v-slot:msg>
          <div v-if="isActive">
            <span v-show="status.subtitle">{{status.subtitle}}</span>
            <now v-show="status.time" class="countdown" format="mm:ss" :targetTime="status.time"></now>
            <now
              v-show="status.timeSince"
              class="countdown"
              format="mm:ss"
              :timeSince="status.timeSince"
            ></now>
          </div>
          <div v-show="!isActive" class="msg">{{ status.msg }}</div>
        </template>
        <template v-slot:action-btn>
          <div
            v-if="status.state !== 'O_S_IDLE'"
            class="action-box"
            :class="cssClass"
            @click="onActionBoxClick(status)"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" v-show="isActive">
              <g v-show="status.state === 'O_S_IMMINENT'">
                <path
                  fill="#D00"
                  d="M28.284 0L40 11.716v16.568L28.284 40H11.716L0 28.284V11.716L11.716 0z"
                />
                <path
                  fill="#FFF"
                  d="M20.13 30c5.393 0 9.87-4.477 9.87-9.87C30 14.477 25.523 10 20.13 10 14.477 10 10 14.477 10 20.13 10 25.523 14.477 30 20.13 30zm5.974-5.714l-10.39-10.39c2.834-1.95 6.872-1.763 9.61.78 2.545 2.74 2.729 6.778.78 9.61zm-11.429 1.039c-2.544-2.74-2.728-6.779-.779-9.61l10.39 10.389c-2.834 1.95-6.872 1.763-9.61-.78z"
                />
              </g>
              <g v-show="status.state === 'O_S_RUNNING'">
                <path
                  fill="#D00"
                  d="M28.284 0L40 11.716v16.568L28.284 40H11.716L0 28.284V11.716L11.716 0z"
                />
                <path
                  fill="#FEFEFE"
                  d="M7.956 24.692c.584 0 1.098-.068 1.542-.204a3.26 3.26 0 0 0 1.116-.57c.3-.244.526-.534.678-.87.152-.336.228-.7.228-1.092 0-.48-.102-.874-.306-1.182a2.556 2.556 0 0 0-.726-.738 3.192 3.192 0 0 0-.846-.402 8.156 8.156 0 0 0-.666-.174c-.536-.136-.97-.248-1.302-.336a4.83 4.83 0 0 1-.78-.264c-.188-.088-.314-.184-.378-.288a.77.77 0 0 1-.096-.408c0-.184.04-.336.12-.456.08-.12.182-.22.306-.3a1.22 1.22 0 0 1 .414-.168c.152-.032.304-.048.456-.048.232 0 .446.02.642.06.196.04.37.108.522.204.152.096.274.228.366.396.092.168.146.38.162.636h1.824c0-.496-.094-.918-.282-1.266a2.458 2.458 0 0 0-.762-.858 3.218 3.218 0 0 0-1.098-.486 5.45 5.45 0 0 0-1.29-.15 4.39 4.39 0 0 0-1.152.156 3.216 3.216 0 0 0-1.032.48c-.304.216-.55.486-.738.81-.188.324-.282.706-.282 1.146 0 .392.074.726.222 1.002.148.276.342.506.582.69.24.184.512.334.816.45.304.116.616.214.936.294.312.088.62.168.924.24.304.072.576.156.816.252s.434.216.582.36a.752.752 0 0 1 .222.564.828.828 0 0 1-.168.534c-.112.14-.252.25-.42.33-.168.08-.348.134-.54.162a3.753 3.753 0 0 1-.54.042c-.248 0-.488-.03-.72-.09a1.792 1.792 0 0 1-.606-.276 1.363 1.363 0 0 1-.414-.486 1.571 1.571 0 0 1-.156-.732H4.308c-.008.528.088.984.288 1.368.2.384.47.7.81.948.34.248.732.43 1.176.546.444.116.902.174 1.374.174zm8.46-.192v-6.984h2.568v-1.584h-7.02v1.584h2.568V24.5h1.884zm7.392.192c.664 0 1.256-.114 1.776-.342.52-.228.96-.542 1.32-.942.36-.4.636-.87.828-1.41.192-.54.288-1.122.288-1.746 0-.64-.096-1.234-.288-1.782a4.28 4.28 0 0 0-.828-1.434 3.8 3.8 0 0 0-1.32-.96c-.52-.232-1.112-.348-1.776-.348-.656 0-1.246.116-1.77.348a3.786 3.786 0 0 0-1.326.96 4.28 4.28 0 0 0-.828 1.434 5.354 5.354 0 0 0-.288 1.782c0 .624.096 1.206.288 1.746.192.54.468 1.01.828 1.41.36.4.802.714 1.326.942.524.228 1.114.342 1.77.342zm0-1.572c-.424 0-.784-.082-1.08-.246a2.06 2.06 0 0 1-.72-.654 2.838 2.838 0 0 1-.402-.918 4.362 4.362 0 0 1-.126-1.05c0-.376.042-.74.126-1.092.084-.352.218-.666.402-.942a2.04 2.04 0 0 1 .72-.66c.296-.164.656-.246 1.08-.246.424 0 .784.082 1.08.246.296.164.536.384.72.66.184.276.318.59.402.942.084.352.126.716.126 1.092 0 .36-.042.71-.126 1.05-.084.34-.218.646-.402.918a2.06 2.06 0 0 1-.72.654c-.296.164-.656.246-1.08.246zm7.38 1.38v-3.072h1.98c.536 0 .992-.078 1.368-.234a2.56 2.56 0 0 0 .918-.618c.236-.256.408-.55.516-.882a3.259 3.259 0 0 0 0-2.034 2.374 2.374 0 0 0-.516-.876 2.56 2.56 0 0 0-.918-.618c-.376-.156-.832-.234-1.368-.234h-3.864V24.5h1.884zm1.464-4.536h-1.464v-2.568h1.464c.216 0 .424.016.624.048s.376.094.528.186c.152.092.274.222.366.39.092.168.138.388.138.66s-.046.492-.138.66a1.013 1.013 0 0 1-.366.39 1.452 1.452 0 0 1-.528.186c-.2.032-.408.048-.624.048z"
                />
              </g>
            </svg>
            <span class="action-label">{{ status.actionLabel }}</span>
          </div>
        </template>
      </alerts-base>
    </div>

    <modal-base
      id="blowdown-manual-config"
      :showComment="true"
      :cancel="() => openModal(prevModal)"
      :ok="executeManualBlowdown"
    >
      <template v-slot:title>Blowdown Cycle</template>
      <template v-slot:sub-title>Configure Settings &#38; Start</template>
      <iterator :seed="duration" :min="0" :max="200" :onChange="onDurationChg" title="Duration">MIN</iterator>
      <div class="instr pt-2">Specify how long the blowdown cycle should run</div>
      <template v-slot:btn-ok-txt>Confirm &#38; Start</template>
    </modal-base>

    <modal-base
      id="chemical-shock-manual-config"
      :showComment="true"
      :cancel="() => openModal(prevModal)"
      :ok="executeManualChemicalShock"
    >
      <template v-slot:title>Chemical Sanitation</template>
      <template v-slot:sub-title>Review &#38; Confirm</template>
      <div class="panel open-diverter-valve">
        <label>OPEN DIVERTER VALVE</label>
        <b-form-checkbox v-model="openDiverterValve" switch></b-form-checkbox>
      </div>
      <div class="instr pt-2">This opens the diverter valve when enabled and should be used during system chemical disinfection where residuals exceed safe limits. Diverted chemical may be recirculated in system until the process is complete and then safely purged to drain to allow the distribution system a rapid return to service.<br><br>All (model) units in a shared plant must be placed into this mode during a chemical disinfection process.</div>
      <div class="panel disable-heating">
         <label>DISABLE HEATING</label>
         <b-form-checkbox v-model="disableHeating" switch></b-form-checkbox>
      </div>
      <template v-slot:btn-ok-txt>Confirm &#38; Start</template>
    </modal-base>

    <modal-base
      id="config-schedule"
      contentClass="config-sched"
      :cancel="() => openModal(prevModal)"
      :ok="() => openModal(nextModal)"
    >
      <template v-slot:title>{{ selectedTab }}</template>
      <template v-slot:sub-title>Configure Schedule</template>
      <div class="panel enable-schedule">
        <label>ENABLE SCHEDULE</label>
        <b-form-checkbox v-model="scheduleEnabled" switch></b-form-checkbox>
      </div>
      <div v-show="scheduleEnabled">
        <div class="panel date-time">
          <b-form-group label="Date & Time">
            <div class="date-time-grp">
              <date-picker
                v-model="scheduledDate"
                format="MMMM D, YYYY"
                class="date"
                :disabled-date="notBeforeToday"
              ></date-picker>
              <date-picker type="time" v-model="scheduledTime" class="time" format="h:mm"></date-picker>
              <b-form-select v-model="amOrPm" class="am-pm">
                <option v-for="(val, index) in ['AM', 'PM']" :value="val" :key="index">{{ val }}</option>
              </b-form-select>
            </div>
          </b-form-group>
        </div>
        <iterator
          v-show="isBlowdown"
          class="my-4"
          :seed="duration"
          :min="0"
          :max="200"
          :onChange="onDurationChg"
          title="Duration"
        >MIN</iterator>
        <div class="panel repeat-blowdown mt-4">
          <label>REPEAT {{ selectedTab }}</label>
          <b-form-checkbox v-model="recurs" switch></b-form-checkbox>
        </div>
        <div v-show="recurs" class="repeat-content">
          <div class="panel">
            <div class="every">
              <label>Every</label>
              <input type="text" class v-model="frequency" />
              <b-form-select v-model="weekOrMonth" class="week-month">
                <option :value="0">Week(s)</option>
                <option :value="1">Months</option>
              </b-form-select>
            </div>
          </div>
          <div class="panel repeat-on">
            <b-form-group label="Repeat On">
              <div>
                <b-form-group v-show="weekOrMonth === 1">
                  <b-form-radio v-model="repeatOnDayOfMonth" value="1" class="mb-3">
                    <div class="radio-content" :class="{'active': repeatOnDayOfMonth == 1 }">
                      <label>Day</label>
                      <b-form-select
                        :disabled="repeatOnDayOfMonth == 0"
                        v-model="nthDayOfMonth"
                        class="nth-day-of-month"
                      >
                        <option
                          v-for="(ord, index) in new Array(31)"
                          :value="index"
                          :key="index"
                        >{{ getOrdinal(index + 1) }}</option>
                      </b-form-select>
                      <label>OF THE MONTH</label>
                    </div>
                  </b-form-radio>
                  <b-form-radio v-model="repeatOnDayOfMonth" value="0">
                    <div class="radio-content" :class="{'active': repeatOnDayOfMonth == 0}">
                      <label>The {{dayOfWeek}}</label>
                      <b-form-select
                        :disabled="repeatOnDayOfMonth == 1"
                        v-model="nthDayOfWeek"
                        class="nth-weekday-month"
                      >
                        <option
                          v-for="(ord, index) in ordinals"
                          :value="index"
                          :key="index"
                        >{{ ord }}</option>
                      </b-form-select>
                      <b-form-select
                        :disabled="repeatOnDayOfMonth == 1"
                        v-model="dayOfWeek"
                        class="day-of-week"
                      >
                        <option
                          v-for="(day, index) in daysOfWeek"
                          :value="index"
                          :key="index"
                        >{{ day }}</option>
                      </b-form-select>
                    </div>
                  </b-form-radio>
                </b-form-group>
                <b-form-radio-group
                  v-show="weekOrMonth === 0"
                  class="weekdays"
                  v-model="weekday"
                  :options="weekdays"
                  buttons
                ></b-form-radio-group>
              </div>
            </b-form-group>
          </div>
        </div>
      </div>
    </modal-base>

    <modal-review
      id="loop-auth-review"
      :showComment="true"
      :ok="saveAuthorization"
      :cancel="() => openModal(prevModal)"
      :data="{title: 'Sanitation Loop', subTitle: 'Review & Authorize', 'note': 'Verify all settings before authorizing the scheduled sanitation loop:'}"
    >
      <div class="summary mb-4">
        <label>Scheduled for</label>
        <div class="schedule pt-3 pb-1">{{ scheduleSummary() }}</div>
        <div class="frequency">{{ frequencySummary() }}</div>
        <button class="edit-schedule mt-3" @click="editSchedule()">Edit Schedule</button>
      </div>
      <template v-slot:settings>
        <div>Settings Preview</div>
        <table>
          <tr>
            <td>Current Set Point</td>
            <td>{{ currentSetPoint | tempScale }}°</td>
          </tr>
          <tr>
            <td>Disinfection Control Set Point</td>
            <td>{{ sanitationSettings.dcsp | tempScale }}°</td>
          </tr>
          <tr>
            <td>Kill Temperature</td>
            <td>{{ sanitationSettings.killTemp | tempScale }}°</td>
          </tr>
          <tr>
            <td>Control Dwell Time</td>
            <td>{{ sanitationSettings.cdt }} Minutes</td>
          </tr>
          <tr>
            <td>Accelerated Cool Down</td>
            <td>{{ sanitationSettings.acceleratedCooldown ? 'YES': 'NO' }}</td>
          </tr>
        </table>
      </template>
      <template v-slot:btn-ok="{ ok }">
        <button class="save" @click="ok()">Authorize</button>
      </template>
    </modal-review>

    <modal-review
      id="loop-manual-review"
      :showComment="true"
      :cancel="() => openModal(prevModal)"
      :ok="executeManualLoop"
      :data="{title: 'Sanitation Loop', subTitle: 'Review & Confirm', 'note': 'Please verify your settings before starting the sanitation loop:'}"
    >
      <template v-slot:settings>
        <table>
          <tr>
            <td>Disinfection Set Point</td>
            <td>{{ disinfectTemp }}°</td>
          </tr>
          <tr>
            <td>Kill Temperature</td>
            <td>{{ killTemp }}°</td>
          </tr>
          <tr>
            <td>Control Dwell Time</td>
            <td>{{ dwellTime }} Min.</td>
          </tr>
          <tr>
            <td>Accelerated Cool Down</td>
            <td>{{ accelCoolDown ? 'YES': 'NO' }}</td>
          </tr>
        </table>
      </template>
      <template v-slot:btn-ok="{ ok }">
        <button class="save" @click="ok()">Confirm &#38; Start</button>
      </template>
    </modal-review>

    <modal-review
      id="blowdown-edit-confirm"
      :ok="saveBlowdownSchedule"
      :cancel="() => openModal(prevModal)"
      :data="{title: 'Blowdown Cycle', subTitle: 'Review & Confirm', 'note': 'Please verify your settings before saving the schedule:'}"
    >
      <div class="summary mb-4">
        <label>Scheduled for</label>
        <div class="schedule pt-3 pb-1">{{ scheduleSummary() }}</div>
        <div class="frequency">{{ frequencySummary() }}</div>
      </div>
      <template v-slot:settings>
        <table>
          <tr>
            <td>Duration</td>
            <td>{{ duration }} minutes</td>
          </tr>
        </table>
      </template>
      <template v-slot:btn-ok="{ ok }">
        <button class="save" @click="ok()">Save Schedule</button>
      </template>
    </modal-review>

    <modal-review
      id="loop-edit-confirm"
      :showComment="true"
      :cancel="() => openModal(prevModal)"
      :ok="saveLoopSchedule"
      :data="{title: 'Sanitation Loop', subTitle: 'Review & Confirm', 'note': 'Please verify your settings before saving the schedule:'}"
    >
      <div class="summary mb-4">
        <label>Scheduled for</label>
        <div class="schedule pt-3 pb-1">{{ scheduleSummary() }}</div>
        <div class="frequency">{{ frequencySummary() }}</div>
      </div>
      <template v-slot:settings>
        <div>Settings Preview</div>
        <table>
          <tr>
            <td>Operating Set Point</td>
            <td>{{ currentSetPoint | tempScale }}°</td>
          </tr>
          <tr>
            <td>Disinfection Set Point</td>
            <td>{{ sanitationSettings.dcsp | tempScale }}°</td>
          </tr>
          <tr>
            <td>Kill Temperature</td>
            <td>{{ sanitationSettings.killTemp | tempScale }}°</td>
          </tr>
          <tr>
            <td>Control Dwell Time</td>
            <td>{{ sanitationSettings.cdt }} Minutes</td>
          </tr>
          <tr>
            <td>Accelerated Cool Down</td>
            <td>{{ sanitationSettings.acceleratedCooldown ? 'YES': 'NO' }}</td>
          </tr>
        </table>
      </template>
      <template v-slot:btn-ok="{ ok }">
        <button class="save" @click="ok()">Save Schedule</button>
      </template>
    </modal-review>

    <modal-base
      id="loop-config-settings"
      :cancel="() => openModal(prevModal)"
      :ok="() => openModal(nextModal)"
    >
      <template v-slot:title>Sanitation Loop</template>
      <template v-slot:sub-title>Configure Settings</template>
      <div class="mb-4">
        <iterator
          :seed="disinfectTemp"
          :min="0"
          :max="200"
          :onChange="onDisinfectTempChg"
          title="Disinfection Set Point"
        >{{ getTemperatureUnits }}</iterator>
        <div>The set point of the heater during the sanitation loop cycle</div>
      </div>
      <div class="mb-4">
        <iterator
          :seed="killTemp"
          :min="0"
          :max="200"
          :onChange="onKillTempChg"
          title="Kill Temperature"
        >{{ getTemperatureUnits }}</iterator>
        <div>The minimum temperature the system needs to maintain while the sanitation loop cycle is running</div>
      </div>
      <div class="mb-4">
        <iterator
          :seed="dwellTime"
          :min="0"
          :max="200"
          :onChange="onDwellTimeChg"
          title="Control Dwell Time"
        >MIN</iterator>
        <div>How long the system will dwell at the Disinfection Control Set Point</div>
      </div>
      <b-row>
        <b-col>
          <check-panel v-model="accelCoolDown">Run an Accelerated Cool Down Cycle</check-panel>
          <div>A cool down cycle opens the blowdown valve to pull cold water into the heater after the sanitation loop cycle has completed.</div>
        </b-col>
      </b-row>
    </modal-base>

    <modal-base
      id="loop-acc-cooldown"
      :cancel="() => openModal(prevModal)"
      :ok="() => openModal(nextModal)"
    >
      <template v-slot:title>Sanitation Loop</template>
      <template v-slot:sub-title>Accelerate Cool Down</template>
      <check-panel v-model="accelCoolDown">Include an Accelerated Cool Down Cycle</check-panel>
      <div class="note">A cool down cycle opens the blowdown valve to pull cold water into the heater after the sanitation loop cycle has completed.</div>
    </modal-base>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Now from "../components/Now.vue";
import ModalBase from "../components/ModalBase.vue";
import ModalText from "../components/ModalText.vue";
import ModalReview from "../components/ModalReview.vue";
import Iterator from "../components/Iterator.vue";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import moment from "moment";
import Vue from "vue";
import AlertsBase from "../components/AlertsBase.vue";
import CheckPanel from '../components/CheckPanel.vue'

export default {
  name: "AlertPanelBlowdown",
  props: { status: Object, fields: Array, meta: Object },
  data() {
    return {
      topicBase: "company/hot_supply/water_heater",
      minOperatingSetPoint: 130, //Not Used
      killTemp: 140,
      disinfectTemp: 140,
      dwellTime: 1,
      accelCoolDown: false,
      scheduleEnabled: false,
      openDiverterValve: false,
      disableHeating: false,
      amOrPm: "",
      scheduledDate: new Date(),
      scheduledTime: new Date(),
      recurs: 0,
      duration: 1,
      weekOrMonth: 1,
      dayOfWeek: 1,
      nthDayOfWeek: 1,
      frequency: 1,
      nthDayOfMonth: 0,
      repeatOnDayOfMonth: 0,
      ordinals: ["First", "Second", "Third", "Fourth", "Fifth"],
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      weekday: { text: "Su" },
      weekdays: [
        { value: 6, text: "Su" },
        { value: 0, text: "Mo" },
        { value: 1, text: "Tu" },
        { value: 2, text: "We" },
        { value: 3, text: "Th" },
        { value: 4, text: "Fr" },
        { value: 5, text: "Sa" }
      ],
      prevModal: "",
      nextModal: "",
      modalsMap: new Map()
    };
  },
  components: {
    Now,
    ModalBase,
    Iterator,
    DatePicker,
    ModalText,
    ModalReview,
    AlertsBase,
    CheckPanel
  },
  mounted() {
    this.topicBase = this.meta.topicBase;
    this.publishGet(`${this.topicBase}/sanitation_loop/schedule/request`);
    this.publishGet(`${this.topicBase}/sanitation_loop/next_schedule/request`);
    this.publishGet(`${this.topicBase}/blowdown/schedule/request`);
    this.publishGet(`${this.topicBase}/chemical_shock/schedule/request`);
    this.publishGet(`${this.topicBase}/setpoint_temp/request`);
    this.publishGet(`${this.topicBase}/sanitation_loop/operation_status/request`);
    this.publishGet("company/system/temperature_units/request");
    this.publishGet(`${this.topicBase}/blowdown/operation_status/request`);
    this.publishGet(`${this.topicBase}/chemical_shock/operation_status/request`);
    this.tempScaleSet = this.$options.filters.tempScaleSet;
    this.amOrPm = this.getAMorPM();

    //Blowdown Manual
    this.modalsMap.set("blowdown-manual-1", {
      template: ModalText,
      title: "Blowdown Cycle",
      subTitle: "Disclaimer Notice",
      note:
        "Before manually starting the blowdown cycle, please review and accept the following disclaimer notice:",
      text: `Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit sit amet non magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id elit non mi porta gravida at eget metus.
            \r\nNullam id dolor id nibh ultricies vehicula ut id elit. Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam id dolor id nibh ultricies vehicula ut id elit.
            \r\nVivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod.
            \r\nAenean lacinia bibendum nulla sed consectetur. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet`,
      btnCancel: "Exit",
      btnOk: "Accept",
      next: "blowdown-manual-2",
      onAccept: this.openModal
    });
    this.modalsMap.set("blowdown-manual-2", {
      prev: "blowdown-manual-1",
      custom: "blowdown-manual-config"
    });

    //Blowdown Schedule
    this.modalsMap.set("blowdown-schedule-1", {
      template: ModalText,
      title: "Blowdown Cycle",
      subTitle: "Disclaimer Notice",
      note:
        "Before editing the scheduled blowdown cycle, please review and accept the following disclaimer notice:",
      text: `Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit sit amet non magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id elit non mi porta gravida at eget metus.
            \r\nNullam id dolor id nibh ultricies vehicula ut id elit. Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam id dolor id nibh ultricies vehicula ut id elit.
            \r\nVivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod.
            \r\nAenean lacinia bibendum nulla sed consectetur. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet`,
      btnCancel: "Exit",
      btnOk: "Accept",
      next: "blowdown-schedule-2",
      onAccept: this.openModal
    });
    this.modalsMap.set("blowdown-schedule-2", {
      prev: "blowdown-schedule-1",
      next: "blowdown-schedule-3",
      custom: "config-schedule"
    });
    this.modalsMap.set("blowdown-schedule-3", {
      prev: "blowdown-schedule-2",
      custom: "blowdown-edit-confirm"
    });

    //Sanitaion Loop Manual
    this.modalsMap.set("sanitation-loop-manual-1", {
      template: ModalText,
      title: "Sanitation Loop",
      subTitle: "Disclaimer Notice",
      note:
        "Before manually starting the sanitation loop, please review and accept the following disclaimer notice:",
      text: `Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit sit amet non magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id elit non mi porta gravida at eget metus.
            \r\nNullam id dolor id nibh ultricies vehicula ut id elit. Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam id dolor id nibh ultricies vehicula ut id elit.
            \r\nVivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod.
            \r\nAenean lacinia bibendum nulla sed consectetur. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet`,
      btnCancel: "Exit",
      btnOk: "Accept",
      next: "sanitation-loop-manual-2",
      onAccept: this.openModal
    });
    this.modalsMap.set("sanitation-loop-manual-2", {
      template: ModalText,
      title: "Sanitation Loop",
      subTitle: "Recommendations",
      note: "Please review the following recommendations:",
      text: `It is recommended to run a Blowdown Cycle before starting a Sanitation Loop. If a Blowdown Cycle has not been completed recently, please exit this process and run a Blowdown Cycle now.`,
      btnCancel: "Back",
      btnOk: "Continue",
      next: "sanitation-loop-manual-3",
      prev: "sanitation-loop-manual-1",
      onAccept: this.openModal,
      onBack: this.openModal
    });
    this.modalsMap.set("sanitation-loop-manual-3", {
      prev: "sanitation-loop-manual-2",
      next: "sanitation-loop-manual-4",
      custom: "loop-config-settings"
    });
    this.modalsMap.set("sanitation-loop-manual-4", {
      prev: "sanitation-loop-manual-3",
      custom: "loop-manual-review"
    });

    //Sanitaion Loop Schedule
    this.modalsMap.set("sanitation-loop-schedule-1", {
      template: ModalText,
      title: "Sanitation Loop",
      subTitle: "Disclaimer Notice",
      note:
        "Before editing the scheduled sanitation loop, please review and accept the following disclaimer notice:",
      text: `Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit sit amet non magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id elit non mi porta gravida at eget metus.
            \r\nNullam id dolor id nibh ultricies vehicula ut id elit. Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam id dolor id nibh ultricies vehicula ut id elit.
            \r\nVivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod.
            \r\nAenean lacinia bibendum nulla sed consectetur. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet`,
      btnCancel: "Exit",
      btnOk: "Accept",
      next: "sanitation-loop-schedule-2",
      onAccept: this.openModal
    });
    this.modalsMap.set("sanitation-loop-schedule-2", {
      template: ModalText,
      title: "Sanitation Loop",
      subTitle: "Recommendations",
      note: "Please review the following recommendations:",
      text: `It is recommended to schedule a Blowdown Cycle before a Sanitation Loop in order to remove sediment that may collect in the bottom of the heater. 
            \r\nBe sure to schedule the Blowdown cycle so it finishes completely before the Sanitation Loop begins. Any overlap will cause both to fail.`,
      btnCancel: "Back",
      btnOk: "Continue",
      prev: "sanitation-loop-schedule-1",
      next: "sanitation-loop-schedule-3",
      onAccept: this.openModal,
      onBack: this.openModal
    });
    this.modalsMap.set("sanitation-loop-schedule-3", {
      prev: "sanitation-loop-schedule-2",
      next: "sanitation-loop-schedule-4",
      custom: "config-schedule"
    });
    this.modalsMap.set("sanitation-loop-schedule-4", {
      prev: "sanitation-loop-schedule-3",
      next: "sanitation-loop-schedule-5",
      custom: "loop-acc-cooldown"
    });
    this.modalsMap.set("sanitation-loop-schedule-5", {
      prev: "sanitation-loop-schedule-4",
      custom: "loop-edit-confirm"
    });

    ///Sanitaion Loop Authorize
    this.modalsMap.set("sanitation-loop-auth-1", {
      template: ModalText,
      title: "Sanitation Loop",
      subTitle: "Disclaimer Notice",
      note:
        "Before authorizing the scheduled start of the sanitation loop, please review and accept the following disclaimer notice:",
      text: `Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit sit amet non magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id elit non mi porta gravida at eget metus.
            \r\nNullam id dolor id nibh ultricies vehicula ut id elit. Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam id dolor id nibh ultricies vehicula ut id elit.
            \r\nVivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod.
            \r\nAenean lacinia bibendum nulla sed consectetur. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet`,
      btnCancel: "Exit",
      btnOk: "Accept",
      next: "sanitation-loop-auth-2",
      onAccept: this.openModal
    });
    this.modalsMap.set("sanitation-loop-auth-2", {
      template: ModalText,
      title: "Sanitation Loop",
      subTitle: "Recommendations",
      note:
        "Before authorizing the scheduled start of the sanitation loop, please review and accept the following disclaimer notice:",
      text: `It is recommended to schedule a Blowdown Cycle before a Sanitation Loop in order to remove sediment that may collect in the bottom of the heater. 
            \r\nBe sure to schedule the Blowdown cycle so it finishes completely before the Sanitation Loop begins. Any overlap will cause both to fail.`,
      btnCancel: "Back",
      prev: "sanitation-loop-auth-1",
      next: "sanitation-loop-auth-3",
      btnOk: "Continue",
      onAccept: this.openModal,
      onBack: this.openModal
    });
    this.modalsMap.set("sanitation-loop-auth-3", {
      prev: "sanitation-loop-auth-2",
      custom: "loop-auth-review"
    });

    //Chemical Shock Manual
    this.modalsMap.set("chemical-shock-manual-1", {
      template: ModalText,
      title: "Chemical Sanitation",
      subTitle: "Disclaimer Notice",
      note:
        "Before manually starting chemical sanitation, please review and accept the following disclaimer notice:",
      text: `Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit sit amet non magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id elit non mi porta gravida at eget metus.
            \r\nNullam id dolor id nibh ultricies vehicula ut id elit. Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam id dolor id nibh ultricies vehicula ut id elit.
            \r\nVivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod.
            \r\nAenean lacinia bibendum nulla sed consectetur. Cul sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet`,
      btnCancel: "Exit",
      btnOk: "Accept",
      next: "chemical-shock-manual-2",
      onAccept: this.openModal
    });
    this.modalsMap.set("chemical-shock-manual-2", {
      prev: "chemical-shock-manual-1",
      custom: "chemical-shock-manual-config"
    });


  },
  computed: {
    ...mapGetters([
      'protobufRoot',
      'topicMap'
    ]),
    getTitle() {
      if (this.status.title){
        return this.status.title
      }
      return "No Alerts"
    },
    getTemperatureUnits() {
      let u = this.topicMap("company/system/temperature_units/report", "text");
      if (u == "c") {
        return "°C";
      }
      return "°F";
    },
    isActive() {
      return (
        this.status.state === "O_S_IMMINENT" ||
        this.status.state === "O_S_RUNNING"
      );
    },
    scheduled() {
      return (
        this.status.state === "O_S_SCHEDULED" ||
        this.status.state === "O_S_AUTH_ACQUIRED"
      );
    },
    cssClass(){
      if (this.status.state === 'STATE_ERROR'){
        return 'error'
      } else if (this.status.state === 'STATE_WARN'){
        return 'warning'
      } else if (this.status.state === "O_S_SCHEDULED" ||
        this.status.state === "O_S_AUTH_ACQUIRED") {
        return "scheduled";
      } else if (this.status.state === "O_S_AUTH_PENDING") {
        return "authorization";
      } else if (
        this.status.state === "O_S_IMMINENT" ||
        this.status.state === "O_S_RUNNING"
      ) {
        return "active";
      }
      return "";
    },
    isBlowdown() {
      return this.$router.currentRoute.query.viewName === "blowdown_cycle";
    },
    selectedTab() {
      return this.isBlowdown ? "Blowdown Cycle" : "Sanitation Loop";
    },
    sanitationSettings() {
      if (!this.isBlowdown) {
        let schedule = this.topicMap(
          `${this.topicBase}/sanitation_loop/next_schedule/report`,
          "schedule"
        );
        if (schedule && schedule.sanitationSettings) {
          return schedule.sanitationSettings;
        }
        return {
          dcsp: 0,
          cdt: 0,
          killTemp: 0
        };
      }
      return {};
    },
    currentSetPoint() {
      return this.topicMap(`${this.topicBase}/setpoint_temp/report`);
    }
  },
  methods: {
    ...mapActions([
      "publishSet",
      "publishGet",
      "publishEvent",
      "restrictAction"
    ]),
    onActionBoxClick(status) {
      let root = this.protobufRoot;
      let event = root.lookupType("event");

      let payload = {
        component: root.Component_e.INVALID_COMPONENT
      };

      if (status.modal) {
        this.openModal(status.modal);
        return;
      } else if (status.state === "O_S_IMMINENT") {
        //cancel scheduled task
        payload["action"] = root.Action_e.CANCEL_OPERATION;
      } else if (status.state === "O_S_RUNNING") {
        //Emergency stop task
        payload["action"] = root.Action_e.EMERGENCY_STOP;
      } else if (status.state === "O_S_AUTH_ACQUIRED") {
        payload["action"] = root.Action_e.CANCEL_OPERATION;
      } else if (status.state === "O_S_AUTH_PENDING") {
        //review and Authorize
        this.openModal(status.modal);
        return;
      }
      let errMsg = event.verify(payload);
      if (errMsg) throw Error(errMsg);

      this.publishEvent({ topic: "company/system/event", value: payload });
    },
    getAMorPM() {
      return new Date().getHours() < 12 ? "AM" : "PM";
    },
    scheduleSummary() {
      let opTime = this.adjustHoursForAmPm(this.scheduledTime);
      return `${moment(this.scheduledDate).format("MMMM D, YYYY")} at ${moment(
        opTime
      ).format("h:mm A")}`;
    },
    adjustHoursForAmPm(time) {
      if (this.amOrPm === "AM" && time.getHours() >= 12) {
        time.setHours(time.getHours() - 12);
      } else if (this.amOrPm === "PM" && time.getHours() < 12) {
        time.setHours(time.getHours() + 12);
      }
      return time;
    },
    frequencySummary() {
      let freq = "";
      if (this.frequency == 1) {
        freq = `Each ${this.weekOrMonth ? "Month" : "Week"}`;
      } else {
        freq = `Every ${this.frequency} ${
          this.weekOrMonth ? "Months" : "Weeks"
        }`;
      }
      let day = "";
      if (this.weekOrMonth) {
        day = this.daysOfWeek[this.dayOfWeek];
      } else {
        day = this.daysOfWeek[this.weekday];
      }
      return `Repeats ${freq} on ${day}`;
    },
    notBeforeToday(date) {
      return date < new Date();
    },
    editSchedule() {
      this.$bvModal.hide("loop-auth-review");
      this.openModal("sanitation-loop-manual-3");
    },
    openModal(key) {
      let modalData = null;
      if (key.modal) {
        modalData = this.modalsMap.get(key.modal);
      } else {
        modalData = this.modalsMap.get(key);
      }
      this.prevModal = modalData.prev;
      this.nextModal = modalData.next;

      this.restrictAction({ action: "operation" })
        .then(() => {
          if (modalData.custom) {
            this.$bvModal.show(modalData.custom);
          } else {
            let ComponentClass = Vue.extend(ModalText);
            let instance = new ComponentClass({
              propsData: { data: modalData }
            });
            instance.$mount();
            instance.show();
          }
        })
      .catch((loggedIn)=>{

        let location = {
          name: "login",
          query: {loggedIn}
        };
        this.$router.push(location);
      })

    },
    executeManualBlowdown(comment) {
      let schedule = {
        comment: comment,
        duration: this.duration,
        isOneTime: true,
        isManual: true,
        active: true,
        timestamp: new Date().getTime()
      };
      this.publishSet({
        topic: `${this.topicBase}/blowdown/schedule/request`,
        value: schedule,
        type: "schedule"
      });
      this.duration = 1;
    },
    executeManualChemicalShock(comment) {
      let schedule = {
        comment: comment,
        isOneTime: true,
        isManual: true,
        active: true,
        timestamp: new Date().getTime(),
        chemicalShockSettings: {
          openDiverterValve: this.openDiverterValve,
          disableHeating: this.disableHeating
        }
      }
      this.publishSet({
        topic: `${this.topicBase}/chemical_shock/schedule/request`,
        value: schedule,
        type: "schedule"
      });
    },
    executeManualLoop(comment) {
      let schedule = {
        duration: this.dwellTime,
        comment: comment,
        isOneTime: true,
        isManual: true,
        active: true,
        timestamp: new Date().getTime(),
        sanitationSettings: {
          dcsp: this.tempScaleSet(this.disinfectTemp),
          killTemp: this.tempScaleSet(this.killTemp),
          cdt: this.dwellTime,
          accelCoolDown: this.accelCoolDown
        }
      };
      this.publishSet({
        topic: `${this.topicBase}/sanitation_loop/schedule/request`,
        value: schedule,
        type: "schedule"
      });
    },
    saveSchedule(comment) {
      let d = this.scheduledDate;
      let t = this.adjustHoursForAmPm(this.scheduledTime);
      let operationTime = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        t.getHours(),
        t.getMinutes(),
        t.getSeconds(),
        0
      );

      let schedule = {
        comment: comment,
        duration: this.duration,
        isOneTime: !this.recurs,
        isManual: false,
        active: this.scheduleEnabled,
        operationTime: operationTime.getTime(), //this.operationTime.getTime()
        weekMonth: this.weekOrMonth,
        repeatInterval: this.frequency,
        timestamp: operationTime.getTime()
      };
      if (this.repeatOnDayOfMonth) {
        schedule.runOn = this.nthDayOfMonth;
      } else {
        if (this.weekOrMonth == "1") {
          schedule.datesInterval = [this.nthDayOfMonth]; // Month
        } else {
          schedule.datesInterval = [this.weekday]; // Week
        }
      }
      return schedule;
    },
    saveBlowdownSchedule() {
      let schedule = this.saveSchedule("");
      this.publishSet({
        topic: `${this.topicBase}/blowdown/schedule/request`,
        value: schedule,
        type: "schedule"
      });
    },
    saveLoopSchedule(comment) {
      let schedule = this.saveSchedule(comment);

      let sanitationSettings = {
        accelCoolDown: this.accelCoolDown
      };
      schedule = { ...schedule, ...sanitationSettings };
      this.publishSet({
        topic: `${this.topicBase}/sanitation_loop/schedule/request`,
        value: schedule,
        type: "schedule"
      });
    },
    saveAuthorization(comment) {
      let root = this.protobufRoot;
      let event = root.lookupType("event");
      let payload = {
        component: root.Component_e.SANITATION_PUMP,
        action: root.Action_e.AUTHORIZED,
        comment: comment
      };

      let errMsg = event.verify(payload);
      if (errMsg) throw Error(errMsg);

      this.publishEvent({ topic: "company/system/event", value: payload });
    },
    onDurationChg(val) {
      this.duration = val;
    },
    onDisinfectTempChg(val) {
      this.disinfectTemp = val;
    },
    onKillTempChg(val) {
      this.killTemp = val;
    },
    onDwellTimeChg(val) {
      this.dwellTime = val;
    },
    onFrequencyChg(val) {
      this.frequencyT = val;
    },
    openHelpCenter() {},
    getOrdinal(val) {
      let ordValue = "";
      if (val % 10 == 1 && val % 100 != 11) {
        ordValue = "st";
      } else if (val % 10 == 2 && val % 100 != 12) {
        ordValue = "nd";
      } else if (val % 10 == 3 && val % 100 != 13) {
        ordValue = "rd";
      } else {
        ordValue = "th";
      }
      return val + ordValue;
    }
  }
};
</script>

<style scoped lang="scss">
.alert > .msg {
  text-align: center;
  padding-left: 3rem;
  padding-right: 3rem;
  font-size: 20px;
  opacity: 0.5;
}
.alert .countdown {
  font-size: 37px;
  font-weight: 500;
  color: $off-white;
}
.alert.authorization {
  border: 6px solid $mustard;
  background-color: $mustard;
  color: $deep-blue;
}
.action-box > svg {
  margin-right: 20px;
}
.action-box.scheduled {
  color: $white;
  background-color: $sky-blue;
}
button.edit-schedule {
  border: 1px solid $sky-blue;
  color: $sky-blue;
  background-color: transparent;
  width: 100%;
}
.text {
  text-align: center;
  padding-left: 5rem;
  padding-right: 5rem;
  font-size: 20px;
  opacity: 0.5;
}
.radio-content {
  display: grid;
  grid-template-columns: auto auto auto;
  align-items: center;
  grid-column-gap: 20px;
  opacity: 0.35;
  width: 100%;
}
.radio-content.active {
  opacity: 1;
}
.custom-select {
  height: 60px;
  box-shadow: none;
  font-size: 18px;
}
.custom-select:disabled {
  opacity: 0.35;
  color: unset;
  background-color: unset;
}
.week-month.custom-select {
  width: 249px;
}
.day-of-week.custom-select {
  width: 179px;
}
.nth-weekday-month.custom-select {
  width: 150px;
}
.nth-day-of-month.custom-select {
  width: 110px;
}
.repeat-content {
  border-top: 1px solid $haze;
}
.repeat-on {
  flex-direction: column;
  align-items: unset;
  min-height: 110px;
  justify-content: center;
}
.open-diverter-valve,
.disable-heating,
.enable-schedule,
.repeat-blowdown {
  display: flex;
  justify-content: space-between;
  height: 110px;
}
.date-time {
  border-top: 1px solid $haze;
}
.date-time-grp {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 10px;
}
.mx-datepicker.date {
  width: 265px;
}
.mx-datepicker.time {
  width: 105px;
}
.custom-select.am-pm {
  width: 99px;
}
.blowdown-disclaimer-txt {
  height: 478px;
  background-color: $deep-blue-faint;
  padding: 20px;
}
.instr {
  font-size: 16px;
  opacity: 0.5;
}
.text-area-container {
  background-color: $paper;
}
.d-block,
label {
  text-transform: uppercase;
  opacity: 0.5;
  font-weight: bold;
}
.every {
  display: grid;
  grid-template-columns: auto 90px 249px;
  grid-column-gap: 20px;
  align-items: center;
  width: 100%;
}
</style>

<style lang="scss">
.sanitation > .alert {
  grid-row-gap: 30px !important;
}
.alert-dropdown.error,
.alert-dropdown.warning,
.alert-dropdown.active,
.alert-dropdown.authorization {
  background-color: $white !important;
}
.alert-dropdown.error path,
.alert-dropdown.warning path,
.alert-dropdown.authorization path,
.alert-dropdown.active path {
  fill: $deep-blue;
}
.alert.error {
  background-color: $red;
  color: $white;
}
.alert.warning {
  background-color: $mustard;
  color: $deep-blue;
}
.alert.active {
  border: 6px solid $mustard;
  background-color: $purple;
  color: $white;
}
.alert-dropdown.error,
.alert-dropdown.warning,
.alert-dropdown.active,
.alert-dropdown.authorization,
.alert-dropdown.scheduled {
  width: 74px;
}
.alert.error .dropdown-menu,
.alert.warning .dropdown-menu,
.alert.active .dropdown-menu,
.alert.authorization .dropdown-menu,
.alert.scheduled .dropdown-menu {
  width: unset;
}
.config-sched {
  height: 848px;
}
.alert.authorization {
  border: 6px solid $mustard;
  background-color: $mustard;
  color: $deep-blue;
}
.btn-group-toggle.weekdays > .btn-secondary {
  width: 60px;
  height: 60px;
  background-color: $white;
  border: 1px solid $grey;
  font-size: 18px;
}
.btn-group-toggle.weekdays > .btn-secondary:not(:last-child) {
  margin-right: 7px;
}
.btn-group-toggle.weekdays > .btn-secondary.active {
  background-color: $sky-blue;
  border: 0;
  color: $white;
  box-shadow: none;
  outline: none;
}
</style>
