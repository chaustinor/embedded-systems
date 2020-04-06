<template>
  <div>
    <span>{{now}}</span>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import moment from 'moment-timezone'

export default {
  name: 'Now',
  props: ['format', 'targetTime', 'timeSince'],
  data() {
    return {
      now: null,
      intervalMs: 250,
      interval: null
    };
  },
  computed: {
    ...mapGetters([
      'topicMap'
    ])
  },
  mounted(){
    setTimeout(()=>{

      this.interval = setInterval(this.updateDateTime, this.intervalMs)
      this.updateDateTime();
      this.publishGet('company/system/timezone/request')
    },0)
  },
  beforeDestroy(){
    clearInterval(this.interval);
  },
  methods: {
    ...mapActions([
       'publishGet'
    ]),
    updateDateTime(){
      if (this.targetTime){
        let now = moment()
        let then = moment(this.targetTime)
        let diff = then.diff(now)
        if (diff >= 0){
          this.now = moment.utc(diff).format(this.format)
        }
        else {
          //this.now = moment.utc(-diff).format("-"+this.format)
          this.now = '. . .'
        }
      }
      else if (this.timeSince){
        let now = moment()
        let then = moment(this.timeSince)
        let diff = now.diff(then)
        if (diff >= 0){
          this.now = moment.utc(diff).format(this.format)
        }
        else {
          //this.now = moment.utc(-diff).format("-"+this.format)
          this.now = '. . .'
        }
      }
      else{
        let current_tz=this.topicMap('company/system/timezone/report', 'text')
        this.now = moment.tz(current_tz).format(this.format)
      }
    }
  },
  watch:{
    targetTime: function(){
      this.updateDateTime()
    }
  }
};
</script>
