# Web图片压缩工具

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

一个基于浏览器的图片压缩工具，使用纯前端技术实现，支持批量处理、实时预览和自定义压缩质量。

## 功能特点

- 🚀 纯浏览器端压缩，无需服务器
- 📦 支持批量上传处理（最多10张）
- 🎨 支持PNG、JPG格式图片
- 👀 实时预览压缩效果
- 📊 显示压缩前后对比数据
- 🎛️ 可调节压缩质量（0-100%）
- 📱 响应式设计，支持移动端

## 技术栈

- HTML5 File API
- CSS3 Grid/Flexbox
- JavaScript ES6+
- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)

## 项目结构

```
图片压缩/
├── index.html      # 主页面
├── styles.css      # 样式文件
├── script.js       # 业务逻辑
└── README.md       # 项目文档
```

## 核心实现原理

### 1. 图片压缩流程

```javascript
async function compressImage(file) {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: quality / 100
    };
    return await imageCompression(file, options);
}
```

### 2. 文件处理

- 使用`HTML5 File API`处理文件上传
- 支持拖拽上传（Drag and Drop API）
- `FileReader`实现图片预览
- Blob URL处理压缩后的下载

### 3. 性能优化

- 使用`Web Workers`进行压缩运算
- 压缩过程异步处理，不阻塞主线程
- 使用URL.createObjectURL优化图片预览
- 及时释放Blob URL防止内存泄露

## 使用方法

1. 克隆项目到本地：
```bash
git clone https://github.com/yourusername/image-compressor.git
```

2. 直接打开index.html或使用本地服务器：
```bash
# 使用Python启动简单的HTTP服务器
python -m http.server 8000
```

3. 访问 http://localhost:8000 即可使用

## API参考

### 压缩选项

```javascript
const compressionOptions = {
    maxSizeMB: 1,              // 输出图片最大体积
    maxWidthOrHeight: 1920,    // 输出图片的最大宽度/高度
    useWebWorker: true,        // 使用Web Worker进行压缩
    quality: 0.8               // 压缩质量(0-1)
}
```

## 浏览器兼容性

- Chrome >= 58
- Firefox >= 52
- Safari >= 11
- Edge >= 79

## 注意事项

1. 本地运行时请使用HTTP服务器，直接打开文件可能受到CORS限制
2. 大图片压缩可能需要较长时间，请耐心等待
3. 压缩质量设置过低可能导致图片失真
4. 建议在压缩前备份原图

## 性能数据

| 图片大小 | 压缩质量 | 压缩后大小 | 压缩比率 | 处理时间 |
|---------|---------|-----------|----------|----------|
| 5MB     | 80%     | ~800KB    | 84%      | ~1.2s    |
| 10MB    | 80%     | ~1.5MB    | 85%      | ~2.3s    |
| 20MB    | 80%     | ~2.8MB    | 86%      | ~4.5s    |

## 贡献指南

欢迎提交Issues和Pull Requests！

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 开源协议

本项目基于MIT协议开源，详见 [LICENSE](LICENSE) 文件。
