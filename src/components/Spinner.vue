<template>
  <svg :viewBox="spinnerSize" :width="spinnerWidth">
    <g :stroke="spinnerColor">
      <rect class="spin_1" height="10" width="10" y="10" x="0" :fill="spinnerColor"/>
      <rect class="spin_2" height="10" width="10" y="10" x="20" :fill="spinnerColor"/>
      <rect class="spin_3" height="10" width="10" y="10" x="40" :fill="spinnerColor"/>
    </g>
  </svg>
</template>

<script>

export default {
  name: 'Spinner',
  props: ['spinnerSize', 'spinnerWidth', 'spinnerColor'],
}
</script>

<style scoped lang="scss">
@keyframes spinner{
  0% {
    opacity: 1;
  }
  32% {
    opacity: 1;
  }
  33% {
    opacity: 0.70;
  }
  65% {
    opacity: 0.70;
  }
  66% {
    opacity: 0.30;
  }
  100% {
    opacity: 0.30;
  }
}
.spin_1 {
  opacity: 1;
  animation: spinner 3s 0s linear infinite;
}
.spin_2 {
  opacity: 0.70;
  animation: spinner 3s 1s linear infinite;
}
.spin_3 {
  opacity: 0.30;
  animation: spinner 3s 2s linear infinite;
}
</style>
