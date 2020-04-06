<template>
  <div class="tile" :class="state">
    <div class="main">
      <slot></slot>
    </div>
    <div>
      <svg viewBox="0 0 77 47" width="77" height="47" :style="{'transform': arrowTransform}"><g><g><path d="M75.973 26.798c.014-.022.024-.043.039-.062.18-.282.338-.58.467-.893.01-.023.018-.05.027-.073.121-.305.218-.624.283-.954.004-.018.005-.038.01-.057.06-.326.095-.664.095-1.007v-.007c0-.344-.036-.68-.096-1.008-.004-.019-.005-.038-.009-.058a5.468 5.468 0 0 0-.283-.954l-.027-.074a5.602 5.602 0 0 0-.467-.89c-.015-.022-.025-.043-.04-.061a5.394 5.394 0 0 0-.69-.845l-.001-.003L57.043 1.614a5.51 5.51 0 1 0-7.792 7.793l8.831 8.83H5.51A5.51 5.51 0 0 0 0 23.747a5.509 5.509 0 0 0 5.51 5.51h52.572l-8.831 8.832a5.515 5.515 0 0 0 0 7.796 5.502 5.502 0 0 0 3.896 1.61c1.41 0 2.82-.538 3.896-1.61l18.238-18.24.001-.001c.257-.259.488-.543.69-.846"/></g></g></svg>
    </div>
    <div class="set-point">
      <slot name="setPoint"></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Tile',
  props: ['status', 'arrowDir'],
  data() {
    return {
      interval: null,
      state: 'ok',
      arrowTransform: ''
    };
  },
  mounted() {
    this.arrowTransform = this.arrowDir === 'left' ? 'rotate(180deg)' : 'rotate(0deg)'
  },
  watch: {
    status: {
      handler: function() {
        this.state = this.status
        clearInterval(this.interval)
        if (this.status === 'warning' || this.status === 'error') {
          this.interval = setInterval(() => {
            this.state = this.state === 'ok' ? this.status : 'ok'
          }, 1000);
        }
      },
      immediate: true
    }
  },
  beforeDestroy: function() {
    clearInterval(this.interval)
  }
};
</script>

<style scoped lang="scss">
  .tile {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    text-align: center;
    border-width: 10px;
    border-style: solid;
    height: 396px;
    min-width: 395px;
    max-width: 395px;
    margin: 16px;
    background-color: $white;
    border-color: transparent;
    color: $black;
    font-size: 24px;
  }
  .main {
    line-height: 1;
  }
  .current-temp {
    font-size: 120px;
    font-weight: normal;
  }
  .set-point {
    line-height: 1.2
  }
  .set-point-temp {
    font-size: 40px;
    font-weight: normal;
  }
  .temp-title,
  .temp-subtitle {
    font-size: 32px;
  }
  .ok {
    border-color: transparent;
  }
  .warning {
    color: $mustard !important;
    border-color: $mustard;
    fill: $mustard !important;
  }
  .warning .current-temp {
    color: $mustard !important;
  }
  .error {
    color: $red;
    border-color: $red;
    fill: $red !important;
  }
  .error .current-temp {
    color: $red !important;
  }
</style>
