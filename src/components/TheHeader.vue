<template>
    <div class="head">
        <el-row>
            <el-col :span="8">       
                <router-link to="/">
                    <img src='../assets/logo.png' title='logo.png'/>
                </router-link>
            </el-col>
            <el-col :span="8">
                
            </el-col>
            <el-col :span="8">
                <h1>萌叔的工具箱</h1>
            </el-col>
        </el-row>
    </div>

</template>


<script>
</script>


<style  scoped>
.head {
    color: white;
}
.head img{
    width: 3rem;
    height: 2.5rem;
    margin-left: 3rem;
    margin-top: 0.8rem;
    float:left;
}
</style>