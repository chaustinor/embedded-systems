<template>
  <div class="alert" :class="cssClass">
    <div>
      <svg width="43" height="43" viewBox="0 0 48 43">
        <slot name="svgs"></slot>
      </svg>
    </div>
    <div class="title">
      <slot name="title">{{ getTitle }}</slot>
    </div>
    <slot name="msg"></slot>
    <div>
      <slot name="action-btn"></slot>
      <b-dropdown id="alert-dropdown" right no-caret :toggle-class="['alert-dropdown', this.cssClass]">
        <template v-slot:button-content>
          <span v-show="actionLabel" class="actions-txt">{{ actionLabel }}</span>
          <svg width="16" height="26" viewBox="0 0 16 26">
            <path d="M15.484 17.475c.688.633.688 1.66 0 2.293L9.253 25.51l-.009.007c-.043.04-.09.08-.138.116-.018.014-.038.026-.057.04l-.081.055-.074.04c-.024.014-.048.028-.074.04l-.038.018-.039.017-.078.034c-.026.01-.051.017-.077.025l-.086.029-.077.018-.09.02c-.03.005-.06.009-.092.012-.026.004-.051.009-.078.011-.116.01-.232.01-.347 0l-.077-.01-.094-.013a1.26 1.26 0 0 1-.085-.02 1.15 1.15 0 0 1-.082-.019l-.082-.026c-.027-.01-.054-.017-.08-.027-.026-.01-.05-.022-.075-.033l-.082-.035-.069-.038c-.026-.015-.053-.028-.078-.044l-.074-.05c-.021-.015-.043-.028-.064-.045a1.916 1.916 0 0 1-.125-.103l-.004-.004-6.232-5.74A1.556 1.556 0 0 1 0 18.636c0-.415.171-.83.515-1.146a1.867 1.867 0 0 1 2.49 0L8 22.004l4.995-4.53c.688-.632 1.802-.632 2.49 0zM8.182.008l.077.01.094.014.085.02c.028.006.055.012.082.02.028.008.055.018.082.027l.08.028c.026.01.05.022.075.033.027.012.055.024.082.038.023.011.046.025.069.039.026.014.053.028.078.045l.074.05c.021.017.043.03.064.047.043.034.085.07.125.107l.004.004 6.232 5.923c.343.327.515.755.515 1.183 0 .428-.171.856-.515 1.183a1.825 1.825 0 0 1-2.49 0L8 4.123 3.005 8.795a1.826 1.826 0 0 1-2.49 0 1.615 1.615 0 0 1 0-2.366L6.748.506l.009-.007c.043-.042.09-.083.138-.12.018-.015.038-.028.057-.042.027-.018.053-.038.081-.056L7.068.26l.038-.021C7.13.225 7.154.21 7.18.198c.025-.014.05-.024.077-.036.026-.012.051-.024.078-.035.026-.01.051-.018.077-.026l.086-.03.077-.018c.03-.007.06-.015.09-.02.03-.006.06-.01.092-.014l.078-.011c.116-.01.232-.01.347 0z"/>
          </svg>
        </template>
        <template v-for="(item, index) in fields">
          <b-dropdown-item @click="openModal(item)" :class="item.modal" :key="index" >{{item.text}}</b-dropdown-item>
          <div v-if="index != fields.length - 1" class="dropdown-divider" :key="`${index}-div`"></div>
        </template>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="openHelpCenter">Help Center</b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AlertsBase',
  props: { fields: Array, cssClass: String, openModal: Function, status: Object },
  components: {
  },
  computed: {
    actionLabel(){
      return this.status.state === 'O_S_IDLE' ? 'Actions' : ''
    },
    getTitle(){
      if (this.status.title){
        return this.status.title
      }
      return "No Alerts"
    }
  },
  methods: {
    openHelpCenter(){
      
    }
  }
};
</script>

<style scoped lang="scss">
  .alert {
    background-color: $deep-blue-faint;
    display: grid;
    grid-row-gap: 20px;
    align-items: center;
    width: calc(50vw - 128px);
    padding-top: 35px;
    padding-bottom: 20px;
    margin-bottom: 0;
    border-radius: 0;
  }
  .alert > div {
    display: flex;
    justify-content: center;
  }
  .alert > .title  {
    text-transform: uppercase;
    font-family: "HelveticaNeueLTStd-Md";
    font-size: 26px;
    font-weight: bold;
    line-height: normal;
  }
  .alert > .msg {
    text-align: center;
    padding-left: 3rem;
    padding-right: 3rem;
    font-size: 20px;
    opacity: .5;
  }
  .action-box {
    font-family: "HelveticaNeueLTStd-Md";
    font-size: 28px;
    color: $deep-blue;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 85%;
    height: 74px;
    background-color: $white; 
    margin-right: 4px;
  }
  .actions-txt {
    margin-right: 10px;
  }
</style>

<style lang="scss">
  .alert-dropdown {
    background-color: $sky-blue !important;
    border:0;
    border-radius: 0;
    height: 74px;
    font-size: 28px;
    width: calc(50vw - 168px);
    font-family: "HelveticaNeueLTStd-Md";
  }
  .alert .dropdown-menu {
    width: 100%;
  }
  .alert-dropdown path {
    fill: $white;
  }
</style>
