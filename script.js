/**
 * 图片压缩工具的主要功能实现
 */

// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalInfo = document.getElementById('originalInfo');
const compressedInfo = document.getElementById('compressedInfo');
const downloadBtn = document.getElementById('downloadBtn');
const imageList = document.getElementById('imageList');
const MAX_IMAGES = 10;
let processingImages = new Map(); // 存储正在处理的图片

let originalImage = null;
let compressedImage = null;

// 事件监听器
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#007AFF';
});
dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#007AFF';
});
dropZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
qualitySlider.addEventListener('input', updateQualityValue);
downloadBtn.addEventListener('click', downloadCompressedImage);

/**
 * 处理拖放文件
 * @param {DragEvent} e 
 */
function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processMultipleImages(files);
}

/**
 * 处理文件选择
 * @param {Event} e 
 */
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processMultipleImages(files);
}

/**
 * 更新质量显示值
 */
function updateQualityValue() {
    qualityValue.textContent = `${qualitySlider.value}%`;
    if (originalImage) {
        compressImage(originalImage);
    }
}

/**
 * 处理多个图片
 * @param {File[]} files 
 */
function processMultipleImages(files) {
    // 过滤出图片文件
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // 限制数量
    if (imageFiles.length > MAX_IMAGES) {
        alert(`一次最多只能上传${MAX_IMAGES}张图片`);
        return;
    }
    
    // 清空之前的列表
    imageList.innerHTML = '';
    
    // 处理每个图片
    imageFiles.forEach((file, index) => {
        createImageItem(file, index);
    });
}

/**
 * 创建图片项
 * @param {File} file 
 * @param {number} index 
 */
function createImageItem(file, index) {
    const itemId = `image-${Date.now()}-${index}`;
    const html = `
        <div class="image-item" id="${itemId}">
            <div class="preview-container">
                <div class="preview-box">
                    <h3>原图</h3>
                    <div class="image-preview original-preview"></div>
                </div>
                <div class="preview-box">
                    <h3>压缩后</h3>
                    <div class="image-preview compressed-preview"></div>
                </div>
            </div>
            <div class="image-info">
                <div class="image-name">${file.name}</div>
                <div class="file-size">原始大小: ${formatFileSize(file.size)}</div>
                <div class="compression-progress">等待压缩...</div>
            </div>
            <div class="image-actions">
                <button class="action-btn download-btn" disabled>下载</button>
            </div>
        </div>
    `;
    
    imageList.insertAdjacentHTML('beforeend', html);
    const imageItem = document.getElementById(itemId);
    
    // 显示原图预览
    displayImage(file, imageItem.querySelector('.original-preview'));
    
    // 开始压缩
    compressImageItem(file, imageItem);
}

/**
 * 压缩单个图片项
 * @param {File} file 
 * @param {HTMLElement} imageItem 
 */
async function compressImageItem(file, imageItem) {
    const progressEl = imageItem.querySelector('.compression-progress');
    const compressedPreview = imageItem.querySelector('.compressed-preview');
    const fileSizeEl = imageItem.querySelector('.file-size');
    const downloadBtn = imageItem.querySelector('.download-btn');
    
    try {
        progressEl.textContent = '压缩中...';
        
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            quality: qualitySlider.value / 100
        };

        const compressedFile = await imageCompression(file, options);
        
        // 显示压缩后的预览
        displayImage(compressedFile, compressedPreview);
        
        // 更新文件大小信息
        fileSizeEl.textContent = `原始大小: ${formatFileSize(file.size)} | 压缩后: ${formatFileSize(compressedFile.size)}`;
        
        // 更新进度
        const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
        progressEl.textContent = `压缩完成，节省了 ${compressionRatio}% 的空间`;
        
        // 启用下载按钮
        downloadBtn.disabled = false;
        downloadBtn.onclick = () => downloadCompressedFile(compressedFile, file.name);
        
    } catch (error) {
        console.error('压缩失败:', error);
        progressEl.textContent = '压缩失败';
    }
}

/**
 * 下载压缩后的文件
 * @param {File} compressedFile 
 * @param {string} originalName 
 */
function downloadCompressedFile(compressedFile, originalName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedFile);
    link.download = `compressed_${originalName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 显示图片预览
 * @param {File} file 
 * @param {HTMLElement} container 
 */
function displayImage(file, container) {
    const reader = new FileReader();
    reader.onload = (e) => {
        container.innerHTML = `<img src="${e.target.result}" alt="预览图片">`;
    };
    reader.readAsDataURL(file);
}

/**
 * 格式化文件大小
 * @param {number} bytes 
 * @returns {string}
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 下载压缩后的图片
 */
function downloadCompressedImage() {
    if (!compressedImage) return;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedImage);
    link.download = `compressed_${originalImage.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
} 