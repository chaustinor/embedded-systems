<template>
  <base-layout>
    <div class="p-5">
      <div class="cancel">
        <svg width="46" height="46" viewBox="0 0 46 46" @click="goBack">
          <path
            d="M26.756 23L45.222 4.53a2.656 2.656 0 0 0 0-3.754 2.66 2.66 0 0 0-3.755 0L23.001 19.244 4.532.776a2.657 2.657 0 0 0-3.752 0 2.65 2.65 0 0 0 0 3.755L19.246 23 .78 41.466a2.65 2.65 0 0 0 1.877 4.53c.68 0 1.358-.258 1.875-.775l18.469-18.469 18.466 18.47c.52.516 1.2.775 1.878.775a2.656 2.656 0 0 0 1.878-4.53L26.755 22.999z"
          />
        </svg>
      </div>
      <div class="main-grid">
        <div class="profile">
          <div class="icon">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <defs>
                <rect id="a" width="100" height="100" rx="4" />
              </defs>
              <g fill="none" fill-rule="evenodd">
                <mask id="b" fill="#fff">
                  <use xlink:href="#a" />
                </mask>
                <use fill="#F9F9F9" xlink:href="#a" />
                <path
                  fill="#09223F"
                  d="M338.898 157.55c2.87 5.689 6.315 12.774 9.435 19.117l-.017-175.028c0-.26-.238-.8-.603-1.142-.536-.511-1.242-.493-1.797-.493h-78.154c-.83 0-1.334-.073-1.918.438-.394.353-.57.668-.68 1.197 0 0-.31 1.041-.077 1.742.229.706 73.811 154.169 73.811 154.169zM121 0H28.333l94.434 200.805c.61.926 1.098 1.406 2.052 1.928 1.293.715 2.525.587 4.38.587l85.79.007s1.58.088 2.187-.4c.355-.294 1.157-1.073 1.157-1.073L121 0zm24.006 2.89c.258-.5.509-.968 1.023-1.418C147.337.317 150.22 0 150.22 0h85.066c.797 0 1.289.03 1.958.44.562.34.847.64 1.168 1.221l19.143 39.662L335 199.7a16.629 16.629 0 0 1-.123 1.167c-.125.813-.178 1.224-.682 1.753-.576.596-1.12.713-1.988.713h-91.648S145.623 5.274 145.472 4.687c-.559-1.327-.466-1.797-.466-1.797z"
                  mask="url(#b)"
                  opacity=".1"
                />
                <path
                  fill="#6C7C93"
                  fill-rule="nonzero"
                  d="M50 49.167c6.444 0 11.667-5.223 11.667-11.667S56.444 25.833 50 25.833 38.333 31.056 38.333 37.5 43.556 49.167 50 49.167zm8.167 2.916c6.763 0 12.25 5.487 12.25 12.25v3.792a4.376 4.376 0 0 1-4.375 4.375H33.958a4.376 4.376 0 0 1-4.375-4.375v-3.792c0-6.763 5.487-12.25 12.25-12.25h1.522A15.915 15.915 0 0 0 50 53.542c2.37 0 4.621-.529 6.645-1.459h1.522z"
                  mask="url(#b)"
                />
              </g>
            </svg>
          </div>
          <div class="name">{{ user.firstName }} {{user.lastName}}</div>
          <div class="email">{{ user.username }}</div>
        </div>
        <div class="create-pin">
          <h3>{{ title }}</h3>
          <h3 style="color: red">{{ errMsg }}</h3>
          <div class="indicator-bar">
            <div
              v-for="(indicator, index) in indicators"
              :key="index"
              :class="{ 'filled': selectedDigits.length > index }"
            ></div>
          </div>
        </div>
        <div class="key-pad">
          <div
            v-for="(key, index) in keys"
            :key="index"
            :id="`pinKey-${index+1}`"
            ref="pinKey"
            class="key"
            @touchstart="touchHandler($event, index+1)"
            @touchend="touchHandler($event, index+1)"
            @click="selectDigit(index + 1)"
          >{{ index + 1 }}</div>
          <div
            class="key"
            ref="pinKeyBack"
            v-on:touchstart="touchHandler($event, 'back')"
            v-on:touchend="touchHandler($event, 'back')"
            @click="goBack"
          >
            <svg width="27" height="47" viewBox="0 0 27 47">
              <path
                fill="#09223F"
                d="M1.412 19.833c.005-.004.007-.01.01-.015L18.648 1.515C19.597.505 20.84 0 22.088 0c1.245 0 2.49.504 3.438 1.515 1.9 2.018 1.9 5.292.002 7.311L11.988 23.5l13.588 14.674c1.898 2.018 1.9 5.293 0 7.311-1.9 2.02-4.983 2.02-6.882 0L1.471 27.181c-.008-.008-.013-.017-.02-.026a4.575 4.575 0 0 1-.35-.403c-.043-.056-.081-.114-.12-.172a4.14 4.14 0 0 1-.164-.235c-.044-.072-.083-.144-.123-.217-.04-.072-.083-.142-.122-.216-.038-.075-.068-.153-.101-.228-.035-.078-.07-.153-.101-.232-.032-.074-.052-.15-.08-.225-.027-.084-.057-.167-.082-.252-.022-.076-.037-.153-.054-.228-.022-.087-.044-.173-.06-.264-.019-.086-.028-.176-.041-.267-.01-.077-.022-.152-.03-.232a5.551 5.551 0 0 1 0-1.02c.008-.075.019-.147.03-.222.013-.092.022-.186.04-.276.015-.087.04-.17.058-.255.018-.079.035-.158.057-.237.024-.081.053-.162.08-.241.026-.08.05-.159.082-.238.03-.073.062-.145.094-.219.036-.079.07-.16.11-.237.033-.07.074-.137.112-.205.043-.077.085-.154.133-.23.046-.075.098-.143.147-.215.046-.065.087-.13.136-.192.098-.125.201-.248.31-.364"
              />
            </svg>
          </div>
          <div
            class="key"
            @click="selectDigit(0)"
            v-on:touchstart="touchHandler($event, 0)"
            v-on:touchend="touchHandler($event, 0)"
            ref="pinKey0"
            :id="`pinKey-0`"
          >0</div>
          <div class="key"
            ref="pinKeyDel"
            v-on:touchstart="touchHandler($event, 'del')"
            v-on:touchend="touchHandler($event, 'del')"
          @click="removeDigit">
            <svg width="69" height="41" viewBox="0 0 69 41">
              <path
                fill="#09223F"
                fill-rule="nonzero"
                d="M61.5 41a6.75 6.75 0 0 0 6.75-6.75v-27A6.75 6.75 0 0 0 61.5.5H22.397c-1.543 0-3.681.886-4.772 1.978L1.738 18.363a3.374 3.374 0 0 0 0 4.773l15.887 15.886A6.75 6.75 0 0 0 22.397 41H61.5zm-29.182-8.932l-2.386-2.386a1.688 1.688 0 0 1 0-2.387l6.545-6.545-6.545-6.545a1.688 1.688 0 0 1 0-2.387l2.386-2.386c.659-.659 1.727-.659 2.387 0l6.545 6.546 6.545-6.546c.66-.659 1.728-.659 2.387 0l2.386 2.386c.659.66.659 1.728 0 2.387l-6.546 6.545 6.546 6.545c.659.66.659 1.728 0 2.387l-2.386 2.386c-.66.659-1.728.659-2.387 0l-6.545-6.546-6.545 6.546c-.66.659-1.728.659-2.387 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </base-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BaseLayout from "./BaseLayout.vue";

