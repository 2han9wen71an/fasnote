// 获取配置
const PRIVATE_CONFIG = {
  loginPath: '/login/',
  cookieName: 'blog_session',
  sessionDuration: 604800
};

// 用户配置
const USERS = [
    {
        "username": "admin",
        "passwordHash": "$2a$10$zRrOXdaaZc0JgI11MAqXjuUU6o05ilb2XJbRq4pbywRTWXOrg4m8C"
    }
];

// 处理登录
async function handleLogin(username, password) {
  const user = USERS.find(u => u.username === username);
  
  if (!user) {
    throw new Error('用户名或密码错误');
  }
  
  // 使用 bcrypt 验证密码
  const isValid = dcodeIO.bcrypt.compareSync(password, user.passwordHash);
  
  if (!isValid) {
    throw new Error('用户名或密码错误');
  }
  
  // 生成会话令牌
  const token = btoa(`${username}:${Date.now()}`);
  
  // 使用配置中的 cookie 名称和过期时间
  document.cookie = `${PRIVATE_CONFIG.cookieName}=${token}; path=/; max-age=${PRIVATE_CONFIG.sessionDuration}`;
  
  return true;
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