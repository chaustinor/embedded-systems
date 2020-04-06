<template>
  <div>
    <base-layout>
      <div class="p-5 logins">
        <div class="cancel">
          <svg width="46" height="46" viewBox="0 0 46 46" @click="goBack">
            <path d="M26.756 23L45.222 4.53a2.656 2.656 0 0 0 0-3.754 2.66 2.66 0 0 0-3.755 0L23.001 19.244 4.532.776a2.657 2.657 0 0 0-3.752 0 2.65 2.65 0 0 0 0 3.755L19.246 23 .78 41.466a2.65 2.65 0 0 0 1.877 4.53c.68 0 1.358-.258 1.875-.775l18.469-18.469 18.466 18.47c.52.516 1.2.775 1.878.775a2.656 2.656 0 0 0 1.878-4.53L26.755 22.999z"/>
          </svg>
        </div>
        <div class="py-5">
          <svg width="48" height="55" viewBox="0 0 48 55">
            <path d="M42.562 54.75a5.064 5.064 0 0 0 5.063-5.063v-20.25a5.064 5.064 0 0 0-5.063-5.062h-2.53v-7.594C40.031 7.943 32.837.751 24 .751 15.162.75 7.969 7.942 7.969 16.78v7.594H5.437a5.064 5.064 0 0 0-5.062 5.063v20.25a5.064 5.064 0 0 0 5.062 5.062h37.125zM31.594 24.375H16.406v-7.594c0-4.187 3.407-7.593 7.594-7.593s7.594 3.406 7.594 7.593v7.594z"/>
          </svg>
        </div>
        <h3 class="py-5">Select a Login</h3>
        <div class="users">
          <div>
            <div v-for="(user, index) in getActiveUsers" :key="index" :id="`login-${user.username}`" class="profile" @click="goToPin(user)">
              <div class="icon">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <defs>
                    <rect id="a" width="100" height="100" rx="4"/>
                  </defs>
                  <g fill="none" fill-rule="evenodd">
                    <mask id="b" fill="#fff">
                      <use xlink:href="#a"/>
                    </mask>
                    <use fill="#F9F9F9" xlink:href="#a"/>
                    <path fill="#09223F" d="M338.898 157.55c2.87 5.689 6.315 12.774 9.435 19.117l-.017-175.028c0-.26-.238-.8-.603-1.142-.536-.511-1.242-.493-1.797-.493h-78.154c-.83 0-1.334-.073-1.918.438-.394.353-.57.668-.68 1.197 0 0-.31 1.041-.077 1.742.229.706 73.811 154.169 73.811 154.169zM121 0H28.333l94.434 200.805c.61.926 1.098 1.406 2.052 1.928 1.293.715 2.525.587 4.38.587l85.79.007s1.58.088 2.187-.4c.355-.294 1.157-1.073 1.157-1.073L121 0zm24.006 2.89c.258-.5.509-.968 1.023-1.418C147.337.317 150.22 0 150.22 0h85.066c.797 0 1.289.03 1.958.44.562.34.847.64 1.168 1.221l19.143 39.662L335 199.7a16.629 16.629 0 0 1-.123 1.167c-.125.813-.178 1.224-.682 1.753-.576.596-1.12.713-1.988.713h-91.648S145.623 5.274 145.472 4.687c-.559-1.327-.466-1.797-.466-1.797z" mask="url(#b)" opacity=".1"/>
                    <path fill="#6C7C93" fill-rule="nonzero" d="M50 49.167c6.444 0 11.667-5.223 11.667-11.667S56.444 25.833 50 25.833 38.333 31.056 38.333 37.5 43.556 49.167 50 49.167zm8.167 2.916c6.763 0 12.25 5.487 12.25 12.25v3.792a4.376 4.376 0 0 1-4.375 4.375H33.958a4.376 4.376 0 0 1-4.375-4.375v-3.792c0-6.763 5.487-12.25 12.25-12.25h1.522A15.915 15.915 0 0 0 50 53.542c2.37 0 4.621-.529 6.645-1.459h1.522z" mask="url(#b)"/>
                  </g>
                </svg>
              </div>
              <div class="name">{{ user.firstName }} {{user.lastName}}</div>
              <div class="sub-label">{{ user.username }}</div>
            </div>
            <div class="profile other" @click="createNewUser()">
              <span>New Login</span>
            </div>
          </div>
        </div>
      </div>
    </base-layout>  

    <b-modal id="modal-login"
      centered 
      hide-footer
      no-close-on-esc 
      no-close-on-backdrop>
      <template v-slot:modal-header-close>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <path fill="#09223F" fill-rule="evenodd" d="M11.633 10l8.029-8.03A1.155 1.155 0 0 0 18.029.337L10 8.367 1.97.337C1.52-.113.79-.113.34.337a1.153 1.153 0 0 0 0 1.633L8.368 10 .339 18.029a1.153 1.153 0 0 0 .816 1.97c.296 0 .59-.113.816-.338l8.03-8.03 8.028 8.03a1.155 1.155 0 0 0 1.633-1.632l-8.029-8.03z"/>
        </svg>
      </template>
      <template v-slot:modal-title>
        Please Login to Continue
      </template>
      <div class="pt-4 pb-3">
        <b-form-group
          label-class="modal-dark"
          label="Username">
          <b-form-input
            v-model="userName">
          </b-form-input>
        </b-form-group>
        <b-form-group
          label-class="modal-dark"
          label="Password">
          <b-form-input
            v-model="password">
          </b-form-input>
        </b-form-group>
        <div class="btn-grp">
          <b-button size="md" class="save login" @click="loginOther()">
            Login
          </b-button>
          <div class="need-password" >Don’t have a password?</div>
        </div>
      </div>
    </b-modal>
    <b-modal id="modal-not-connected"
      centered 
      hide-footer>
      <template v-slot:modal-header>
        <div></div>
      </template>
      <div class="pt-4 pb-3">
        <div class="d-flex justify-content-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="53" height="43" viewBox="0 0 53 43">
              <path fill="#D00" fill-rule="nonzero" d="M50.613 41.743l1.611-2.073a1.312 1.312 0 0 0-.23-1.842l-12.878-9.952 3.726-3.709c.534-.53.515-1.4-.047-1.9-5.327-4.737-12.215-6.781-18.895-6.151l-6.822-5.272c10.331-3.147 21.964-.904 30.387 6.812.523.48 1.334.469 1.837-.03l2.809-2.787a1.304 1.304 0 0 0-.029-1.884C40.725 2.45 24.452.188 10.945 6.103L3.73.527a1.313 1.313 0 0 0-1.842.23L.276 2.83a1.312 1.312 0 0 0 .23 1.842l48.265 37.302a1.313 1.313 0 0 0 1.842-.23zM5.035 17.655a31.346 31.346 0 0 1 1.776-1.477L1.482 12.06c-.352.305-.72.578-1.064.895a1.303 1.303 0 0 0-.03 1.884l2.81 2.786c.503.5 1.314.511 1.837.031zm9.235 9.368c1.095-.952 2.298-1.695 3.54-2.342l-5.608-4.334a24.58 24.58 0 0 0-2.497 1.92c-.563.5-.58 1.37-.047 1.9l2.812 2.79c.49.486 1.28.518 1.8.066zm11.98 12.602c2.618 0 4.77-1.921 5.167-4.428l-7.276-5.624a5.247 5.247 0 0 0 2.109 10.052z"/>
          </svg>
        </div>
        <div class="not-connected-title d-flex justify-content-center" >No Network Connection</div>
        <div class="not-connected-text d-flex justify-content-center">Please check your network connection and try again. You must be connected to a network to add a new user login.</div>
        <div class="btn-grp">
          <b-button size="md" class="save settings" v-if="settingsEnabled" @click="goToSettings()">
            Go to Systen Settings
          </b-button>
          <b-button size="md" class="save settings" v-else :disabled="true" @click="goToSettings()">
            Please Contact Owner
          </b-button>
          <div class="go-back" @click="closeModals()">Go back</div>
        </div>
      </div>
    </b-modal>
    <b-modal id="modal-not-authorized"
      centered 
      hide-footer>
      <template v-slot:modal-header>
        <div></div>
      </template>
      <div class="pt-4 pb-3">
        <div class="d-flex justify-content-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="40" viewBox="0 0 45 40">
            <path fill="#D00" fill-rule="evenodd" d="M22.499 0L45 39.375H0L22.499 0zm1.257 29.535h-2.933V32.5h2.933v-2.964zm-.212-16.099h-2.51v5.874l.66 8.303h1.19l.66-8.303v-5.874z"/>
        </svg>
        </div>
        <div class="not-connected-title d-flex justify-content-center" >Permission Denied</div>
        <div class="not-connected-text d-flex justify-content-center">Please contact your administrator for access</div>
        <div class="btn-grp">
          <b-button size="md" class="save settings" v-if="settingsEnabled" @click="goBack()">
            Continue
          </b-button>
          <div class="go-back" @click="closeModals()">Sign in as a different user</div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseLayout from './BaseLayout.vue'

