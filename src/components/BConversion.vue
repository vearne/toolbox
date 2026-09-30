<template>
    <div class="conversion-container">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="input-section">
                    <div class="section-header">
                        <h3>{{leftLabel1}}</h3>
                        <span class="section-hint">{{leftLabel2}}</span>
                    </div>
                    <el-input
                        type="textarea"
                        :rows="12"
                        v-model.trim="leftText"
                        :placeholder="'例如：' + leftLabel2"
                        class="custom-textarea">
                    </el-input>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="input-section">
                    <div class="section-header">
                        <h3>{{rightLabel1}}</h3>
                        <span class="section-hint">{{rightLabel2}}</span>
                    </div>
                    <el-input
                        type="textarea"
                        :rows="12"
                        v-model.trim="rightText"
                        :placeholder="'例如：' + rightLabel2"
                        class="custom-textarea">
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <div class="button-section">
            <el-button
                type="primary"
                class="btn-primary"
                @click='forwardOp'
                size="large">
                {{leftButton}}
            </el-button>
            <el-button
                class="btn-secondary"
                @click='reverseOp'
                size="large">
                {{rightButton}}
            </el-button>
        </div>
    </div>
</template>


<script>
    export default {
        name:"BConversion",
        props:[
                "leftLabel1", "rightLabel1",
                "leftLabel2", "rightLabel2",
                "leftButton", "rightButton",
                "leftParam", "rightParam",
                "requestUrl",
                "forwardFn", "reverseFn",
                ],
        data(){
            return {
                leftText: "",
                rightText: "",
            };
        },
        methods:{
            runLocal(fn, input, assign){
                if(!input){
                    this.$message.warning('请输入内容');
                    return;
                }
                try{
                    assign(fn(input));
                }catch(e){
                    this.$message.error(e && e.message ? e.message : '转换失败');
                }
            },
            forwardOp(){
                if(typeof this.forwardFn === 'function'){
                    this.runLocal(this.forwardFn, this.leftText, (v) => { this.rightText = v; });
                    return;
                }
                var obj = new Object()
                obj[this.leftParam] = this.leftText;

                this.$http({
                    url: this.requestUrl,
                    method:'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: obj
                }).then((response) => {
                    if(response.status == 200){
                        console.debug("ok");
                        this.rightText = response.data[this.rightParam];
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            reverseOp(){
                if(typeof this.reverseFn === 'function'){
                    this.runLocal(this.reverseFn, this.rightText, (v) => { this.leftText = v; });
                    return;
                }
                var obj = new Object()
                obj[this.rightParam] = this.rightText;

                this.$http({
                    url: this.requestUrl,
                    method:'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: obj
                }).then((response) => {
                    console.info(response.status)
                    console.info(response.data[this.leftParam])

                    if(response.status == 200){
                        this.leftText = response.data[this.leftParam]
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }
</script>


<style scoped>
.conversion-container {
    padding: 4px 0;
}

.input-section {
    margin-bottom: 16px;
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

.custom-textarea {
    font-size: 15px;
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

.button-section {
    text-align: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--color-border);
}

.button-section .el-button {
    padding: 12px 28px;
    font-size: 15px;
    border-radius: var(--radius-control);
    font-weight: 600;
    margin: 0 8px;
    font-family: var(--font-ui);
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.button-section .btn-primary,
.button-section .el-button--primary {
    background: var(--color-primary);
    border-color: var(--color-primary);
    box-shadow: none;
}

.button-section .btn-primary:hover,
.button-section .el-button--primary:hover {
    background: #095aa9;
    border-color: #095aa9;
    transform: translateY(-1px);
}

.button-section .btn-secondary {
    background: var(--color-secondary-bg);
    border-color: var(--color-secondary-bg);
    color: #334155;
}

.button-section .btn-secondary:hover {
    background: #dce5f0;
    border-color: #dce5f0;
    color: var(--color-text);
    transform: translateY(-1px);
}

.button-section .el-button:active {
    transform: translateY(0);
}
</style>
