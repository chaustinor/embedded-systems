<template>
  <div>
    <header>
      <slot name="header"></slot>
    </header>
    <main :class="{ 'no-header': noHeader }">
      <slot></slot>
    </main>
    <footer>
      <slot name="footer">
        <div class="footer" v-show="!noFooter" :class="{scrolling: isScrolling}">
          <div
            @click="goToView('status')"
            :class="{'active' : activeFooterTab === 'status' || activeFooterTab === 'details'}"
          >
            <svg viewBox="0 0 32.08 37.25">
              <g>
                <path
                  d="m2,18.35938c0,-7.73481 6.26519,-14 14,-14c7.73481,0 14,6.26519 14,14c0,7.73481 -6.26519,14 -14,14c-7.73481,0 -14,-6.26519 -14,-14z"
                />
              </g>
            </svg>
            <div>System Status</div>
          </div>
          <div
            @click="goToView('infectioncontrol')"
            :class="{'active' : activeFooterTab === 'infectioncontrol'}"
          >
            <svg viewBox="0 0 32.08 37.25">
              <g>
                <path
                  d="M26.59,23.52a20.38,20.38,0,0,1-4.39,5.84A23.34,23.34,0,0,1,16,33.5a23.34,23.34,0,0,1-6.16-4.14,20.57,20.57,0,0,1-4.39-5.84,19.45,19.45,0,0,1-2-8.77V5.67A40.08,40.08,0,0,1,16,3.49,40.28,40.28,0,0,1,27.5,5.31L16,16.75l-5.92-5.91L6.66,14.29,16,23.65,28.59,11.13v3.62a19.45,19.45,0,0,1-2,8.77m3.66-21A44.14,44.14,0,0,0,16,0,44.14,44.14,0,0,0,1.83,2.56L0,3.27V14.75A22.93,22.93,0,0,0,2.36,25.07,23.8,23.8,0,0,0,7.49,31.9,25.66,25.66,0,0,0,15,36.84l1,.41,1.05-.41a25.66,25.66,0,0,0,7.5-4.94,23.8,23.8,0,0,0,5.13-6.83,22.93,22.93,0,0,0,2.36-10.32V3.27Z"
                />
              </g>
            </svg>
            <div>Infection Control</div>
          </div>
          <div
            @click="goToView('sanitation', 'sanitation_loop')"
            :class="{'active' : activeFooterTab === 'sanitation'}"
          >
            <svg viewBox="0 0 28.88 37.25">
              <g>
                <path
                  d="M18.84,23.18h2.54a6.94,6.94,0,0,1-12.8,3.69L6.4,29.77a10.41,10.41,0,0,0,18.45-6.59h2.53L23.11,17.5Zm-4.4-10.43A10.41,10.41,0,0,0,4,23.16H1.5l4.27,5.68L10,23.16H7.5a6.94,6.94,0,0,1,12.81-3.7l2.18-2.9a10.41,10.41,0,0,0-8-3.81m12,3a13.55,13.55,0,0,1,2.47,7.06A14.44,14.44,0,1,1,0,22.81a13.6,13.6,0,0,1,2.48-7.07c3-4.73,6.91-9.21,10.13-14,1.58-2.33,2.11-2.32,3.64,0,3.23,4.81,7.17,9.29,10.16,14"
                />
              </g>
            </svg>
            <div>Sanitation</div>
          </div>
          <div
            @click="goToView('maintenance')"
            :class="{'active' : activeFooterTab === 'maintenance'}"
          >
            <svg viewBox="0 0 41.28 37.25">
              <g>
                <path
                  d="M31.13,32.58a1.79,1.79,0,0,1-1.93,1.63,1.79,1.79,0,0,1,.29-3.57h0a1.8,1.8,0,0,1,1.62,1.94m1.37-2.31c-2.69-3-5.36-5.93-8-8.88-1.79-2-3.56-4-5.35-5.92L15.8,11.8a.55.55,0,0,1-.13-.65A8.07,8.07,0,0,0,10.87.79,5.82,5.82,0,0,0,10,.54,7.64,7.64,0,0,0,5.23.9l1.4,1.16c1.24,1,2.49,2.07,3.72,3.11a2.14,2.14,0,0,1,.29,3.21C10,9.22,9.26,10,8.56,10.87a2.14,2.14,0,0,1-3.27.3L.62,7.27,0,7.57a8.08,8.08,0,0,0,10.4,8.56.57.57,0,0,1,.7.21l2.29,2.78c1,1.23,2,2.45,3,3.67L27,35.55a3.85,3.85,0,0,0,1.67,1.31,2.61,2.61,0,0,0,2.4-.31,18.24,18.24,0,0,0,2.11-1.82,4.59,4.59,0,0,0,.61-1l.09-1.18a4.87,4.87,0,0,0-1.36-2.24"
                />
                <path
                  d="M16.82,24.81h0L9.76,31.88a.49.49,0,0,1-.37.16A.51.51,0,0,1,9,31.88a.54.54,0,0,1,0-.75l7-7,.09-.08c-.19-.23-.37-.46-.57-.69-.79-1-1.59-1.94-2.38-2.89L4.82,28.8a2.72,2.72,0,0,0,0,3.83l3.83,3.83a2.7,2.7,0,0,0,3.83,0l7.63-7.62c-1.09-1.35-2.18-2.69-3.29-4M36.63,0,27.32,7v4.51l-5.13,5.14c.78.86,1.55,1.74,2.34,2.59L29.79,14H34.3l7-9.31Z"
                />
              </g>
            </svg>
            <div>Maintenance</div>
          </div>
          <div
            @click="goToView('settings')"
            :class="{'active' : activeFooterTab === 'settings' ||  activeFooterTab === 'users' || activeFooterTab === 'user'}"
          >
            <svg viewBox="0 0 37.25 37.25">
              <g>
                <path
                  d="M7.86,33.66l1.27-4.19L8,28.13,3.38,29.3,1.73,26.4l3.15-3.12-.39-1.87L0,20.24l0-3.4,4.45-1.23L5,14,1.73,10.7l1.72-3L7.91,8.9,9.18,7.6,7.91,3.27l3-1.71L14,4.83l1.89-.51,1-4.32h3.52l1,3.82-1.88-.49-.52-.14-.27.47-.91,1.59-.27.46.39.39L19.3,7.54l0,.09-2,.53-.52.14v.54l0,1.06A8.79,8.79,0,1,0,27.2,20.4h1.09l.58,0,.13-.56.46-2,.16-.05,1.43,1.49.39.4.48-.29,1.7-1,.47-.28-.17-.54-.56-1.76,3.89,1.22v3.31l-4.58,1.11-.35,1.89,3.23,2.93L34,29.44l-4.49-1.39-1.21,1.27,1.39,4.37-3.19,1.89-3.23-3.36-1.81.55-1.05,4.48-3.52,0-1.06-4.45L14,32.29l-3,3.19m16.39-21a4.71,4.71,0,1,1,4.72-4.71,4.71,4.71,0,0,1-4.72,4.71m9.91-3.74V9l-2.36-.73-.19-.87,1.67-1.71L35.51,4l-2.41.62L32.51,4l.62-2.35-1.59-1L29.77,2.45l-.9-.26L28.29,0H26.42L25.9,2.19l-1,.26L23.24.71l-1.61.9.68,2.31-.68.69L19.26,4l-.91,1.59,1.72,1.74-.25.87-2.36.65,0,1.8,2.39.62.21,1-1.68,1.66.87,1.54,2.47-.62.59.72L21.6,17.8l1.66,1,1.61-1.7,1,.24.56,2.37,1.88,0,.56-2.4,1-.28,1.72,1.78,1.7-1-.74-2.32.65-.67,2.4.73.85-1.67-1.73-1.56.18-1Z"
                />
              </g>
            </svg>
            <div>Settings</div>
          </div>
        </div>
      </slot>
    </footer>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from "vuex";

