<template>
  <BConversion
    left-label1="大写字符串"
    left-label2="HELLO-WORLD"
    right-label1="小写字符串"
    right-label2="hello-world"
    left-button="大写转小写"
    right-button="小写转大写"
    left-param="upperString"
    right-param="lowerString"
    request-url="/upper_lower_case"
  ></BConversion>
</template>

<script>
import BConversion from './BConversion';
export default {
  name: 'UpperLower',
  components:{
    BConversion,
  }
}
</script>

