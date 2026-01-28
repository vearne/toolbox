<template>
  <div class="wechat-markdown-container">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <h2>微信公众号 Markdown 转 HTML</h2>
      <div class="toolbar-right">
        <el-select v-model="currentStyleName" placeholder="选择样式" @change="onStyleChange" size="small">
          <el-option-group label="预设样式">
            <el-option
              v-for="style in presetStyles"
              :key="style.styleName"
              :label="style.styleName"
              :value="style.styleName">
            </el-option>
          </el-option-group>
          <el-option-group label="自定义样式" v-if="customStyles.length > 0">
            <el-option
              v-for="style in customStyles"
              :key="style.styleName"
              :label="style.styleName"
              :value="style.styleName">
            </el-option>
          </el-option-group>
        </el-select>
        <el-button size="small" type="primary" @click="openStyleConfig">配置样式</el-button>
        <el-button size="small" @click="exportStyle">导出样式</el-button>
        <el-button size="small" type="info" @click="showHelp = true">使用帮助</el-button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <el-row :gutter="20">
      <!-- 左侧：Markdown 编辑器 -->
      <el-col :span="12">
        <div class="editor-section">
          <div class="section-header">
            <h3>Markdown 编辑器</h3>
            <span class="section-hint">输入 Markdown 内容，支持实时预览</span>
            <span class="word-count">字数: {{ wordCount }}</span>
          </div>
          <el-input
            type="textarea"
            v-model="markdownText"
            :rows="20"
            placeholder="在此输入 Markdown 内容..."
            class="markdown-editor"
            @input="onMarkdownChange">
          </el-input>
          <div class="editor-actions">
            <el-button size="small" @click="clearEditor">清空</el-button>
            <el-button size="small" @click="loadExample">加载示例</el-button>
            <el-button size="small" @click="exportMarkdown">导出 .md</el-button>
          </div>
        </div>
      </el-col>

      <!-- 右侧：HTML 预览 -->
      <el-col :span="12">
        <div class="preview-section">
          <div class="section-header">
            <h3>HTML 预览</h3>
            <span class="section-hint">实时渲染效果</span>
          </div>
          <div class="html-preview" v-html="styledHtml"></div>
          <div class="preview-actions">
            <el-button size="small" type="primary" @click="copyHtml">复制 HTML</el-button>
            <el-button size="small" type="success" @click="copyRichText">复制富文本</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 底部：HTML 源码 -->
    <div class="code-section">
      <div class="section-header">
        <h3>HTML 源码</h3>
        <span class="section-hint">可直接复制到微信公众号编辑器</span>
      </div>
      <el-input
        type="textarea"
        :rows="10"
        v-model="htmlSource"
        readonly
        class="html-code">
      </el-input>
      <div class="code-actions">
        <el-button size="small" type="primary" @click="copyHtmlSource">一键复制</el-button>
      </div>
    </div>

    <!-- 样式配置抽屉 -->
    <el-drawer
      title="样式配置"
      :visible.sync="showStyleConfig"
      direction="rtl"
      size="50%">
      <style-config-panel
        :style-config="currentStyle"
        @save="saveCustomStyle"
        @cancel="showStyleConfig = false">
      </style-config-panel>
    </el-drawer>

    <!-- 使用帮助弹窗 -->
    <el-dialog title="使用帮助" :visible.sync="showHelp" width="70%">
      <div class="help-content">
        <h3>使用说明</h3>
        <p>1. 在左侧 Markdown 编辑器中输入内容</p>
        <p>2. 右侧实时预览 HTML 效果</p>
        <p>3. 点击"复制 HTML"或"复制富文本"按钮，粘贴到微信公众号编辑器</p>
        <p>4. 可选择不同样式主题，或点击"配置样式"自定义样式</p>

        <h3>Markdown 语法参考</h3>
        <p><strong>标题：</strong># 一级标题, ## 二级标题, ..., ###### 六级标题</p>
        <p><strong>列表：</strong>- 无序列表项 或 1. 有序列表项</p>
        <p><strong>引用：</strong>> 引用内容</p>
        <p><strong>代码块：</strong>```javascript\n代码内容\n```</p>
        <p><strong>行内代码：</strong>`代码`</p>
        <p><strong>链接：</strong>[链接文字](https://example.com)</p>
        <p><strong>图片：</strong>![图片描述](https://example.com/image.jpg)</p>
        <p><strong>表格：</strong>
          | 列1 | 列2 | 列3 |\n|---|---|---|\n| 数据1 | 数据2 | 数据3 |
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import StyleConfigPanel from './StyleConfigPanel.vue';

export default {
  name: 'ToolWeChatMarkdown',
  components: {
    StyleConfigPanel
  },
  data() {
    return {
      markdownText: '',
      htmlSource: '',
      styledHtml: '',
      wordCount: 0,
      currentStyleName: '简约白',
      showStyleConfig: false,
      showHelp: false,
      customStyles: [],
      currentStyle: {},
      md: null
    };
  },
  computed: {
    presetStyles() {
      return [
        {
          styleName: '简约白',
          global: {
            backgroundColor: '#ffffff',
            textColor: '#333333',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#2c3e50', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#34495e', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#34495e', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#34495e', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#34495e', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#909399', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#333333',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#f5f5f5',
            borderColor: '#dcdfe6',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#606266',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#282c34',
            color: '#abb2bf',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#f5f7fa',
            color: '#e83e8c',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#409eff'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #ebeef5'
          },
          tableHeader: {
            backgroundColor: '#f5f7fa',
            color: '#303133',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #ebeef5'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #ebeef5',
            color: '#606266'
          },
          link: {
            color: '#409eff',
            textDecoration: 'none',
            borderBottom: '1px solid #409eff'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        },
        {
          styleName: '护眼绿',
          global: {
            backgroundColor: '#f0f9f4',
            textColor: '#2c3e50',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#27ae60', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#2ecc71', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#16a085', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#1abc9c', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#1abc9c', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#95a5a6', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#2c3e50',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#e8f5e9',
            borderColor: '#4caf50',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#2e7d32',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#1b5e20',
            color: '#c8e6c9',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#4caf50'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #c8e6c9'
          },
          tableHeader: {
            backgroundColor: '#c8e6c9',
            color: '#1b5e20',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #4caf50'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #c8e6c9',
            color: '#2e7d32'
          },
          link: {
            color: '#4caf50',
            textDecoration: 'none',
            borderBottom: '1px solid #4caf50'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        },
        {
          styleName: '商务蓝',
          global: {
            backgroundColor: '#f5f7fa',
            textColor: '#2c3e50',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#1a237e', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#283593', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#3949ab', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#3f51b5', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#5c6bc0', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#7986cb', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#2c3e50',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#e3f2fd',
            borderColor: '#2196f3',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#1565c0',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#0d47a1',
            color: '#bbdefb',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#e3f2fd',
            color: '#1565c0',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#2196f3'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #bbdefb'
          },
          tableHeader: {
            backgroundColor: '#e3f2fd',
            color: '#0d47a1',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #2196f3'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #bbdefb',
            color: '#1976d2'
          },
          link: {
            color: '#2196f3',
            textDecoration: 'none',
            borderBottom: '1px solid #2196f3'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        },
        {
          styleName: '活力橙',
          global: {
            backgroundColor: '#fff8e1',
            textColor: '#2c3e50',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#e65100', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#ef6c00', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#f57c00', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#ff9800', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#ffa726', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#ffb74d', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#2c3e50',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#fff3e0',
            borderColor: '#ff9800',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#e65100',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#e65100',
            color: '#fff3e0',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#fff3e0',
            color: '#e65100',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#ff9800'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #ffe0b2'
          },
          tableHeader: {
            backgroundColor: '#fff3e0',
            color: '#e65100',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #ff9800'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #ffe0b2',
            color: '#f57c00'
          },
          link: {
            color: '#ff9800',
            textDecoration: 'none',
            borderBottom: '1px solid #ff9800'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        },
        {
          styleName: '浪漫粉',
          global: {
            backgroundColor: '#fef7f7',
            textColor: '#2c3e50',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#e91e63', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#f06292', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#ec407a', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#f48fb1', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#f8bbd0', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#f48fb1', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#2c3e50',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#fce4ec',
            borderColor: '#ec407a',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#c2185b',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#880e4f',
            color: '#f8bbd0',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#fce4ec',
            color: '#c2185b',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#e91e63'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #f8bbd0'
          },
          tableHeader: {
            backgroundColor: '#fce4ec',
            color: '#880e4f',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #ec407a'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #f8bbd0',
            color: '#c2185b'
          },
          link: {
            color: '#e91e63',
            textDecoration: 'none',
            borderBottom: '1px solid #e91e63'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        },
        {
          styleName: '优雅紫',
          global: {
            backgroundColor: '#f3e5f5',
            textColor: '#2c3e50',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#7b1fa2', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#8e24aa', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#9c27b0', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#ab47bc', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#ba68c8', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#ce93d8', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#2c3e50',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#e1bee7',
            borderColor: '#ab47bc',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#6a1b9a',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#4a148c',
            color: '#e1bee7',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#e1bee7',
            color: '#6a1b9a',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#9c27b0'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #ce93d8'
          },
          tableHeader: {
            backgroundColor: '#e1bee7',
            color: '#4a148c',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #ab47bc'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #ce93d8',
            color: '#6a1b9a'
          },
          link: {
            color: '#9c27b0',
            textDecoration: 'none',
            borderBottom: '1px solid #9c27b0'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        },
        {
          styleName: '科技青',
          global: {
            backgroundColor: '#e0f2f1',
            textColor: '#2c3e50',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#00695c', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#00796b', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#00897b', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#009688', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#26a69a', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#4db6ac', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#2c3e50',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#b2dfdb',
            borderColor: '#009688',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#004d40',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#004d40',
            color: '#b2dfdb',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#b2dfdb',
            color: '#004d40',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#009688'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #80cbc4'
          },
          tableHeader: {
            backgroundColor: '#b2dfdb',
            color: '#004d40',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #009688'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #80cbc4',
            color: '#00695c'
          },
          link: {
            color: '#009688',
            textDecoration: 'none',
            borderBottom: '1px solid #009688'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        },
        {
          styleName: '暖阳黄',
          global: {
            backgroundColor: '#fffde7',
            textColor: '#2c3e50',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#f57f17', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#f9a825', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#fbc02d', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#fdd835', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#ffee58', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#fff9c4', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#2c3e50',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#fff9c4',
            borderColor: '#fbc02d',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#f57f17',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#f57f17',
            color: '#fffde7',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#fff9c4',
            color: '#f57f17',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#fbc02d'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #fff59d'
          },
          tableHeader: {
            backgroundColor: '#fff9c4',
            color: '#f57f17',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #fbc02d'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #fff59d',
            color: '#f9a825'
          },
          link: {
            color: '#fbc02d',
            textDecoration: 'none',
            borderBottom: '1px solid #fbc02d'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        },
        {
          styleName: '深色夜',
          global: {
            backgroundColor: '#1a1a1a',
            textColor: '#e0e0e0',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#bb86fc', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#3700b3', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#6200ea', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#b388ff', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#8c9eff', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#536dfe', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#e0e0e0',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#2d2d2d',
            borderColor: '#bb86fc',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#b0bec5',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#121212',
            color: '#e0e0e0',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#2d2d2d',
            color: '#bb86fc',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#bb86fc'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #424242'
          },
          tableHeader: {
            backgroundColor: '#2d2d2d',
            color: '#bb86fc',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #bb86fc'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #424242',
            color: '#e0e0e0'
          },
          link: {
            color: '#bb86fc',
            textDecoration: 'none',
            borderBottom: '1px solid #bb86fc'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        }
        {
          styleName: '护眼绿',
          global: {
            backgroundColor: '#f0f9f4',
            textColor: '#2c3e50',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#27ae60', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#2ecc71', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#16a085', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#1abc9c', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#1abc9c', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#95a5a6', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#2c3e50',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#e8f5e9',
            borderColor: '#4caf50',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#2e7d32',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#1b5e20',
            color: '#c8e6c9',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#4caf50'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #c8e6c9'
          },
          tableHeader: {
            backgroundColor: '#c8e6c9',
            color: '#1b5e20',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #4caf50'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #c8e6c9',
            color: '#2e7d32'
          },
          link: {
            color: '#4caf50',
            textDecoration: 'none',
            borderBottom: '1px solid #4caf50'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        },
        {
          styleName: '商务蓝',
          global: {
            backgroundColor: '#f5f7fa',
            textColor: '#2c3e50',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#1a237e', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#283593', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#3949ab', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#3f51b5', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#5c6bc0', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#7986cb', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#2c3e50',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#e3f2fd',
            borderColor: '#2196f3',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#1565c0',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#0d47a1',
            color: '#bbdefb',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#e3f2fd',
            color: '#1565c0',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#2196f3'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #bbdefb'
          },
          tableHeader: {
            backgroundColor: '#e3f2fd',
            color: '#0d47a1',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #2196f3'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #bbdefb',
            color: '#1976d2'
          },
          link: {
            color: '#2196f3',
            textDecoration: 'none',
            borderBottom: '1px solid #2196f3'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        },
        {
          styleName: '活力橙',
          global: {
            backgroundColor: '#fff8e1',
            textColor: '#2c3e50',
            fontSize: 16,
            lineHeight: 1.8,
            padding: 20,
            maxWidth: '100%'
          },
          headings: {
            h1: { fontSize: 24, color: '#e65100', fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
            h2: { fontSize: 20, color: '#ef6c00', fontWeight: 'bold', marginTop: 20, marginBottom: 14 },
            h3: { fontSize: 18, color: '#f57c00', fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
            h4: { fontSize: 16, color: '#ff9800', fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
            h5: { fontSize: 15, color: '#ffa726', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
            h6: { fontSize: 14, color: '#ffb74d', fontWeight: 'bold', marginTop: 12, marginBottom: 6 }
          },
          paragraph: {
            fontSize: 16,
            color: '#2c3e50',
            marginBottom: 16,
            textIndent: false,
            lineHeight: 1.8
          },
          blockquote: {
            backgroundColor: '#fff3e0',
            borderColor: '#ff9800',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            padding: '12px 16px',
            borderRadius: 4,
            color: '#e65100',
            fontSize: 15,
            marginBottom: 16
          },
          codeBlock: {
            backgroundColor: '#e65100',
            color: '#fff3e0',
            padding: '16px',
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: 16,
            border: 'none'
          },
          inlineCode: {
            backgroundColor: '#fff3e0',
            color: '#e65100',
            padding: '2px 6px',
            borderRadius: 3,
            fontSize: 14,
            fontFamily: 'Consolas, Monaco, monospace'
          },
          list: {
            itemMarginBottom: 8,
            itemPaddingLeft: 20,
            bulletColor: '#ff9800'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 20,
            border: '1px solid #ffe0b2'
          },
          tableHeader: {
            backgroundColor: '#fff3e0',
            color: '#e65100',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #ff9800'
          },
          tableCell: {
            padding: '12px',
            borderBottom: '1px solid #ffe0b2',
            color: '#f57c00'
          },
          link: {
            color: '#ff9800',
            textDecoration: 'none',
            borderBottom: '1px solid #ff9800'
          },
          image: {
            maxWidth: '100%',
            borderRadius: 4,
            marginBottom: 20
          }
        }
      ];
    }
  },
  mounted() {
    this.initMarkdownIt();
    this.loadCustomStyles();
    this.loadCurrentStyle();
  },
  methods: {
    initMarkdownIt() {
      this.md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
          }
          return '';
        }
      });
    },

    onMarkdownChange() {
      this.updateWordCount();
      this.convertMarkdown();
    },

    updateWordCount() {
      this.wordCount = this.markdownText.length;
    },

    convertMarkdown() {
      if (!this.markdownText) {
        this.htmlSource = '';
        this.styledHtml = '';
        return;
      }

      const rawHtml = this.md.render(this.markdownText);
      this.htmlSource = this.applyStyles(rawHtml);
      this.styledHtml = this.htmlSource;
    },

    applyStyles(html) {
      const style = this.currentStyle;
      if (!style) return html;

      let styled = html;

      // Apply global styles
      styled = `<div style="background-color: ${style.global.backgroundColor}; color: ${style.global.textColor}; font-size: ${style.global.fontSize}px; line-height: ${style.global.lineHeight}; padding: ${style.global.padding}px; max-width: ${style.global.maxWidth};">${styled}</div>`;

      // Apply heading styles
      for (let i = 1; i <= 6; i++) {
        const hStyle = style.headings[`h${i}`];
        const regex = new RegExp(`<h${i}([^>]*)>(.*?)</h${i}>`, 'g');
        styled = styled.replace(regex, `<h${i}$1 style="font-size: ${hStyle.fontSize}px; color: ${hStyle.color}; font-weight: ${hStyle.fontWeight}; margin-top: ${hStyle.marginTop}px; margin-bottom: ${hStyle.marginBottom}px;">$2</h${i}>`);
      }

      // Apply paragraph styles
      const pStyle = style.paragraph;
      const pRegex = /<p([^>]*)>(.*?)<\/p>/g;
      styled = styled.replace(pRegex, (match, attrs, content) => {
        let extraStyle = `font-size: ${pStyle.fontSize}px; color: ${pStyle.color}; margin-bottom: ${pStyle.marginBottom}px; line-height: ${pStyle.lineHeight};`;
        if (pStyle.textIndent) {
          extraStyle += ` text-indent: 2em;`;
        }
        return `<p${attrs} style="${extraStyle}">${content}</p>`;
      });

      // Apply blockquote styles
      const bqStyle = style.blockquote;
      const bqRegex = /<blockquote([^>]*)>(.*?)<\/blockquote>/g;
      styled = styled.replace(bqRegex, `<blockquote$1 style="background-color: ${bqStyle.backgroundColor}; border: ${bqStyle.borderWidth} ${bqStyle.borderStyle} ${bqStyle.borderColor}; padding: ${bqStyle.padding}; border-radius: ${bqStyle.borderRadius}px; color: ${bqStyle.color}; font-size: ${bqStyle.fontSize}px; margin-bottom: ${bqStyle.marginBottom}px;">$2</blockquote>`);

      // Apply code block styles
      const cbStyle = style.codeBlock;
      const cbRegex = /<pre><code[^>]*class="language-([^"]*)"[^>]*>(.*?)<\/code><\/pre>/g;
      styled = styled.replace(cbRegex, `<pre><code style="background-color: ${cbStyle.backgroundColor}; color: ${cbStyle.color}; padding: ${cbStyle.padding}; border-radius: ${cbStyle.borderRadius}px; font-size: ${cbStyle.fontSize}px; line-height: ${cbStyle.lineHeight}; overflow-x: auto; margin-bottom: ${cbStyle.marginBottom}px; border: ${cbStyle.border}; display: block; font-family: 'Consolas', 'Monaco', monospace;">$2</code></pre>`);

      // Apply inline code styles
      const icStyle = style.inlineCode;
      const icRegex = /<code[^>]*class="language-([^"]*)"[^>]*>(.*?)<\/code>/g;
      const icRegex2 = /<code([^>]*)>(.*?)<\/code>/g;
      styled = styled.replace(icRegex2, (match, attrs, content) => {
        if (!attrs.includes('class="language-')) {
          return `<code${attrs} style="background-color: ${icStyle.backgroundColor}; color: ${icStyle.color}; padding: ${icStyle.padding}; border-radius: ${icStyle.borderRadius}px; font-size: ${icStyle.fontSize}px; font-family: ${icStyle.fontFamily};">${content}</code>`;
        }
        return match;
      });

      // Apply list styles
      const listStyle = style.list;
      const liRegex = /<li([^>]*)>(.*?)<\/li>/g;
      styled = styled.replace(liRegex, `<li$1 style="margin-bottom: ${listStyle.itemMarginBottom}px; padding-left: ${listStyle.itemPaddingLeft}px;">$2</li>`);

      // Apply table styles
      const tStyle = style.table;
      const thStyle = style.tableHeader;
      const tdStyle = style.tableCell;
      styled = styled.replace(/<table([^>]*)>/g, `<table$1 style="width: ${tStyle.width}; border-collapse: ${tStyle.borderCollapse}; margin-bottom: ${tStyle.marginBottom}px; border: ${tStyle.border};">`);
      styled = styled.replace(/<th([^>]*)>/g, `<th$1 style="background-color: ${thStyle.backgroundColor}; color: ${thStyle.color}; font-weight: ${thStyle.fontWeight}; padding: ${thStyle.padding}; text-align: ${thStyle.textAlign}; border-bottom: ${thStyle.borderBottom};">`);
      styled = styled.replace(/<td([^>]*)>/g, `<td$1 style="padding: ${tdStyle.padding}; border-bottom: ${tdStyle.borderBottom}; color: ${tdStyle.color};">`);

      // Apply link styles
      const linkStyle = style.link;
      const linkRegex = /<a([^>]*)>(.*?)<\/a>/g;
      styled = styled.replace(linkRegex, `<a$1 style="color: ${linkStyle.color}; text-decoration: ${linkStyle.textDecoration}; border-bottom: ${linkStyle.borderBottom};">$2</a>`);

      // Apply image styles
      const imgStyle = style.image;
      const imgRegex = /<img([^>]+?)\/?>/g;
      styled = styled.replace(imgRegex, (match, attrs) => {
        if (!attrs.includes('style=')) {
          return `<img ${attrs} style="max-width: ${imgStyle.maxWidth}; border-radius: ${imgStyle.borderRadius}px; margin-bottom: ${imgStyle.marginBottom}px;" />`;
        }
        return match;
      });

      return styled;
    },

    onStyleChange(styleName) {
      this.loadStyleByName(styleName);
      this.saveCurrentStyle(styleName);
      this.convertMarkdown();
    },

    loadStyleByName(styleName) {
      const preset = this.presetStyles.find(s => s.styleName === styleName);
      const custom = this.customStyles.find(s => s.styleName === styleName);
      this.currentStyle = preset || custom || this.presetStyles[0];
    },

    loadCurrentStyle() {
      const savedStyle = localStorage.getItem('wechat_markdown_current_style');
      if (savedStyle) {
        this.currentStyleName = savedStyle;
        this.loadStyleByName(savedStyle);
      } else {
        this.currentStyle = JSON.parse(JSON.stringify(this.presetStyles[0]));
      }
    },

    saveCurrentStyle(styleName) {
      localStorage.setItem('wechat_markdown_current_style', styleName);
    },

    loadCustomStyles() {
      const saved = localStorage.getItem('wechat_markdown_custom_styles');
      if (saved) {
        try {
          this.customStyles = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to load custom styles:', e);
        }
      }
    },

    saveCustomStyle(style) {
      const existingIndex = this.customStyles.findIndex(s => s.styleName === style.styleName);
      if (existingIndex >= 0) {
        this.customStyles[existingIndex] = style;
      } else {
        this.customStyles.push(style);
      }
      localStorage.setItem('wechat_markdown_custom_styles', JSON.stringify(this.customStyles));
      this.currentStyleName = style.styleName;
      this.currentStyle = style;
      this.showStyleConfig = false;
      this.convertMarkdown();
      this.$message.success('样式保存成功');
    },

    deleteCustomStyle(styleName) {
      const index = this.customStyles.findIndex(s => s.styleName === styleName);
      if (index >= 0) {
        this.customStyles.splice(index, 1);
        localStorage.setItem('wechat_markdown_custom_styles', JSON.stringify(this.customStyles));
        if (this.currentStyleName === styleName) {
          this.currentStyleName = '简约白';
          this.loadStyleByName(this.currentStyleName);
        }
        this.convertMarkdown();
        this.$message.success('样式删除成功');
      }
    },

    openStyleConfig() {
      this.showStyleConfig = true;
    },

    exportStyle() {
      const styleJson = JSON.stringify(this.currentStyle, null, 2);
      const blob = new Blob([styleJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.currentStyleName}_style.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.$message.success('样式导出成功');
    },

    clearEditor() {
      this.$confirm('确定要清空编辑器内容吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.markdownText = '';
        this.onMarkdownChange();
        this.$message.success('已清空');
      }).catch(() => {});
    },

    loadExample() {
      this.markdownText = `# 欢迎使用微信公众号 Markdown 转 HTML 工具

## 功能特点

- **实时转换**：输入 Markdown，实时预览 HTML
- **样式丰富**：多种预设样式，支持自定义
- **一键复制**：快速复制 HTML 或富文本

## Markdown 语法示例

### 1. 段落和文字

这是一段普通文本。你可以使用 **粗体**、*斜体*、~~删除线~~ 等格式。

### 2. 列表

- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项

1. 有序列表项 1
2. 有序列表项 2

### 3. 引用

> 这是一个引用块。
> 可以包含多行内容。

### 4. 代码块

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

行内代码：\`const x = 1;\`

### 5. 链接和图片

[GitHub](https://github.com)

### 6. 表格

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

## 开始使用

在左侧编辑器中输入 Markdown 内容，右侧实时预览效果！
`;
      this.onMarkdownChange();
      this.$message.success('示例加载成功');
    },

    exportMarkdown() {
      if (!this.markdownText) {
        this.$message.warning('请先输入 Markdown 内容');
        return;
      }
      const blob = new Blob([this.markdownText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.$message.success('Markdown 文件导出成功');
    },

    copyHtml() {
      if (!this.htmlSource) {
        this.$message.warning('没有可复制的内容');
        return;
      }
      this.$copyText(this.htmlSource).then(() => {
        this.$message.success('HTML 代码复制成功');
      }).catch(() => {
        this.$message.error('复制失败');
      });
    },

    copyRichText() {
      if (!this.styledHtml) {
        this.$message.warning('没有可复制的内容');
        return;
      }
      const range = document.createRange();
      range.selectNode(document.querySelector('.html-preview'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        document.execCommand('copy');
        selection.removeAllRanges();
        this.$message.success('富文本复制成功，可直接粘贴到微信公众号编辑器');
      } catch (err) {
        this.$message.error('复制失败');
      }
    },

    copyHtmlSource() {
      if (!this.htmlSource) {
        this.$message.warning('没有可复制的内容');
        return;
      }
      this.$copyText(this.htmlSource).then(() => {
        this.$message.success('HTML 源码复制成功');
      }).catch(() => {
        this.$message.error('复制失败');
      });
    }
  }
};
</script>

<style scoped>
.wechat-markdown-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.toolbar h2 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
}

.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.toolbar .el-select {
  width: 200px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e8f4f8;
}

.section-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #303133;
  font-weight: 600;
}

.section-hint {
  margin-left: 15px;
  font-size: 13px;
  color: #909399;
  font-style: italic;
}

.word-count {
  margin-left: auto;
  font-size: 13px;
  color: #909399;
}

.editor-section,
.preview-section,
.code-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.code-section {
  margin-top: 20px;
}

.markdown-editor >>> .el-textarea__inner {
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.editor-actions,
.preview-actions,
.code-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #dcdfe6;
}

.html-preview {
  min-height: 400px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fafafa;
  overflow: auto;
}

.html-preview >>> img {
  max-width: 100%;
}

.html-preview >>> pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.help-content h3 {
  color: #303133;
  margin-top: 20px;
  margin-bottom: 10px;
}

.help-content p {
  line-height: 1.8;
  margin-bottom: 8px;
  color: #606266;
}

.help-content strong {
  color: #409eff;
}
</style>