export default {
  name: "Pin",
  components: {
    BaseLayout
  },
  data() {
    return {
      keys: [],
      indicators: [],
      selectedDigits: [],
      selectedDigitsConf: [],
      title: "",
      pinValue: null,
      pinValueConf: null,
      step: 0,
      isConfirmStep: false,
      errMsg: "",
      workflows: [
        {
          flow: "login",
          init: () => {
            this.title = "Enter Pin";
          },
          tasks: [
            {
              action: () => {
                this.authenticateUserPin({
                  username: this.user.username,
                  pin: this.pinValue
                }).then(result => {
                  if (result) {
                    // When finised, go back to screen before login
                    this.$router.go(-2);
                  } else {
                    this.errMsg = "Pin Authentication Failed";
                    this.selectedDigits.length = 0;
                    this.pinValue = null;
                  }
                });
              }
            }
          ]
        },
        {
          flow: "new",
          init: () => {
            this.title = "Create a Pin";
          },
          tasks: [
            {
              action: () => {
                this.isConfirmStep = true;
                this.title = "Confirm Pin";
                this.selectedDigits.length = 0;
                this.pinValueConf = this.pinValue;
                this.step++;
              }
            },
            {
              action: () => {
                if (this.pinValue === this.pinValueConf) {
                  // Submit the updated pin
                  this.updateUserPin({
                    username: this.user.username,
                    pin: this.pinValue
                  })
                    .then(result => {
                      if (result) {
                        this.$router.go(-1);
                        this.step++;
                      } else {
                        throw result;
                      }
                    })
                    .catch(error => {
                      this.errMsg = "Pin Rejected";
                      this.selectedDigits.length = 0;
                      this.pinValue = null;
                      // Go back to new pin creation
                      this.step = 0;
                      this.title = "Create a New Pin";
                    });
                } else {
                  this.errMsg = "Pin Entries Must Match";
                  this.selectedDigits.length = 0;
                  this.pinValue = null;
                  // Go back to new pin creation
                  this.step = 0;
                  this.title = "Create a New Pin";
                }
              }
            }
          ]
        },
        {
          flow: "change",
          init: () => {
            this.title = "Enter Current Pin";
          },
          tasks: [
            {
              action: () => {
                this.isConfirmStep = true;
                this.title = "Create a New Pin";
                this.selectedDigits.length = 0;
                this.step++;
              }
            },
            {
              action: () => {
                this.title = "Confirm New Pin";
                this.step++;
                this.pinValueConf = this.pinValue;
                this.selectedDigits.length = 0;
              }
            },
            {
              action: () => {
                if (this.pinValue === this.pinValueConf) {
                  // Submit the updated pin
                  this.updateUserPin({
                    username: this.user.username,
                    pin: this.pinValue
                  })
                    .then(result => {
                      if (result) {
                        this.$router.go(-1);
                        this.step++;
                      } else {
                        throw result;
                      }
                    })
                    .catch(error => {
                      this.errMsg = "Pin Rejected";
                      this.selectedDigits.length = 0;
                      this.pinValue = null;
                      // Go back to new pin creation
                      this.step = 1;
                      this.title = "Create a New Pin";
                    });
                } else {
                  this.errMsg = "Pin Entries Must Match";
                  this.selectedDigits.length = 0;
                  this.pinValue = null;
                  // Go back to new pin creation
                  this.step = 1;
                  this.title = "Create a New Pin";
                }
              }
            }
          ]
        }
      ],
      activeWorkflow: null
    };
  },
  computed: {
    ...mapGetters(["topicMap", "getUser"]),
    user() {
      return this.getUser(this.$router.currentRoute.query.user);
    }
  },
  mounted() {
    this.keys = new Array(9);
    this.indicators = new Array(4);
    let workflow = this.$router.currentRoute.query.workflow;

    if (!workflow) {
      this.selectedWorkflow = this.workflows[0];
    } else {
      this.selectedWorkflow = this.workflows.find(
        w => w.flow === this.$router.currentRoute.query.workflow
      );
    }

    this.selectedWorkflow.init();
  },
  methods: {
    ...mapActions(["publishSet", "authenticateUserPin", "updateUserPin"]),
    selectDigit(val) {
      this.errMsg = "";
      if (this.selectedDigits.length < 4) {
        this.selectedDigits.push(val);
        this.pinValue = this.convertArrayStrToInt(this.selectedDigits);
      }
      if (this.selectedDigits.length === 4) {
        let task = this.selectedWorkflow.tasks[this.step];
        task.action();
      }
    },
    removeDigit() {
      this.selectedDigits.pop();
    },
    goBack() {
      this.$router.back();
    },
    confirmPin() {},
    createUserPin() {},
    goto() {
      this.$router.back({ name: "route" });
    },
    convertArrayStrToInt(array) {
      return parseInt(
        array.reduce((total, currentValue) => {
          return total + currentValue;
        }, "")
      );
    },
    touchHandler(event, index) {
      // Set pin key to active
      let item = null;
      if (index === 'del'){
        item = this.$refs.pinKeyDel
      }
      else if (index === 'back'){
        item = this.$refs.pinKeyBack
      }
      else if (index === 0){
        item = this.$refs.pinKey0
      }
      else {
        item = this.$refs.pinKey[index-1]
      }
      if (event.type === 'touchstart'){
        item.classList.add('active')
      }
      else {
        item.classList.remove('active')
      }
    }
  }
};
</script>

