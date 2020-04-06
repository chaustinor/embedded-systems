<template>
  <div>
    <base-layout>
      <template v-slot:header>
        <header-base>
          <div class="primary">Users</div>
          <div class="secondary">{{ getUnitNameAndLoc }}</div>
        </header-base>
      </template>
      <div class="mt-5">
        <b-dropdown
          right
          no-caret
          class="user-dropdown"
          toggle-class="user-dropdown-btn"
          menu-class="menu-class"
        >
          <template v-slot:button-content>
            <span class="actions">Actions</span>
            <svg width="16" height="26" viewBox="0 0 16 26">
              <path
                d="M15.484 17.475c.688.633.688 1.66 0 2.293L9.253 25.51l-.009.007c-.043.04-.09.08-.138.116-.018.014-.038.026-.057.04l-.081.055-.074.04c-.024.014-.048.028-.074.04l-.038.018-.039.017-.078.034c-.026.01-.051.017-.077.025l-.086.029-.077.018-.09.02c-.03.005-.06.009-.092.012-.026.004-.051.009-.078.011-.116.01-.232.01-.347 0l-.077-.01-.094-.013a1.26 1.26 0 0 1-.085-.02 1.15 1.15 0 0 1-.082-.019l-.082-.026c-.027-.01-.054-.017-.08-.027-.026-.01-.05-.022-.075-.033l-.082-.035-.069-.038c-.026-.015-.053-.028-.078-.044l-.074-.05c-.021-.015-.043-.028-.064-.045a1.916 1.916 0 0 1-.125-.103l-.004-.004-6.232-5.74A1.556 1.556 0 0 1 0 18.636c0-.415.171-.83.515-1.146a1.867 1.867 0 0 1 2.49 0L8 22.004l4.995-4.53c.688-.632 1.802-.632 2.49 0zM8.182.008l.077.01.094.014.085.02c.028.006.055.012.082.02.028.008.055.018.082.027l.08.028c.026.01.05.022.075.033.027.012.055.024.082.038.023.011.046.025.069.039.026.014.053.028.078.045l.074.05c.021.017.043.03.064.047.043.034.085.07.125.107l.004.004 6.232 5.923c.343.327.515.755.515 1.183 0 .428-.171.856-.515 1.183a1.825 1.825 0 0 1-2.49 0L8 4.123 3.005 8.795a1.826 1.826 0 0 1-2.49 0 1.615 1.615 0 0 1 0-2.366L6.748.506l.009-.007c.043-.042.09-.083.138-.12.018-.015.038-.028.057-.042.027-.018.053-.038.081-.056L7.068.26l.038-.021C7.13.225 7.154.21 7.18.198c.025-.014.05-.024.077-.036.026-.012.051-.024.078-.035.026-.01.051-.018.077-.026l.086-.03.077-.018c.03-.007.06-.015.09-.02.03-.006.06-.01.092-.014l.078-.011c.116-.01.232-.01.347 0z"
              />
            </svg>
          </template>
          <template>
            <b-dropdown-item @click="editAcctDetails">Edit Account Details</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="changePin">Change Pin</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item
              v-show="user.activated"
              class="deactivate-user"
              @click="deactivateUser"
            >Deactivate User</b-dropdown-item>
            <b-dropdown-item
              v-show="!user.activated"
              class="activate-user"
              @click="activateUser"
            >Activate User</b-dropdown-item>
          </template>
        </b-dropdown>
        <b-tabs
          class="maintenance"
          content-class="p-5"
          lazy
          active-nav-item-class="active-tab"
          nav-class="nav-class"
        >
          <b-tab id="active" active @click="activeTabIndex = 0">
            <template v-slot:title>
              <div class="tab-text">User Profile</div>
            </template>
            <div
              v-show="!user.activated"
              class="deactivation-notice"
            >DEACTIVATED ON {{ formatDate(user.activationChangeDate*1000,'L') }}</div>
            <div class="pt-5">
              <h3>Account Details</h3>
              <div class="panel">
                <div class="label-grid">
                  <div class="muted">Full Name</div>
                  <div>{{ user.firstName }} {{ user.lastName }}</div>
                </div>
                <div class="label-grid">
                  <div class="muted">Username</div>
                  <div>{{ user.username }}</div>
                </div>
                <div class="label-grid">
                  <div class="muted">Phone Number</div>
                  <div>{{ user.phoneNumber }}</div>
                </div>
              </div>
            </div>
            <div class="pt-5">
              <h3>Roles &#38; Permissions</h3>
              <div class="panel roles">
                <div class="label-grid" @click="expandPermissions=!expandPermissions">
                  <div class="muted">Role</div>
                  <div>{{userRole.name}}</div>
                </div>
              </div>
              <div v-show="expandPermissions" class="permission-area">
                <div
                  class="panel roles"
                  v-for="(permissions, name) in userRole.permissions"
                  :key="name"
                >
                  <div class="label-grid">
                    <div>{{name}}</div>
                    <div class="muted">
                      <ul>
                        <li
                          v-for="(permissionDetail, index) in permissions"
                          :key="index"
                        >{{ permissionDetail }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </base-layout>

    <modal-user id="modal-edit-user" :on-save="editUser" :user="user">
      <template v-slot:title>Edit Account Details</template>
      <template v-slot:left-btn="{ cancel }">
        <b-button size="md" class="cancel" @click="cancel()">Discard Changes</b-button>
      </template>
      <template v-slot:rgt-btn="{ ok }">
        <b-button size="md" class="save" @click="ok()">Save Changes</b-button>
      </template>
    </modal-user>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BaseLayout from "./BaseLayout.vue";
import HeaderBase from "../components/HeaderBase.vue";
import ModalUser from "../components/ModalUser.vue";
import moment from "moment";

export default {
  name: "User",
  components: {
    BaseLayout,
    HeaderBase,
    ModalUser
  },
  data() {
    return {
      deactivationDate: new Date(),
      emailNotifications: true,
      smsNotifications: false,
      showDeactivationNotice: false,
      expandPermissions: false
    };
  },
  computed: {
    ...mapGetters(["topicMap", "getUser", "getUserRoles"]),
    getUnitNameAndLoc() {
      let n = this.topicMap("company/system/unit_name/report", "text");
      let l = this.topicMap("company/system/unit_location/report", "text");
      return n + " " + l;
    },
    user() {
      return this.getUser(this.$router.currentRoute.query.id);
    },
    userRole() {
      let role = this.getUserRoles.filter(
        elem => elem.protoName === this.user.role
      );
      if (role) {
        return role[0];
      }
      return "";
    }
  },
  mounted() {
    this.publishGet("user/userlist/get/request");
    this.publishGet("company/system/unit_name/request");
    this.publishGet("company/system/unit_location/request");
  },
  methods: {
    ...mapActions(["publishSet", "publishGet"]),
    editAcctDetails() {
      this.$bvModal.show("modal-edit-user");
    },
    editUser(user) {
      this.publishSet({
        topic: "user/set/request",
        value: user,
        type: "userInfo"
      });
      this.publishGet("user/userlist/get/request");
    },
    formatDate(date, frmt) {
      return date ? moment(Number(date)).format(frmt) : "";
    },
    changePin() {
      this.$router.push({
        name: "pin",
        query: { workflow: "change", user: this.user.userId }
      });
    },
    deactivateUser() {
      let user = this.user;
      user.activated = 0;
      this.publishSet({
        topic: "user/set/request",
        value: user,
        type: "userInfo"
      });
      this.publishGet("user/userlist/get/request");
    },
    activateUser() {
      let user = this.user;
      user.activated = 1;
      this.publishSet({
        topic: "user/set/request",
        value: user,
        type: "userInfo"
      });
      this.publishGet("user/userlist/get/request");
    }
  }
};
</script>

<style lang="scss">
.user-dropdown-btn {
  width: 174px;
  height: 54px;
  background-color: $deep-blue !important;
  left: 30px;
  font-size: 26px;
  border: 0;
}
.menu-class {
  border-radius: 0;
  margin-top: 0;
  box-shadow: 0 5px 46px 0 rgba(0, 0, 0, 0.25);
  background-color: $white;
}
.menu-class .dropdown-item {
  font-size: 26px;
  color: $deep-blue;
}
.user-dropdown-btn path {
  fill: $white;
}
.user-profile .tab-content {
  height: calc(100vh - 410px);
  overflow-y: auto;
}
.deactivate-user > .dropdown-item {
  color: $red;
}
.activate-user > .dropdown-item {
  color: $green;
}
</style>

<style scoped lang="scss">
.deactivation-notice {
  font-size: 24px;
  height: 80px;
  width: 100%;
  display: flex;
  color: $white;
  align-items: center;
  justify-content: center;
  background-color: $grey;
}
.user-dropdown {
  position: absolute;
  top: 214px;
  right: 78px;
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
  top: 165px;
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
}
.panel {
  background-color: rgba(9, 34, 63, 0.05);
  display: grid;
  grid-row-gap: 25px;
  padding: 25px;
}
.panel.notify {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.label-grid {
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: 3px;
  align-items: center;
}
.label-grid > .muted {
  color: $grey;
}
.label-grid > div:not(.muted) {
  font-size: 24px;
}
.roles:not(:last-child) {
  border-bottom: 2px solid $deep-blue-faint;
}
.actions {
  margin-right: 20px;
}
.permission-area {
  overflow-y: scroll;
  height: 500px;
}
.permission-area::-webkit-scrollbar {
  display: none;
}
</style>
