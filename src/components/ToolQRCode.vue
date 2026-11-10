<template>
  <div class="qrcode-container">
    <div class="panel">
      <div class="section-header">
        <h3>文本生成二维码</h3>
        <span class="section-hint">比如 'hello world'</span>
      </div>
      <el-input
        type="textarea"
        :rows="8"
        v-model.trim="text"
        placeholder="例如：hello world"
        class="custom-textarea">
      </el-input>
      <div class="action-row">
        <el-button
          type="primary"
          class="btn-primary"
          @click='generate'
          size="large">
          生成二维码
        </el-button>
      </div>
      <div class="qr-preview" v-if="qrDataUrl">
        <img :src="qrDataUrl" alt="二维码"/>
        <el-button size="small" class="btn-secondary" @click="downloadQr">下载PNG</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import QRCode from 'qrcode';

export default {
  name: 'QRCode',
  data() {
    return {
      text: '',
      qrDataUrl: ''
    };
  },
  methods: {
    generate() {
      if (!this.text) {
        this.$message.warning('请输入内容');
        return;
      }
      QRCode.toDataURL(this.text, { width: 260, margin: 2 })
        .then((url) => {
          this.qrDataUrl = url;
        })
        .catch((error) => {
          console.log(error);
          this.$message.error('生成失败：内容过长或包含无法编码的字符');
        });
    },
    downloadQr() {
      const link = document.createElement('a');
      link.href = this.qrDataUrl;
      link.download = 'qrcode.png';
      link.click();
    }
  }
}
</script>


<style scoped>
.qrcode-container {
  padding: 4px 0;
}

.panel {
  width: 100%;
}

.section-header {
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.section-header h3 {
  margin: 0 0 6px 0;
  font-size: 17px;
  color: var(--color-text);
  font-weight: 700;
  letter-spacing: -0.02em;
  font-family: var(--font-ui);
}

.section-hint {
  font-size: 13px;
  color: var(--color-text-muted);
  font-style: normal;
}

.custom-textarea >>> .el-textarea__inner {
  border-radius: var(--radius-control);
  border: 1px solid var(--color-border);
  padding: 14px;
  font-size: 15px;
  line-height: 1.6;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  color: var(--color-text);
}

.custom-textarea >>> .el-textarea__inner:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.action-row {
  margin-top: 14px;
  text-align: center;
}

.action-row .el-button {
  padding: 10px 24px;
  font-size: 15px;
  border-radius: var(--radius-control);
  font-weight: 600;
  margin: 0 8px;
  font-family: var(--font-ui);
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.action-row .btn-primary,
.action-row .el-button--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: none;
}

.action-row .btn-primary:hover,
.action-row .el-button--primary:hover {
  background: #095aa9;
  border-color: #095aa9;
  transform: translateY(-1px);
}

.action-row .btn-secondary {
  background: var(--color-secondary-bg);
  border-color: var(--color-secondary-bg);
  color: #334155;
}

.action-row .btn-secondary:hover {
  background: #dce5f0;
  border-color: #dce5f0;
  color: var(--color-text);
  transform: translateY(-1px);
}

.qr-preview {
  margin-top: 18px;
  padding: 18px;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-control);
}

.qr-preview img {
  display: block;
  margin: 0 auto 12px auto;
  max-width: 260px;
  width: 100%;
}
</style>
