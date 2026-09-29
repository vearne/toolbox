<template>
  <BConversion
    left-label1="原始文本"
    left-label2="比如 'hello world'"
    right-label1="URL编码后的文本"
    right-label2="hello%20world"
    left-button="encode"
    right-button="decode"
    :forward-fn="encodeUrl"
    :reverse-fn="decodeUrl"
  ></BConversion>
</template>

<script>
import BConversion from './BConversion';
import { encodeUrl, decodeUrl } from '@/utils/urlEncode';

export default {
  name: 'UrlEncode',
  components: {
    BConversion
  },
  methods: {
    encodeUrl,
    decodeUrl
  }
}
</script>
