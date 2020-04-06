<template>
  <div>
    <base-layout>
      <template v-slot:header>
        <header-base>
          <div class="primary">Users</div>
          <div class="secondary">{{ getUnitNameAndLoc }}</div>
        </header-base>
      </template>
      <div class="mt-5 users-list">
        <b-button class="new-user" @click="addNewUser">
          <span>New User</span>
          <svg width="22" height="21" viewBox="0 0 22 21">
            <path fill="#FFF" fill-rule="nonzero" d="M20.498 8.542c.472 0 .854.382.854.854v1.708a.854.854 0 0 1-.854.854H12.81v7.688a.854.854 0 0 1-.854.854h-1.708a.854.854 0 0 1-.854-.854v-7.688H1.706a.854.854 0 0 1-.854-.854V9.396c0-.472.382-.854.854-.854h7.688V.854c0-.472.382-.854.854-.854h1.708c.472 0 .854.382.854.854v7.688h7.688z"/>
          </svg>
        </b-button>
        <b-tabs class="maintenance" content-class="p-5" lazy active-nav-item-class="active-tab" nav-class="nav-class">
          <b-tab id="active" active @click="activeTabIndex = 0">
              <template v-slot:title>
                <div class="tab-text">Active</div>
              </template>
            <div v-for="(user, index) in getActiveUsers" :key="index" class="bar" @click="openUser(user)">
              <div class="label-grid">
                <div class="icon">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <defs>
                      <rect id="a" width="60" height="60" rx="4"/>
                    </defs>
                    <g fill="none" fill-rule="evenodd">
                      <mask id="b" fill="#fff">
                        <use xlink:href="#a"/>
                      </mask>
                      <use fill="#F9F9F9" xlink:href="#a"/>
                      <path fill="#09223F" d="M203.34 94.53c1.721 3.413 3.788 7.665 5.66 11.47L208.99.983c0-.156-.143-.48-.362-.685-.322-.306-.745-.296-1.078-.296h-46.893c-.498 0-.8-.043-1.15.263a1.17 1.17 0 0 0-.408.718s-.187.625-.047 1.046c.137.423 44.287 92.5 44.287 92.5zM72.6 0H17l56.66 120.483c.366.555.659.844 1.232 1.157.775.429 1.515.352 2.628.352l51.473.004s.948.053 1.313-.24c.213-.176.694-.644.694-.644L72.6 0zm14.403 1.734c.155-.3.306-.581.614-.85C88.402.19 90.132 0 90.132 0h51.04c.478 0 .773.018 1.175.264.337.204.508.385.701.733l11.485 23.797L201 119.82c-.035.45-.074.7-.074.7-.075.488-.107.735-.409 1.052-.346.357-.672.428-1.193.428h-54.988S87.374 3.165 87.283 2.812c-.335-.796-.28-1.078-.28-1.078z" mask="url(#b)" opacity=".1"/>
                      <path fill="#6C7C93" fill-rule="nonzero" d="M30 29.5a7 7 0 0 0 7-7 7 7 0 0 0-7-7 7 7 0 0 0-7 7 7 7 0 0 0 7 7zm4.9 1.75a7.352 7.352 0 0 1 7.35 7.35v2.275a2.626 2.626 0 0 1-2.625 2.625h-19.25a2.626 2.626 0 0 1-2.625-2.625V38.6a7.352 7.352 0 0 1 7.35-7.35h.913a9.55 9.55 0 0 0 3.987.875 9.53 9.53 0 0 0 3.987-.875h.913z" mask="url(#b)"/>
                    </g>
                  </svg>
                </div>
                <div class="name">{{ user.firstName }} {{user.lastName}}</div>
                <div class="sub-label">{{ user.username }}</div>
              </div>
            </div>
          </b-tab>
          <b-tab id="deactivated" @click="activeTabIndex = 1">
              <template v-slot:title>
                <div class="tab-text">Deactivated</div>
              </template>
            <div v-for="(user, index) in getInactiveUsers" :key="index" class="bar" @click="openUser(user)">
              <div class="label-grid">
                <div class="icon">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <defs>
                      <rect id="a" width="60" height="60" rx="4"/>
                    </defs>
                    <g fill="none" fill-rule="evenodd">
                      <mask id="b" fill="#fff">
                        <use xlink:href="#a"/>
                      </mask>
                      <use fill="#F9F9F9" xlink:href="#a"/>
                      <path fill="#09223F" d="M203.34 94.53c1.721 3.413 3.788 7.665 5.66 11.47L208.99.983c0-.156-.143-.48-.362-.685-.322-.306-.745-.296-1.078-.296h-46.893c-.498 0-.8-.043-1.15.263a1.17 1.17 0 0 0-.408.718s-.187.625-.047 1.046c.137.423 44.287 92.5 44.287 92.5zM72.6 0H17l56.66 120.483c.366.555.659.844 1.232 1.157.775.429 1.515.352 2.628.352l51.473.004s.948.053 1.313-.24c.213-.176.694-.644.694-.644L72.6 0zm14.403 1.734c.155-.3.306-.581.614-.85C88.402.19 90.132 0 90.132 0h51.04c.478 0 .773.018 1.175.264.337.204.508.385.701.733l11.485 23.797L201 119.82c-.035.45-.074.7-.074.7-.075.488-.107.735-.409 1.052-.346.357-.672.428-1.193.428h-54.988S87.374 3.165 87.283 2.812c-.335-.796-.28-1.078-.28-1.078z" mask="url(#b)" opacity=".1"/>
                      <path fill="#6C7C93" fill-rule="nonzero" d="M30 29.5a7 7 0 0 0 7-7 7 7 0 0 0-7-7 7 7 0 0 0-7 7 7 7 0 0 0 7 7zm4.9 1.75a7.352 7.352 0 0 1 7.35 7.35v2.275a2.626 2.626 0 0 1-2.625 2.625h-19.25a2.626 2.626 0 0 1-2.625-2.625V38.6a7.352 7.352 0 0 1 7.35-7.35h.913a9.55 9.55 0 0 0 3.987.875 9.53 9.53 0 0 0 3.987-.875h.913z" mask="url(#b)"/>
                    </g>
                  </svg>
                </div>
                <div class="name">{{ user.firstName }} {{user.lastName}}</div>
                <div class="sub-label">{{ user.username }}</div>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </base-layout>  

    <modal-user id="modal-new-user" :on-save="createNewUser" :user="blankUser">
      <template v-slot:title>
        Add New User
      </template>
    </modal-user>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseLayout from './BaseLayout.vue'
