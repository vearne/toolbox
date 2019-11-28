<template>
    <div>
      <OneWayConversion
          left-label1="长网址"
          left-label2='形如: "https://github.com/vearne/tinyurl"'
          right-label1="短网址"
          right-label2='形如:"http://st.vearne.cc/2bI"'
          left-button="缩短"
          left-param="url"
          right-param="tinyurl"
          request-url="/tinyurl"
      ></OneWayConversion>
    </div>
</template>

<script>
import OneWayConversion from './OneWayConversion';
export default {
  name: 'Tinyurl',
  components:{
    OneWayConversion,
  }
}
</script>

