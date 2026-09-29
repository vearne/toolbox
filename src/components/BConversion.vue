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
                @click='forwardOp'
                size="large">
                {{leftButton}}
            </el-button>
            <el-button 
                type="success" 
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
    padding: 20px;
}

.input-section {
    margin-bottom: 20px;
}

.section-header {
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
    font-size: 13px;
    color: #909399;
    font-style: italic;
}

.custom-textarea {
    font-size: 15px;
}

.custom-textarea >>> .el-textarea__inner {
    border-radius: 8px;
    border: 2px solid #e4e7ed;
    padding: 15px;
    font-size: 15px;
    line-height: 1.6;
    transition: all 0.3s ease;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

.custom-textarea >>> .el-textarea__inner:focus {
    border-color: #66a6ff;
    box-shadow: 0 0 0 3px rgba(102, 166, 255, 0.1);
}

.button-section {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px dashed #dcdfe6;
}

.button-section .el-button {
    padding: 14px 40px;
    font-size: 16px;
    border-radius: 25px;
    font-weight: 500;
    margin: 0 10px;
    box-shadow: 0 4px 12px rgba(102, 166, 255, 0.3);
    transition: all 0.3s ease;
}

.button-section .el-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 166, 255, 0.4);
}

.button-section .el-button:active {
    transform: translateY(0);
}

.button-section .el-button--success {
    box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

.button-section .el-button--success:hover {
    box-shadow: 0 6px 16px rgba(103, 194, 58, 0.4);
}
</style>
