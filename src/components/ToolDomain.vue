<template>
    <div class="domain-container">
        <el-card class="info-card" shadow="hover">
            <div class="disclaimer">
                <i class="el-icon-warning-outline"></i>
                <span class="bold">免责声明：</span>本功能仅用于个人学习、研究或欣赏。不保证域名价值评估的准确性。
            </div>
            
            <div class="intro-section">
                <h3>🌐 域名价值评估</h3>
                <p>
                    想对您手上的域名做个估值？<br/>
                    辛苦运营了一个网站，现在到底值多少 💰 ?<br/>
                    在下方输入框填入域名，点击查询即可知晓。
                </p>
                <el-tag type="info" size="small">域名</el-tag>
                <el-tag type="info" size="small">估值</el-tag>
                <el-tag type="info" size="small">评估</el-tag>
            </div>
        </el-card>

        <el-card class="query-card" shadow="hover">
            <div class="input-section">
                <label class="input-label">请输入域名</label>
                <el-input 
                    v-model="domain" 
                    clearable
                    placeholder="例如：vearne.cc"
                    size="large"
                    class="domain-input">
                    <template slot="prepend">
                        <i class="el-icon-link"></i>
                    </template>
                </el-input>
            </div>
            
            <div class="button-section">
                <el-button 
                    type="primary" 
                    @click='getDomainValue'
                    size="large"
                    icon="el-icon-search"
                    :loading="loading">
                    {{ loading ? '查询中...' : '查询域名价值' }}
                </el-button>
            </div>

            <div v-show='loading' class="loading-section">
                <img src="../assets/1.gif" class="loading-gif"/> 
                <p>正在加载数据，请稍候...</p>
            </div>
            
            <el-card v-show='showFlag' class="result-card" shadow="never">
                <h3 class="result-title">
                    <i class="el-icon-s-data"></i> 查询结果
                </h3>
                <div class="result-content">
                    <div class="result-item">
                        <span class="result-label">自身价值：</span>
                        <span class="result-value primary">￥{{ result.itself_value }}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">附加价值：</span>
                        <span class="result-value success">￥{{ result.added_value }}</span>
                    </div>
                    <div class="result-item total">
                        <span class="result-label">总计价值：</span>
                        <span class="result-value warning">￥{{ result.total_value }}</span>
                    </div>
                    <div class="result-comment" v-if="result.comment">
                        <el-divider></el-divider>
                        <p>{{ result.comment }}</p>
                    </div>
                </div>
            </el-card>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'Domain',
    data(){
        return {
            loading: false,
            showFlag: false,
            domain: "vearne.cc",
            result: {},
        };
    },
    // watch:{
    //     result(val){
    //         if(val){
    //             this.loading  = false;
    //         }
    //     }
    // },
    methods:{
        getDomainValue(){
            this.loading = true;
            this.showFlag = false;

            this.$http({
                url: "/domain",
                method:'post',
                data: JSON.stringify({"domain":this.domain})
            }).then((response) => {
                if(response.status == 200){
                    this.result = response.data;
                    this.loading = false;
                    this.showFlag = true;
                }
            }).catch((error) => {
                console.log(error);
            });
        },
    }
}
</script>

<style scoped>
.domain-container {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
}

.info-card {
    margin-bottom: 25px;
    border-radius: 12px;
}

.disclaimer {
    background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #e6a23c;
    border-left: 4px solid #e6a23c;
}

.disclaimer i {
    font-size: 18px;
    margin-right: 8px;
}

.bold {
    font-weight: 600;
}

.intro-section {
    text-align: left;
}

.intro-section h3 {
    margin: 0 0 15px 0;
    font-size: 20px;
    color: #303133;
}

.intro-section p {
    line-height: 1.8;
    color: #606266;
    margin-bottom: 15px;
}

.intro-section .el-tag {
    margin-right: 8px;
}

.query-card {
    border-radius: 12px;
}

.input-section {
    margin-bottom: 25px;
}

.input-label {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
}

.domain-input {
    font-size: 16px;
}

.domain-input >>> .el-input__inner {
    border-radius: 8px;
    border: 2px solid #e4e7ed;
    padding: 12px 15px;
    transition: all 0.3s ease;
}

.domain-input >>> .el-input__inner:focus {
    border-color: #66a6ff;
    box-shadow: 0 0 0 3px rgba(102, 166, 255, 0.1);
}

.domain-input >>> .el-input-group__prepend {
    background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
    border: none;
    color: white;
    border-radius: 8px 0 0 8px;
}

.button-section {
    text-align: center;
    margin-bottom: 30px;
}

.button-section .el-button {
    padding: 14px 50px;
    font-size: 16px;
    border-radius: 25px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(102, 166, 255, 0.3);
    transition: all 0.3s ease;
}

.button-section .el-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 166, 255, 0.4);
}

.loading-section {
    text-align: center;
    padding: 30px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 12px;
    margin-top: 20px;
}

.loading-gif {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
}

.loading-section p {
    color: #409eff;
    font-size: 15px;
    margin: 0;
}

.result-card {
    margin-top: 25px;
    background: linear-gradient(135deg, #f6f9fc 0%, #f0f4f8 100%);
    border-radius: 12px;
    border: 2px solid #e8f4f8;
}

.result-title {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #303133;
    text-align: left;
}

.result-title i {
    color: #409eff;
    margin-right: 8px;
}

.result-content {
    text-align: left;
}

.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    margin-bottom: 10px;
    background: white;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.result-item:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.result-item.total {
    background: linear-gradient(135deg, #fff7e6 0%, #ffe8cc 100%);
    border: 2px solid #e6a23c;
    font-size: 18px;
    font-weight: 600;
}

.result-label {
    font-size: 15px;
    color: #606266;
}

.result-value {
    font-size: 24px;
    font-weight: 700;
}

.result-value.primary {
    color: #409eff;
}

.result-value.success {
    color: #67c23a;
}

.result-value.warning {
    color: #e6a23c;
}

.result-comment {
    margin-top: 20px;
}

.result-comment p {
    color: #909399;
    font-size: 14px;
    line-height: 1.8;
    padding: 15px;
    background: white;
    border-radius: 8px;
    margin: 0;
}
</style>