export default {
  name: 'Login',
  components: {
    BaseLayout,
  },
  data(){
    return {
      userName:'',
      password: '',
      settingsEnabled: false
    }
  },
  computed: {
    ...mapGetters([
      'topicMap',
      'getActiveUsers'
    ]),
  },
  mounted(){
    this.publishGet('user/userlist/get/request')
    this.restrictAction({action: 'route', to:{name:'settings'}}).then(()=>{
      this.settingsEnabled= true;
    })
    .catch(()=>{
      this.settingsEnabled = false;
    })
    if (this.$router.currentRoute.query.loggedIn === 'true' || this.$router.currentRoute.query.loggedIn === true){
      this.$bvModal.show('modal-not-authorized')
    }
  },
  methods: {
    ...mapActions([
      'publishSet',
      'publishGet',
      'restrictAction'
    ]),
    createNewUser(){
      this.$bvModal.show('modal-login')
    },
    goToPin(user){
      this.$router.push({ name: 'pin', query: { workflow: 'login', user: user.userId}})
    },
    goToSettings(){
      this.$router.replace({ name: 'settings'})
    },
    goBack(){
      this.$router.back()
    },
    loginOther(){
      this.$bvModal.hide('modal-login')
      this.$bvModal.show('modal-not-connected')
    },
    closeModals(){
      this.$bvModal.hide('modal-login')
      this.$bvModal.hide('modal-not-connected')
      this.$bvModal.hide('modal-not-authorized')
    }

  }
}
</script>

