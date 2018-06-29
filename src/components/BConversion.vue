<template>
    <table class="bconversion">
        <tr>
            <td>
                <label >{{leftLabel1}}</label>
            </td>
            <td>
                <label >{{rightLabel1}}</label>
            </td>
        </tr>
        <tr>
            <td>
                <label >{{leftLabel2}}</label>
            </td>
            <td>
                <label >{{rightLabel2}}</label>
            </td>
        </tr>
        <tr>
            <td>
                <textarea  rows="10" cols="40" v-model.trim="leftText"></textarea>
            </td>
            <td>
                <textarea  rows="10" cols="40" v-model.trim="rightText"></textarea>

                </el-input>
            </td>
        </tr>
        <tr>
            <td>
                <el-button type="primary" @click='forwardOp'>{{leftButton}} </el-button>
            </td>
            <td>
                <el-button type="primary" @click='reverseOp'>{{rightButton}} </el-button>
            </td>
        </tr>
    </table>


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
                ],
        data(){
            return {
                leftText: "",
                rightText: "",
            };
        },
        methods:{
            forwardOp(){
                var obj = new Object()
                obj[this.leftParam] = this.leftText;
                var rightParam = this.rightParam;

                this.$http({
                    url: this.requestUrl,
                    method:'post',
                    data: JSON.stringify(obj)
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
                var obj = new Object()
                obj[this.rightParam] = this.rightText;

                this.$http({
                    url: this.requestUrl,
                    method:'post',
                    data: JSON.stringify(obj)
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


<style  scoped>
.bconversion {
    text-align: left;
    font-weight:bold;
}
textarea {
    font-size:1.2rem;
}
</style>