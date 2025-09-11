# 大学数据前端显示设置指南

## 概述

这个指南将帮助你设置后端大学数据在前端 Search.jsx 页面的显示。

## 步骤 1: 确保后端服务器运行

```bash
cd server
npm run dev
```

## 步骤 2: 添加示例大学数据到数据库

```bash
cd server
npm run seed
```

或者手动运行：
```bash
node scripts/seedUniversities.js
```

## 步骤 3: 验证数据是否添加成功

```bash
cd server
node test-connection.js
```

你应该看到类似这样的输出：
```
✅ Connected to MongoDB successfully
📊 Found 5 universities in database

📋 Sample universities:
1. Harvard University - Cambridge, Massachusetts
   Majors: Computer Science, Business Administration
2. Stanford University - Stanford, California
   Majors: Computer Science, Engineering
3. MIT (Massachusetts Institute of Technology) - Cambridge, Massachusetts
   Majors: Computer Science and Engineering, Mechanical Engineering
```

## 步骤 4: 启动前端应用

```bash
cd client
npm run dev
```

## 步骤 5: 访问搜索页面

打开浏览器访问 `http://localhost:5173/search`

你应该能看到：
- 页面加载时自动显示从数据库获取的大学数据
- 显示消息："Loaded 5 universities from database."
- 每个大学卡片显示：
  - 大学名称
  - 专业名称（第一个专业）
  - 位置（城市，省份）
  - 学费信息
  - 匹配度（随机生成）
  - 是否为新项目（随机生成）

## 数据转换说明

前端会自动将后端数据转换为显示格式：

### 后端数据格式：
```javascript
{
  _id: "...",
  name: "Harvard University",
  city: "Cambridge",
  province: "Massachusetts",
  majors: [
    {
      name: "Computer Science",
      acceptanceRate: "5.2%",
      avgGPA: "3.9",
      // ...
    }
  ],
  tuition: {
    domestic: "$54,768",
    international: "$54,768"
  },
  // ...
}
```

### 前端显示格式：
```javascript
{
  _id: "...",
  program: "Computer Science",        // 第一个专业名称
  university: "Harvard University",   // 大学名称
  location: "Cambridge, Massachusetts", // 城市, 省份
  cost: "$54,768",                   // 学费
  match: 85,                         // 随机匹配度 (70-100)
  isNew: true,                       // 随机是否为新项目
  website: "https://www.harvard.edu", // 网站链接
  // ... 其他数据
}
```

## 故障排除

### 问题 1: 页面显示 "Failed to load universities"
**解决方案：**
1. 确保后端服务器正在运行
2. 检查数据库连接
3. 运行 `node test-connection.js` 验证数据

### 问题 2: 页面显示示例数据而不是数据库数据
**解决方案：**
1. 运行 `npm run seed` 添加数据
2. 检查 API 端点是否正确
3. 检查网络请求是否有错误

### 问题 3: 数据库连接失败
**解决方案：**
1. 确保 MongoDB 正在运行
2. 检查连接字符串
3. 检查环境变量设置

## API 端点

- `GET /api/universities` - 获取所有大学
- `POST /api/universities` - 添加新大学
- `GET /api/universities/:id` - 获取特定大学
- `PUT /api/universities/:id` - 更新大学
- `DELETE /api/universities/:id` - 删除大学

## 搜索功能

搜索功能支持以下过滤条件：
- 专业名称
- 国家/省份
- 城市
- 学费范围
- 其他条件

搜索会调用 `GET /api/universities` 端点并传递查询参数。


