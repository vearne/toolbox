<template>
  <div class="heading-config">
    <el-row :gutter="20">
      <el-col :span="8">
        <label>字体大小</label>
        <el-input-number v-model="localConfig.fontSize" :min="16" :max="48" size="small" @change="updateConfig"></el-input-number>
        <span style="margin-left: 8px;">px</span>
      </el-col>
      <el-col :span="8">
        <label>文字颜色</label>
        <el-color-picker v-model="localConfig.color" size="small" @change="updateConfig"></el-color-picker>
      </el-col>
      <el-col :span="8">
        <label>字体粗细</label>
        <el-select v-model="localConfig.fontWeight" size="small" @change="updateConfig">
          <el-option label="粗体" value="bold"></el-option>
          <el-option label="正常" value="normal"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px;">
      <el-col :span="12">
        <label>上边距</label>
        <el-input-number v-model="localConfig.marginTop" :min="0" :max="50" size="small" @change="updateConfig"></el-input-number>
        <span style="margin-left: 8px;">px</span>
      </el-col>
      <el-col :span="12">
        <label>下边距</label>
        <el-input-number v-model="localConfig.marginBottom" :min="0" :max="50" size="small" @change="updateConfig"></el-input-number>
        <span style="margin-left: 8px;">px</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HeadingConfig',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localConfig: {}
    };
  },
  watch: {
    config: {
      handler(newVal) {
        if (newVal) {
          this.localConfig = { ...newVal };
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    updateConfig() {
      this.$emit('update:config', this.localConfig);
    }
  }
};
</script>

<style scoped>
.heading-config label {
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  color: #606266;
}
</style>
