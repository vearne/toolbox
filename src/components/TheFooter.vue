<template>
    <div class="foot">
        <div class="footer-content">
            <p class="copyright">
                <i class="el-icon-star-on"></i>
                © 2018-{{ currentYear }} 萌叔
                <span class="divider">|</span>
                资深程序员的技术博客
            </p>
            <p class="footer-links">
                <a href="javascript:void(0)" class="footer-link">
                    <i class="el-icon-link"></i> 关于
                </a>
                <a href="javascript:void(0)" class="footer-link">
                    <i class="el-icon-chat-dot-round"></i> 反馈
                </a>
                <a href="javascript:void(0)" class="footer-link">
                    <i class="el-icon-s-cooperation"></i> 联系我们
                </a>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TheFooter',
    data() {
        return {
            currentYear: new Date().getFullYear()
        }
    }
}
</script>

<style scoped>
.foot {
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer-content {
    text-align: center;
}

.copyright {
    margin: 0 0 8px 0;
    font-size: 14px;
    opacity: 0.9;
    letter-spacing: 0.5px;
}

.divider {
    margin: 0 10px;
    opacity: 0.6;
}

.footer-links {
    margin: 0;
    font-size: 13px;
}

.footer-link {
    color: white;
    text-decoration: none;
    margin: 0 15px;
    opacity: 0.8;
    transition: all 0.3s ease;
    display: inline-block;
}

.footer-link:hover {
    opacity: 1;
    transform: translateY(-2px);
}

.footer-link i {
    margin-right: 4px;
}

@media (max-width: 768px) {
    .copyright {
        font-size: 12px;
    }
    
    .footer-links {
        font-size: 11px;
    }
    
    .footer-link {
        margin: 0 8px;
    }
}
</style>