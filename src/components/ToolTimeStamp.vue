<template>
    <BConversion
        left-label1="待转换的日期(东八区)"
        left-label2="格式形如 '2016-01-01 12:35:10'"
        right-label1="待转换的秒"
        right-label2="1970年1月1日午夜到指定日期的秒数"
        left-button="日期转换为秒"
        right-button="秒转换为日期"
        left-param="date"
        right-param="sec"
        request-url="/timestamp"
    ></BConversion>
</template>

<script>
import BConversion from './BConversion';
export default {
  name: 'TimeStamp',
  components:{
    BConversion,
  }
}
</script>

