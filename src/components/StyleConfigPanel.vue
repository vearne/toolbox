<template>
  <div class="style-config-panel">
    <el-form ref="form" :model="form" label-width="120px">
      <!-- 样式名称 -->
      <el-form-item label="样式名称" required>
        <el-input v-model="form.styleName" placeholder="请输入样式名称"></el-input>
      </el-form-item>

      <!-- 全局设置 -->
      <el-divider content-position="left">全局设置</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="背景颜色">
            <el-color-picker v-model="form.global.backgroundColor"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文字颜色">
            <el-color-picker v-model="form.global.textColor"></el-color-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="字体大小">
            <el-input-number v-model="form.global.fontSize" :min="12" :max="32"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行高">
            <el-input-number v-model="form.global.lineHeight" :min="1" :max="3" :step="0.1"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内边距">
            <el-input-number v-model="form.global.padding" :min="0" :max="100"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 标题样式 -->
      <el-divider content-position="left">标题样式</el-divider>
      <el-tabs type="border-card">
        <el-tab-pane label="H1">
          <heading-config :config.sync="form.headings.h1"></heading-config>
        </el-tab-pane>
        <el-tab-pane label="H2">
          <heading-config :config.sync="form.headings.h2"></heading-config>
        </el-tab-pane>
        <el-tab-pane label="H3">
          <heading-config :config.sync="form.headings.h3"></heading-config>
        </el-tab-pane>
        <el-tab-pane label="H4">
          <heading-config :config.sync="form.headings.h4"></heading-config>
        </el-tab-pane>
        <el-tab-pane label="H5">
          <heading-config :config.sync="form.headings.h5"></heading-config>
        </el-tab-pane>
        <el-tab-pane label="H6">
          <heading-config :config.sync="form.headings.h6"></heading-config>
        </el-tab-pane>
      </el-tabs>

      <!-- 正文样式 -->
      <el-divider content-position="left">正文样式</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="字体大小">
            <el-input-number v-model="form.paragraph.fontSize" :min="12" :max="32"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文字颜色">
            <el-color-picker v-model="form.paragraph.color"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="段落间距">
            <el-input-number v-model="form.paragraph.marginBottom" :min="0" :max="50"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="行高">
            <el-input-number v-model="form.paragraph.lineHeight" :min="1" :max="3" :step="0.1"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="首行缩进">
            <el-switch v-model="form.paragraph.textIndent"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 引用样式 -->
      <el-divider content-position="left">引用样式</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="背景颜色">
            <el-color-picker v-model="form.blockquote.backgroundColor"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="边框颜色">
            <el-color-picker v-model="form.blockquote.borderColor"></el-color-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="字体大小">
            <el-input-number v-model="form.blockquote.fontSize" :min="12" :max="32"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文字颜色">
            <el-color-picker v-model="form.blockquote.color"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="圆角">
            <el-input-number v-model="form.blockquote.borderRadius" :min="0" :max="20"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="内边距">
            <el-input v-model="form.blockquote.padding" placeholder="例如: 12px 16px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="边框样式">
            <el-input v-model="form.blockquote.borderWidth" placeholder="例如: 0 0 0 4px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="边框类型">
            <el-select v-model="form.blockquote.borderStyle">
              <el-option label="实线" value="solid"></el-option>
              <el-option label="虚线" value="dashed"></el-option>
              <el-option label="点线" value="dotted"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 代码块样式 -->
      <el-divider content-position="left">代码块样式</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="背景颜色">
            <el-color-picker v-model="form.codeBlock.backgroundColor"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文字颜色">
            <el-color-picker v-model="form.codeBlock.color"></el-color-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="字体大小">
            <el-input-number v-model="form.codeBlock.fontSize" :min="10" :max="24"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="圆角">
            <el-input-number v-model="form.codeBlock.borderRadius" :min="0" :max="20"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行高">
            <el-input-number v-model="form.codeBlock.lineHeight" :min="1" :max="3" :step="0.1"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="内边距">
            <el-input v-model="form.codeBlock.padding" placeholder="例如: 16px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="边框">
            <el-input v-model="form.codeBlock.border" placeholder="例如: none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 行内代码样式 -->
      <el-divider content-position="left">行内代码样式</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="背景颜色">
            <el-color-picker v-model="form.inlineCode.backgroundColor"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文字颜色">
            <el-color-picker v-model="form.inlineCode.color"></el-color-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="字体大小">
            <el-input-number v-model="form.inlineCode.fontSize" :min="10" :max="24"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="圆角">
            <el-input-number v-model="form.inlineCode.borderRadius" :min="0" :max="10"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内边距">
            <el-input v-model="form.inlineCode.padding" placeholder="例如: 2px 6px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 列表样式 -->
      <el-divider content-position="left">列表样式</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="列表项间距">
            <el-input-number v-model="form.list.itemMarginBottom" :min="0" :max="30"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="左侧内边距">
            <el-input-number v-model="form.list.itemPaddingLeft" :min="0" :max="50"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标记颜色">
            <el-color-picker v-model="form.list.bulletColor"></el-color-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 表格样式 -->
      <el-divider content-position="left">表格样式</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="表格边框">
            <el-input v-model="form.table.border" placeholder="例如: 1px solid #ebeef5"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="内边距">
            <el-input v-model="form.tableCell.padding" placeholder="例如: 12px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="表头背景">
            <el-color-picker v-model="form.tableHeader.backgroundColor"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表头文字">
            <el-color-picker v-model="form.tableHeader.color"></el-color-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="单元格文字">
            <el-color-picker v-model="form.tableCell.color"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表头下边框">
            <el-input v-model="form.tableHeader.borderBottom" placeholder="例如: 2px solid #ebeef5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 链接样式 -->
      <el-divider content-position="left">链接样式</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="链接颜色">
            <el-color-picker v-model="form.link.color"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下划线">
            <el-input v-model="form.link.borderBottom" placeholder="例如: 1px solid #409eff"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文本装饰">
            <el-select v-model="form.link.textDecoration">
              <el-option label="无" value="none"></el-option>
              <el-option label="下划线" value="underline"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 图片样式 -->
      <el-divider content-position="left">图片样式</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="最大宽度">
            <el-select v-model="form.image.maxWidth">
              <el-option label="100%" value="100%"></el-option>
              <el-option label="80%" value="80%"></el-option>
              <el-option label="60%" value="60%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="圆角">
            <el-input-number v-model="form.image.borderRadius" :min="0" :max="20"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下边距">
            <el-input-number v-model="form.image.marginBottom" :min="0" :max="50"></el-input-number> <span style="margin-left: 8px;">px</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="action-buttons">
      <el-button type="primary" @click="handleSave">保存样式</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import HeadingConfig from './HeadingConfig.vue';

export default {
  name: 'StyleConfigPanel',
  components: {
    HeadingConfig
  },
  props: {
    styleConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {}
    };
  },
  watch: {
    styleConfig: {
      handler(newVal) {
        if (newVal) {
          this.form = JSON.parse(JSON.stringify(newVal));
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleSave() {
      if (!this.form.styleName || this.form.styleName.trim() === '') {
        this.$message.warning('请输入样式名称');
        return;
      }
      this.$emit('save', this.form);
    },
    handleCancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped>
.style-config-panel {
  padding: 20px;
}

.el-divider {
  margin: 30px 0 20px 0;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.action-buttons .el-button {
  min-width: 120px;
}
</style>
