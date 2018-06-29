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
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
.head {
    background: #324057;
    height: 4rem;
    width: 100%;
    color: white;
    padding:10px;
    position: absolute;
    top:0;
    left:0;
}
.head img{
    width: 5rem;
    height: 3.5rem;
    margin-left: 2rem;
    float:left;
}
</style>