export default {
  name: "BaseLayout",
  data() {
    return {
      fromCtoF: true,
      isScrollingTimeout: null
    };
  },
  components: {},
  methods: {
    ...mapMutations(["setIsScrolling"]),
    goBack() {
      this.$router.go(-1);
    },
    onSignIn() {
      alert("Sign in clicked");
    },
    goToView(name, view) {
      let location = { name: name, query: { viewName: view } };
      if (name === "status") {
        let goHome = () => {
          setTimeout(() => {
            if (
              window.location.hash !== "#/status" &&
              window.location.hash !== "#/"
            ) {
              this.$router.go(-1);
              goHome();
            }
            if (window.location.hash === "#/") {
              this.$router.push(location);
            } else {
              this.$router.replace(location);
            }
          }, 0);
        };
        goHome();
      } else if (
        name === "settings" &&
        (this.$router.currentRoute.name === "settings" ||
          this.$router.currentRoute.name === "users" ||
          this.$router.currentRoute.name === "user")
      ) {
        let goToSettings = () => {
          setTimeout(() => {
            if (
              window.location.hash !== "#/settings" &&
              window.location.hash !== "#/"
            ) {
              this.$router.go(-1);
              goToSettings();
            }
            this.$router.replace(location);
          }, 0);
        };
        goToSettings();
      } else if (this.$router.currentRoute.name === "status") {
        this.$router.push(location);
      } else {
        this.$router.replace(location);
      }
    }
  },
  computed: {
    ...mapGetters(["currentRoute"]),
    ...mapState(["isScrolling"]),
    noHeader() {
      return (
        this.$router.currentRoute.name === "pin" ||
        this.$router.currentRoute.name === "login"
      );
    },
    noFooter() {
      return (
        this.$router.currentRoute.name === "index" ||
        this.$router.currentRoute.name === "pin" ||
        this.$router.currentRoute.name === "login"
      );
    },
    activeFooterTab() {
      return this.$router.currentRoute.name;
    }
  }
};
</script>

