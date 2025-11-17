<template>
    <BConversion
        left-label1="原始文本"
        left-label2="比如 'hello world'"
        right-label1="base64编码后的文本"
        right-label2="aGVsbG8gd29ybGQ="
        left-button="encode"
        right-button="decode"
        left-param="originalString"
        right-param="encodedString"
        request-url="/base64"
    ></BConversion>
</template>

<script>
import BConversion from './BConversion';
export default {
  name: 'Base64',
  components:{
    BConversion,
  }
}
</script>