<style scoped lang="scss">
  button.login {
    width: 100%;
    font-size: 28px;
    font-weight: normal;
  }
  h3 {
    color: $deep-blue;
    font-size: 42px;
    font-family: "HelveticaNeueLTStd-Md";
  }
  .logins > * {
    display: flex;
    justify-content: center;
  }
  .users {
    height: calc(100vh - 500px);
    overflow-y: auto;
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
    width: 580px;
  }
  .profile .icon {
    grid-area: 1 / 1 / span 2 /span 1; 
  }
  .profile:not(:last-child) {
    margin-bottom: 15px;
  }
  .sub-label {
    color: $grey;
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
  .other {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
  }
  .other > span {
   margin-right: 20px;
   font-family: "HelveticaNeueLTStd-Md";
   margin-bottom: 10px;
  }
  .btn-grp {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100px;
    justify-content: space-between;
    margin-top: 50px;
  }
  .cancel {
    justify-content: flex-end;
  }
  .need-password{
    margin-top: 28px;
  }
  .not-connected-title {
    margin-top:40px;
    font-family: HelveticaNeueLTStd-Md;
    font-size: 24px;
    color: #09223f;
  }
  .not-connected-text {
    margin-top:15px;
    font-family: HelveticaNeueLTStd-Md;
    font-size: 18px;
    line-height: 1.11;
    text-align: center;
    color: #6c7c93;
  }
  .go-back {
    font-family: HelveticaNeueLTStd-Md;
    font-size: 18px;
    text-align: center;
    color: #09223f;
  }
  button.settings {
    width: 100%;
    font-size: 28px;
    font-weight: normal;
  }
</style>
<style lang="scss">
  .modal-dark{
    opacity: 1;
    font-size: 20px;
    font-weight: normal;
    text-transform: unset;
  }
  #modal-login .modal-title{
    font-size: 24px;
    font-weight: normal;
    color: $deep-blue;
  }
</style>