<style scoped lang="scss">
header > div,
footer > div {
  display: flex;
  width: 100vw;
  left: 0;
  position: fixed;
  z-index: 1;
  align-items: center;
}
header > div {
  top: 0;
  justify-content: center;
}
.footer {
  bottom: 0;
  color: $deep-blue;
  fill: $deep-blue;
  display: grid;
  grid-template-columns: 20vw 20vw 20vw 20vw 20vw;
  background-image: linear-gradient(
    to bottom,
    rgba(117, 162, 179, 0.05) 8%,
    rgba(119, 156, 173, 0.5) 78%
  );
  backdrop-filter: blur(7px);
}
.footer > div {
  font-size: 22px;
  height: 168px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 20px;
  clip-path: polygon(0% 24%, 50% 11%, 100% 24%, 100% 100%, 0 100%);
}
@keyframes highlight {
  0% {
    background-color: unset;
    fill: unset;
    color: unset;
  }
  100% {
    background-color: $deep-blue;
    fill: $white;
    color: $white;
  }
}
.footer > div.active {
  animation: highlight 400ms ease-out;
  background-color: $deep-blue;
  fill: $white;
  color: $white;
}
.footer > div.active {
  background-color: $deep-blue;
  fill: $white;
  color: $white;
}
.footer svg {
  height: 68px;
  width: 59px;
}
main {
  overflow-y: visible;
  overflow-x: hidden;
  margin-top: 146px;
  padding-bottom: 168px;
  height: calc(100vh - 146px);
}
main.no-header {
  margin-top: 0;
  padding-bottom: 0;
  height: 100vh;
}
main::-webkit-scrollbar {
  display: none;
}
</style>
