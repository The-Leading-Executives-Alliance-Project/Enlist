# MongoDB 数据联动指南

这个文档说明如何实现前端页面输入数据与MongoDB数据库的联动。

## 架构概览

```
前端 (React) → API服务 → Express后端 → MongoDB
```

## 1. 后端设置

### 数据模型 (Models)
- `server/models/user.js` - 用户模型
- `server/models/userProfile.js` - 用户资料模型
- `server/models/university.js` - 大学数据模型

### API路由 (Routes)
- `server/routes/auth.js` - 认证相关API
- `server/routes/userProfile.js` - 用户资料API
- `server/routes/university.js` - 大学搜索API

### 数据库连接
- `server/config/db.js` - MongoDB连接配置
- `server/config/env.js` - 环境变量配置

## 2. 前端设置

### API服务
- `client/src/services/api.js` - 统一的API调用服务

### 组件示例
- `client/src/components/ProfileForm.jsx` - 用户资料表单组件
- `client/src/pages/Search.jsx` - 大学搜索页面

## 3. 数据联动流程

### 步骤1: 用户输入数据
```javascript
const [formData, setFormData] = useState({
    major: '',
    country: '',
    gpa: '',
    testScore: ''
});

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
};
```

### 步骤2: 调用API服务
```javascript
import { UniversityService } from '../services/api';

const handleSearch = async (e) => {
    e.preventDefault();
    try {
        const response = await UniversityService.search(searchData);
        setResults(response.universities);
    } catch (error) {
        console.error('Search error:', error);
    }
};
```

### 步骤3: 后端处理请求
```javascript
// server/routes/university.js
router.get('/search', async (req, res) => {
    try {
        const { major, country, gpa, testScore } = req.query;
        
        // 构建MongoDB查询
        let query = {};
        if (major) {
            query.$or = [
                { 'majors.name': { $regex: major, $options: 'i' } },
                { tags: { $regex: major, $options: 'i' } }
            ];
        }
        
        // 执行数据库查询
        const universities = await University.find(query);
        res.json({ universities });
    } catch (error) {
        res.status(500).json({ error: 'Error searching universities' });
    }
});
```

### 步骤4: 数据持久化
```javascript
// 保存搜索条件到用户资料
const saveSearchCriteria = async () => {
    try {
        await UserProfileService.updateProfile({
            searchCriteria: searchData
        });
    } catch (error) {
        console.error('Error saving search criteria:', error);
    }
};
```

## 4. 使用方法

### 启动服务器
```bash
# 启动后端服务器
cd server
npm run dev

# 启动前端应用
cd client
npm run dev
```

### 访问搜索页面
1. 登录系统
2. 导航到 `/search` 页面
3. 输入搜索条件
4. 点击 "Search Universities" 按钮
5. 查看搜索结果

### 添加示例数据
点击 "Add Sample Data" 按钮来添加示例大学数据到数据库。

## 5. API端点

### 大学搜索
- `GET /api/universities/search` - 搜索大学
- `GET /api/universities` - 获取所有大学
- `GET /api/universities/:id` - 获取特定大学
- `POST /api/universities/seed` - 添加示例数据

### 用户资料
- `GET /api/userprofile/me` - 获取当前用户资料
- `POST /api/userprofile` - 创建或更新用户资料

## 6. 数据同步特性

- **实时搜索**: 输入搜索条件后立即查询数据库
- **数据持久化**: 搜索条件可以保存到用户资料
- **错误处理**: 完整的错误处理和用户反馈
- **加载状态**: 显示加载状态提升用户体验
- **响应式设计**: 适配不同屏幕尺寸

## 7. 扩展功能

### 添加新的数据模型
1. 在 `server/models/` 创建新的模型文件
2. 在 `server/routes/` 创建对应的路由文件
3. 在 `client/src/services/api.js` 添加新的服务方法
4. 创建前端组件来使用新的API

### 添加新的搜索功能
1. 更新数据模型以支持新的搜索字段
2. 修改搜索API以处理新的查询参数
3. 更新前端表单以包含新的输入字段
4. 测试搜索功能

## 8. 故障排除

### 常见问题
1. **连接错误**: 检查MongoDB连接字符串
2. **认证错误**: 确保用户已登录
3. **CORS错误**: 检查后端CORS配置
4. **数据不显示**: 检查API响应格式

### 调试技巧
- 使用浏览器开发者工具查看网络请求
- 检查服务器控制台日志
- 验证MongoDB中的数据
- 测试API端点使用Postman或类似工具 