import HeaderBase from '../components/HeaderBase.vue'
import ModalUser from '../components/ModalUser.vue'

export default {
  name: 'Users',
  components: {
    BaseLayout,
    HeaderBase,
    ModalUser
  },
  data(){
    return {
      blankUser:{
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'topicMap',
      'getUsers',
      'getActiveUsers',
      'getInactiveUsers'
    ]),
    getUnitNameAndLoc(){
      let n = this.topicMap('company/system/unit_name/report', 'text')
      let l = this.topicMap('company/system/unit_location/report', 'text')
      return n + ' ' + l
    }
  },
  mounted(){
    this.publishGet('user/userlist/get/request')
    this.publishGet('company/system/unit_name/request')
    this.publishGet('company/system/unit_location/request')
  },
  methods: {
    ...mapActions([
      'publishSet',
      'publishGet',
      'createUser'
    ]),
    addNewUser(){
      this.$bvModal.show('modal-new-user')
    },
    async createNewUser(user){
      user.activated = 1
      let response = await this.createUser({userInfo: user})
      this.publishGet('user/userlist/get/request')
      if (response.status === 'PASS'){
        this.$router.push({ name: 'pin', query: { workflow: 'new', user: response.userInfo.userId }})
      }
    },
    openUser({ userId }){
      this.$router.push({ name: 'user', query: { id: userId }})
    }
  }
}
</script>

<style scoped lang="scss">
  .users-list {
    position: relative;
  }
  .new-user {
    position: absolute;
    right: 51px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 214px;
    height: 54px;
    background-color: $gray;
    color: $white;
    font-size: 26px;
    border: 0;
    top: 16px;
  }
  .new-user > span:first-child {
    margin-top: 6px;
    padding-right: 25px;
    line-height: 26px;
  }
  h3 {
    color: $deep-blue;
    font-size: 32px;
    font-family: "HelveticaNeueLTStd-Md";
    margin-bottom: 20px;
  }
  .name {
    font-size: 24px;
    padding-top: 12px;
    font-family: "HelveticaNeueLTStd-Md";
  }
  .bar {
    background-color: $deep-blue-faint;
    height: 106px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 25px;
    padding-right: 25px;
  }
  .bar:not(:last-child) {
    margin-bottom: 15px;
  }
  .label-grid {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 30px 30px;
    grid-column-gap: 15px;
    align-items: center;
    grid-row-gap: 5px;
  }
  .icon {
    grid-area: 1 / 1 / span 2 /span 1; 
  }
  .sub-label {
    color: $grey;
  }
</style>
