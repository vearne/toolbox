<template>
    <div class="head">
        <div class="header-content">
            <button
                type="button"
                class="menu-toggle"
                :aria-expanded="sidebarOpen ? 'true' : 'false'"
                aria-label="菜单"
                @click="$emit('toggle-sidebar')">
                <i :class="sidebarOpen ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
            </button>
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
    name: 'TheHeader',
    props: ['sidebarOpen']
}
</script>


<style scoped>
.head {
    width: 100%;
    height: var(--header-height);
    color: var(--color-text);
    font-family: var(--font-ui);
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 30px;
    height: 100%;
    gap: 12px;
}

.menu-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.7);
    color: var(--color-text);
    cursor: pointer;
    flex-shrink: 0;
    font-size: 18px;
    padding: 0;
}

.menu-toggle:hover {
    background: #fff;
    color: var(--color-primary);
}

.logo-section {
    flex: 1;
    min-width: 0;
}

.logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--color-text);
    transition: opacity 0.2s ease;
}

.logo-link:hover {
    opacity: 0.85;
}

.logo-link img {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(40, 70, 100, 0.12);
}

.logo-text {
    margin-left: 14px;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.03em;
}

.header-title {
    flex: 1;
    text-align: right;
}

.header-title h1 {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: var(--color-text-muted);
}

.header-title i {
    margin-right: 6px;
}

@media (max-width: 768px) {
    .header-content {
        padding: 0 15px;
    }

    .menu-toggle {
        display: inline-flex;
    }

    .logo-text {
        font-size: 17px;
    }

    .header-title h1 {
        font-size: 12px;
    }
}
</style>
