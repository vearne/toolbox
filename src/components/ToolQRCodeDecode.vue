<template>
  <div class="qrcode-container">
    <div class="panel">
      <div class="section-header">
        <h3>二维码解析为文本</h3>
        <span class="section-hint">点击上传 / 拖拽图片 / Ctrl+V 粘贴截图</span>
      </div>
      <div
        class="upload-area"
        :class="{ 'is-dragover': dragover }"
        @click="triggerUpload"
        @dragover.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        @drop.prevent="onDrop">
        <img v-if="imageUrl" :src="imageUrl" class="upload-preview" alt="待解析图片"/>
        <div v-else class="upload-hint">
          <i class="el-icon-upload"></i>
          <p>点击选择图片，或拖拽 / 粘贴到此处</p>
        </div>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="onFileChange"/>
      <div class="action-row">
        <el-button
          class="btn-secondary"
          @click='decode'
          size="large">
          解析二维码
        </el-button>
      </div>
      <div v-if="decodedText" class="result-section">
        <div class="section-header">
          <h3>解析结果</h3>
        </div>
        <el-input
          type="textarea"
          :rows="4"
          :value="decodedText"
          readonly
          class="custom-textarea">
        </el-input>
        <div class="action-row">
          <el-button size="small" class="btn-secondary" @click="copyText">复制结果</el-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import jsQR from 'jsqr';

export default {
  name: 'QRCodeDecode',
  data() {
    return {
      imageUrl: '',
      imageFile: null,
      dragover: false,
      decodedText: ''
    };
  },
  mounted() {
    document.addEventListener('paste', this.onPaste);
  },
  beforeDestroy() {
    document.removeEventListener('paste', this.onPaste);
  },
  methods: {
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.loadImage(file);
      }
      e.target.value = '';
    },
    onDrop(e) {
      this.dragover = false;
      const file = e.dataTransfer.files[0];
      if (file) {
        this.loadImage(file);
      }
    },
    onPaste(e) {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) {
        return;
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            this.loadImage(file);
          }
          break;
        }
      }
    },
    loadImage(file) {
      if (file.type.indexOf('image') !== 0) {
        this.$message.warning('请选择图片文件');
        return;
      }
      this.imageFile = file;
      this.decodedText = '';
      const reader = new FileReader();
      reader.onload = (event) => {
        this.imageUrl = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    decode() {
      if (!this.imageFile) {
        this.$message.warning('请先提供二维码图片');
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          this.decodedText = code.data;
          this.$message.success('解析成功');
        } else {
          this.$message.error('未能识别二维码，请更换更清晰的图片');
        }
      };
      img.onerror = () => {
        this.$message.error('图片加载失败');
      };
      img.src = this.imageUrl;
    },
    copyText() {
      this.$copyText(this.decodedText).then(() => {
        this.$message.success('已复制');
      }).catch((error) => {
        console.log(error);
      });
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

.upload-area {
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-control);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.upload-area:hover,
.upload-area.is-dragover {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.upload-hint {
  text-align: center;
  color: var(--color-text-muted);
  font-family: var(--font-ui);
}

.upload-hint i {
  font-size: 34px;
  margin-bottom: 8px;
}

.upload-hint p {
  margin: 0;
  font-size: 14px;
}

.upload-preview {
  max-width: 100%;
  max-height: 220px;
  padding: 10px;
}

.result-section {
  margin-top: 18px;
}
</style>
