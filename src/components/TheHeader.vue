<template>
    <div class="head">
        <div class="header-content">
            <div class="logo-section">     
                <router-link to="/" class="logo-link">
                    <img src='../assets/logo.png' title='logo'/>
                    <span class="logo-text">萌叔的工具箱</span>
                </router-link>
            </div>
            <div class="header-title">
                <h1>
                    <i class="el-icon-s-grid"></i>
                    在线实用工具集
                </h1>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'TheHeader'
}
</script>


<style scoped>
.head {
    width: 100%;
    height: 80px;
    color: white;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 30px;
    height: 100%;
}

.logo-section {
    flex: 1;
}

.logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
    transition: all 0.3s ease;
}

.logo-link:hover {
    transform: translateY(-2px);
}

.logo-link img {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.logo-link:hover img {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    transform: rotate(5deg);
}

.logo-text {
    margin-left: 15px;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 1px;
}

.header-title {
    flex: 1;
    text-align: right;
}

.header-title h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 2px;
    opacity: 0.95;
}

.header-title i {
    margin-right: 8px;
}

@media (max-width: 768px) {
    .header-content {
        padding: 0 15px;
    }
    
    .logo-text {
        font-size: 18px;
    }
    
    .header-title h1 {
        font-size: 16px;
    }
}
</style>