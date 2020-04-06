<template>
  <div class="header">
    <img class="header-shadow" src="../../public/assets/header-shadow.png"> 
    <div class="left">
      <slot name="left"> 
        <div class="back" v-on:click="goBack">  
            <svg viewBox="0 0 27 47" width="27" height="47" ><g><g><path fill="#FEFEFE" fill-rule="evenodd" d="M1.412 19.833c.005-.004.007-.01.01-.015L18.648 1.515C19.597.505 20.84 0 22.088 0c1.245 0 2.49.504 3.438 1.515 1.9 2.018 1.9 5.292.002 7.311L11.988 23.5l13.588 14.674c1.898 2.018 1.9 5.293 0 7.311-1.9 2.02-4.983 2.02-6.882 0L1.471 27.181c-.008-.008-.013-.017-.02-.026a4.575 4.575 0 0 1-.35-.403c-.043-.056-.081-.114-.12-.172a4.14 4.14 0 0 1-.164-.235c-.044-.072-.083-.144-.123-.217-.04-.072-.083-.142-.122-.216-.038-.075-.068-.153-.101-.228-.035-.078-.07-.153-.101-.232-.032-.074-.052-.15-.08-.225-.027-.084-.057-.167-.082-.252-.022-.076-.037-.153-.054-.228-.022-.087-.044-.173-.06-.264-.019-.086-.028-.176-.041-.267-.01-.077-.022-.152-.03-.232a5.551 5.551 0 0 1 0-1.02c.008-.075.019-.147.03-.222.013-.092.022-.186.04-.276.015-.087.04-.17.058-.255.018-.079.035-.158.057-.237.024-.081.053-.162.08-.241.026-.08.05-.159.082-.238.03-.073.062-.145.094-.219.036-.079.07-.16.11-.237.033-.07.074-.137.112-.205.043-.077.085-.154.133-.23.046-.075.098-.143.147-.215.046-.065.087-.13.136-.192.098-.125.201-.248.31-.364"/></g></g></svg>
        </div>
      </slot>
    </div>
    <div class="center">
      <slot></slot>
    </div>
    <div class="right">
      <slot name="right"> 
        <div class="date">
          <now format="h:mm A"></now>
          <now format="MM/DD/YY"></now>
        </div>   
      </slot>
    </div>
  </div>
</template>

<script>

import Now from './Now.vue'

export default {
  name: 'HeaderBase',
  components: {
    Now
  },
  methods: {
    goBack(){
      this.$router.go(-1)
    }
  }
};
</script>

<style scoped lang="scss">
  .header {
    display: flex;
    height: 156px;
    color: $off-white;
    font-size: 28px;
  }
  .header > .center .primary {
    font-size: 37px;
  }
  .header > .left,
  .header > .right {
    position: absolute;
    display: flex;
    align-items: center;
  }
  .header > .left {
    left: 61px;
  }
  .header > .left > .back {
    margin-left: -64px;
    padding: 64px;
  }
  .header > .left > *:not(:last-child) {
    margin-right: 15px;
  }
  .header > .right {
    right: 25px;
  }
  .header > .right > *:not(:first-child) {
    margin-left: 15px;
  }
  .header .date {
    align-items: flex-end;
  } 
  .header .sign-in {
    align-items: center;
  }
  .header .center {
    max-width: 350px;
    text-align: center;
  }
  header .left,
  header .center,
  header .right {
    z-index: 1;
  }
  .header .date,
  .sign-in {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 80px;
  }
</style>