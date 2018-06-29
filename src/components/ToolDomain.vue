<template>
    <table class="domain">
        <tr>
            <td>
                <p>
                    <span class="bold">免责声明:</span>本功能仅用于个人学习、研究或欣赏。不保证域名价值评估的准确性。
                </p>
                <p>
                    亲，想对你手上的域名做个估值，</br>
                    辛苦运营了一个网站, 现在到底值多少💰 ?<br/>
                    在下方的输入框，输入域名, 点击查询, 即刻知晓。
                </p>
                <p> 关键词： 域名|估值|评估 </p>
            </td>
        </tr>
        <tr>
            <td>
                <p><el-input v-model="domain" clearable></el-input></p>
                <p>
                    <el-button type="primary" @click='getDomainValue'>查询</el-button>
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <div v-show='loading'>
                    <img src="../assets/1.gif"/> 
                    正在加载数据,请稍候...
                </div>
                <div v-show='showFlag'>
                    <p>查询结果:</p>
                    <p>自身价值: ￥{{ result.itself_value}}</p>
                    <p>附加价值: ￥{{ result.added_value}}</p>
                    <p>总计价值: ￥{{ result.total_value}}</p>
                    {{result.comment}}
                </div>
            </td>
        </tr>
    </table>
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

<style  scoped>
.domain {
    text-align: left;
}
.bold {
    font-weight:bold;
}
</style>