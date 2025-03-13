// 获取配置
const PRIVATE_CONFIG = {
  loginPath: '/login/',
  cookieName: 'blog_session',
  sessionDuration: 604800
};

// 检查页面是否是私密文章
function isPrivatePost() {
  return document.body.classList.contains('private-post');
}

// 检查登录状态
function checkLoginStatus() {
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(cookie => cookie.trim().startsWith(`${PRIVATE_CONFIG.cookieName}=`));
  if (!sessionCookie) return false;

  const token = sessionCookie.split('=')[1].trim();
  return validateSession(token);
}

// 验证会话令牌
function validateSession(token) {
  try {
    const [username, timestamp] = atob(token).split(':');
    const sessionAge = Date.now() - parseInt(timestamp);
    // 使用配置中的 session 过期时间
    return sessionAge < PRIVATE_CONFIG.sessionDuration * 1000;
  } catch (error) {
    return false;
  }
}

// 页面加载时检查访问权限
document.addEventListener('DOMContentLoaded', function() {
  if (isPrivatePost() && !checkLoginStatus()) {
    // 如果是私密文章且未登录，重定向到登录页面，并保存当前页面URL
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.href = `${PRIVATE_CONFIG.loginPath}?return=${currentUrl}`;
  }
}); 