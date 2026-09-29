<template>
  <BConversion
    left-label1="大写字符串"
    left-label2="HELLO-WORLD"
    right-label1="小写字符串"
    right-label2="hello-world"
    left-button="大写转小写"
    right-button="小写转大写"
    :forward-fn="toLower"
    :reverse-fn="toUpper"
  ></BConversion>
</template>

<script>
import BConversion from './BConversion';
import { toLower, toUpper } from '@/utils/caseConvert';

export default {
  name: 'UpperLower',
  components: {
    BConversion
  },
  methods: {
    toLower,
    toUpper
  }
}
</script>