<style scoped lang="scss">
h3 {
  font-size: 42px;
}
.main-grid {
  display: grid;
  grid-row-gap: 70px;
  justify-content: center;
  padding-top: 50px;
}
.cancel {
  display: flex;
  justify-content: flex-end;
}
.profile {
  display: grid;
  grid-template-columns: 100px auto;
  grid-template-rows: 50px 50px;
  grid-column-gap: 25px;
  align-items: center;
  height: 140px;
  background-color: $deep-blue-faint;
  padding: 20px;
}
.profile .icon {
  grid-area: 1 / 1 / span 2 / span 1;
}
.create-pin {
  display: flex;
  flex-direction: column;
  height: 140px;
  justify-content: space-between;
  align-items: center;
  font-family: "HelveticaNeueLTStd-Md";
}
.indicator-bar {
  display: flex;
  width: 200px;
  justify-content: space-between;
}
.indicator-bar > div {
  width: 30px;
  height: 30px;
  border: solid 4px $deep-blue;
}
.indicator-bar > div.filled {
  background-color: $deep-blue;
}
.key-pad {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 50px;
}
.key {
  height: 160px;
  width: 160px;
  background-color: $deep-blue-faint;
  font-size: 80px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.key.active {
  background-color: $deep-blue-faint-active;
}
.name {
  font-size: 32px;
  padding-top: 25px;
  font-family: "HelveticaNeueLTStd-Md";
}
.email {
  color: $grey;
  padding-bottom: 10px;
}
</style>
