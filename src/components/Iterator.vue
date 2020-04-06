<template>
  <div class="iterator">
    <div class="title">
      {{ title }}
    </div>
    <div>
      <div @click="decrement" class="arrow">
        <font-awesome-icon class="decrement" :class="{disabled :isMinimum}" :icon="'angle-down'" />
      </div>
      <div class="unit-value">
        <span class="value" >{{ displayVal }}<sup v-if="isOrdinal">{{getOrdinal}}</sup></span>
        <span class="units">
          <slot></slot>
        </span>
      </div>
      <div @click="increment" class="arrow">
        <font-awesome-icon class="increment" :class="{disabled :isMaximum}" :icon="'angle-up'" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Iterator',
  props: ['data', 'seed', 'onChange', 'min', 'max', 'isOrdinal', 'index', 'title', 'step'],
  data() {
    return {
      dataSet: [],
      indexVal: 0,
      seedVal: 0,
      minVal: -Infinity,
      maxVal: Infinity,
      displayVal: '',
      precision: 0,
      stepVal: 1
    };
  },
  mounted(){
    this.stepVal = this.validateStep(this.step)
    this.precision = this.calcPrecision(this.stepVal)

    if (this.index){
      this.indexVal = this.index;
    }
    if (this.data){
      this.dataSet = this.data
      this.displayVal = this.dataSet[this.indexVal]
    }
    if (this.seed || this.seed === 0){
      this.displayVal = this.seedVal = this.seed
    }
    if (this.min){
      this.minVal = this.min
    }
    if (this.max){
      this.maxVal = this.max
    }
  },
  methods: {
    decrement() {
      if (this.seedVal || typeof this.seed !== 'undefined') {
        if (this.seedVal > this.minVal){
          this.displayVal = this.seedVal = (parseFloat(this.seedVal) - parseFloat(this.stepVal)).toFixed(this.precision)
        }
      }
      else {
        if (this.indexVal === 0){
          this.indexVal = this.dataSet.length - 1
        }
        else { 
          this.indexVal--
        }
        this.displayVal = this.dataSet[this.indexVal]
      }
      this.onChange(this.displayVal, this.indexVal)
    },
    increment() {
      if (this.seedVal || typeof this.seed !== 'undefined') {
        if (this.seedVal < this.maxVal){
          this.displayVal = this.seedVal = (parseFloat(this.seedVal) + parseFloat(this.stepVal)).toFixed(this.precision)
        }
      }
      else {
        if (this.indexVal === (this.dataSet.length - 1)){
          this.indexVal = 0
        }
        else { 
          this.indexVal++
        }
        this.displayVal = this.dataSet[this.indexVal]
      }
      this.onChange(this.displayVal, this.indexVal)
    },
    calcPrecision(a) {
      var e = 1;
      while (Math.round(a * e) / e !== a) e *= 10;
      return Math.round(Math.log(e) / Math.LN10);
    },
    validateStep(step){
      return ((!isNaN(parseFloat(step)) && !isNaN(step - 0)) && step !== 0) ? parseFloat(step) : 1
    }
  },
  computed: {
    getOrdinal(){
      let ordValue = ''
      if (this.seedVal % 10 == 1 && this.seedVal % 100 != 11){
        ordValue = 'ST'
      }
      else if (this.seedVal % 10 == 2 && this.seedVal % 100 != 12){
        ordValue = 'ND'
      }
      else if (this.seedVal % 10 == 3 && this.seedVal % 100 != 13){
        ordValue = 'RD'
      }
      else {
        ordValue = 'TH'
      }
      return ordValue
    },
    isMinimum(){
      return this.seedVal <= this.minVal;
    },
    isMaximum(){
      return this.seedVal >= this.maxVal;
    },
    isNumber(){
      return typeof this.seed !== 'undefined'
    }
  }
};
</script>

<style scoped lang="scss">  
  .iterator {
    background-color: $deep-blue-faint; 
    height: 126px;
    display: grid;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .iterator > div,
  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .unit-value {
    text-align: center;
    display: contents;
  }
  .arrow {
    height: 100%;
    width: 100%;
  }
  .iterator .title,
  .units {
    opacity: 0.5;
    font-weight: bold;
    text-transform: uppercase;
  }
  .decrement,
  .increment {
    font-size: 30px;
  }
  .disabled {
    opacity: 0.35;
  }
  sup {
    font-size: 0.6em;
  }
  .value {
    font-size: 40px;
    font-weight: bold;
    color: $deep-blue;
  }
  .units {
    margin-left: 5px;
    font-size: 20px;
    padding-top: 14px;
  }
</style>

