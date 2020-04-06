<template>
  <b-modal :id="id" content-class="user-mgmt" @ok="handleOk"
    centered 
    no-close-on-esc 
    no-close-on-backdrop>
    <template v-slot:modal-title>
      <slot name="title"></slot>
    </template>
    <div class="pt-4">
      <b-form-group
        label="First Name">
        <b-form-input
        :state="firstNameValidation"
          v-model="user.firstName">
        </b-form-input>
        <b-form-invalid-feedback :state="firstNameValidation">
          Name must be longer than 1 character
      </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        label="Last Name">
        <b-form-input
        :state="lastNameValidation"
          v-model="user.lastName">
        </b-form-input>
        <b-form-invalid-feedback :state="firstNameValidation">
          Name must be longer than 1 character
      </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        label="Username">
        <b-form-input
        :state="usernameValidation"
          v-model="user.username">
        </b-form-input>
        <b-form-invalid-feedback :state="usernameValidation">
          Username must be longer than 1 character
      </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        label="Phone Number">
        <b-form-input
        ref="phoneField"
        placeholder="( ) -"
        :state="phoneNumberValidation"
        :formatter="phoneFormatter"
          v-model="user.phoneNumber">
        </b-form-input>
        <b-form-invalid-feedback :state="phoneNumberValidation">
          Phone number must be valid
      </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        style="position: relative"
        label="Role">
        <svg class="role-info" width="24" height="24" viewBox="0 0 24 24">
          <path fill="#09223F" d="M12 0C5.373 0 0 5.375 0 12c0 6.629 5.373 12 12 12s12-5.371 12-12c0-6.625-5.373-12-12-12zm0 5.323a2.032 2.032 0 1 1 0 4.064 2.032 2.032 0 0 1 0-4.064zm2.71 12.29c0 .32-.26.58-.581.58H9.871a.58.58 0 0 1-.58-.58v-1.161c0-.321.26-.581.58-.581h.58v-3.097h-.58a.58.58 0 0 1-.58-.58v-1.162c0-.32.26-.58.58-.58h3.097c.32 0 .58.26.58.58v4.839h.581c.32 0 .58.26.58.58v1.162z"/>
        </svg>
        <b-form-select v-model="user.role" class="time-zone">
          <option v-for='(role, index) in getUserRoles' :key='index' :value="role.protoName">{{role.name}}</option>
        </b-form-select>
      </b-form-group>
    </div>
    <template v-slot:modal-footer="{ ok, cancel }">
      <slot name="left-btn" v-bind:cancel="cancel">
        <b-button size="md" class="cancel" @click="cancel()">
          Cancel
        </b-button>
      </slot>
      <slot name="rgt-btn" v-bind:ok="ok">
        <b-button size="md" :disabled="!valid" class="save" @click="ok()">
          Continue
        </b-button>
      </slot>
    </template>
  </b-modal>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
  name: 'ModalUser',
  props: ['id', 'onSave', 'user'],
  data(){
    return {
    };
  },
  computed:{
    ...mapGetters([
      'getUserRoles',
    ]),
    firstNameValidation(){
      return this.user && this.user.firstName && this.user.firstName.length > 1 ? true : false
    },
    lastNameValidation(){
      return this.user && this.user.lastName && this.user.lastName.length > 1 ? true : false
    },
    usernameValidation(){
      return this.user && this.user.username && this.user.username.length > 1 ? true : false
    },
    phoneNumberValidation(){
      return this.user && this.user.phoneNumber && this.user.phoneNumber.match(/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/) ? true: false
    },
    valid(){
      return this.firstNameValidation && this.lastNameValidation && this.user.username && this.phoneNumberValidation;
    }
  },
  methods: {
    handleOk(){
      this.onSave(this.user)
    },
    phoneFormatter(value){
      value = value.replace(/\D/g,'');
      let outputString = "(abc) def-ghij";
      let replace = "abcdefghij";
      let cursorIndex = 0;
      for (let i=0; i< replace.length; i++) {
        if (value[i]){
          cursorIndex = outputString.indexOf(replace[i])
          outputString = outputString.replace(replace[i], value[i])
        }
        else{
          outputString = outputString.replace(replace[i], ' ')
        }
      }
      setTimeout(()=>{
        this.$refs.phoneField.selectionStart=cursorIndex+1;
        this.$refs.phoneField.selectionEnd=cursorIndex+1;
      },50)
      return outputString;
      
    }
  }
};
</script>

<style lang="scss">
  .user-mgmt {
    padding-left: 10px;
    padding-right: 10px;
  }
  .user-mgmt .modal-footer {
    background-color: $paper;
    height: 138.5px;
    border-top: 1px solid $haze;
    flex-direction: row;
  }
  .user-mgmt .modal-title {
    text-transform: unset;
    font-size: 24px;
    color: $deep-blue;
  }
  .user-mgmt legend.col-form-label,
  .user-mgmt label.d-block {
    font-size: 20px;
  }
  .user-mgmt .modal-body .form-group {
    margin-bottom: 25px;
  }
</style>

<style scoped lang="scss">
  .role-info {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
