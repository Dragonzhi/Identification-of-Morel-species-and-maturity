# app.py
from flask import Flask, request, jsonify, send_file, render_template
import cv2
import numpy as np
import os
from werkzeug.utils import secure_filename
from PIL import Image
from ultralytics import YOLO
from pathlib import Path

app = Flask(__name__, static_folder='.', template_folder='')

# === 配置 ===
# 获取当前文件所在目录
BASE_DIR = Path(__file__).parent

# 使用相对路径
UPLOAD_FOLDER = BASE_DIR / 'uploads'
PROCESSED_FOLDER = BASE_DIR / 'processed'
MODEL_PATH_TYPE = BASE_DIR / 'model/type/best.pt'
MODEL_PATH_MATURITY = BASE_DIR / 'model/maturity/best.pt'

# 确保目录存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
# 允许的文件扩展名
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# === 模型路径配置 ===
# 请确保这些路径下真实存在模型文件
MODEL_PATH_TYPE = 'model/type/best.pt'          # 种类检测
MODEL_PATH_MATURITY = 'model/maturity/best.pt'  # 成熟度检测

# 全局变量存储模型
model_type = None
model_maturity = None

# === 模型加载函数 ===
def load_models():
    global model_type, model_maturity
    print("正在加载模型...")
    
    # 1. 加载种类检测模型
    if os.path.exists(MODEL_PATH_TYPE):
        try:
            model_type = YOLO(MODEL_PATH_TYPE)
            print(f"种类检测模型加载成功: {MODEL_PATH_TYPE}")
        except Exception as e:
            print(f"种类模型加载失败: {e}")
    else:
        print(f"警告: 找不到种类模型文件 {MODEL_PATH_TYPE}")

    # 2. 加载成熟度检测模型
    if os.path.exists(MODEL_PATH_MATURITY):
        try:
            model_maturity = YOLO(MODEL_PATH_MATURITY)
            print(f"成熟度检测模型加载成功: {MODEL_PATH_MATURITY}")
        except Exception as e:
            print(f"成熟度模型加载失败: {e}")
    else:
        print(f"警告: 找不到成熟度模型文件 {MODEL_PATH_MATURITY}")

# 启动时加载模型
load_models()

def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# === 核心处理逻辑 ===
def process_image(image_path, model):
    if model is None:
        raise Exception("模型未加载，无法执行检测。")
        
    # 推理
    results_list = model(image_path)
    results = results_list[0]
    
    # 绘图
    rendered_img_bgr = results.plot()
    
    # 颜色转换 BGR -> RGB
    try:
        rendered_img_rgb = cv2.cvtColor(rendered_img_bgr, cv2.COLOR_BGR2RGB)
    except Exception:
        rendered_img_rgb = rendered_img_bgr

    # 保存结果图
    filename = os.path.basename(image_path)
    processed_filename = os.path.join(PROCESSED_FOLDER, filename)
    Image.fromarray(rendered_img_rgb).save(processed_filename)
    
    # 提取数据
    detection_list = []
    if results.boxes:
        boxes_data = results.boxes.data.cpu().numpy()
        for box in boxes_data:
            x_min, y_min, x_max, y_max, confidence, class_id = box[:6]
            # 获取类别名称
            class_name = model.names.get(int(class_id), str(int(class_id)))
            
            detection_list.append({
                'class': class_name,
                'confidence': float(confidence),
                'box': [float(x_min), float(y_min), float(x_max), float(y_max)]
            })

    return processed_filename, detection_list

# === 路由定义 ===

@app.route('/')
def index():
    # 直接渲染 templates/index.html
    # return render_template('index.html')
    return send_file('index.html')

# 种类检测 API
@app.route('/detect', methods=['POST'])
def detect_type():
    return handle_detection(request, model_type, "种类检测")

# 成熟度检测 API
@app.route('/detect_maturity', methods=['POST'])
def detect_maturity():
    return handle_detection(request, model_maturity, "成熟度检测")

# 通用检测处理函数（避免代码重复）
def handle_detection(req, model, task_name):
    if 'image' not in req.files:
        return jsonify({'error': '没有上传图片'}), 400
    
    file = req.files['image']
    if file.filename == '':
        return jsonify({'error': '未选择文件'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        try:
            if model is None:
                return jsonify({'error': f'{task_name}模型未加载，请检查服务器配置'}), 500
                
            processed_path, detections = process_image(filepath, model)
            
            return jsonify({
                'success': True,
                'detections': detections,
                # 返回前端可访问的图片URL
                'processed_image': f'/processed/{filename}'
            })
        except Exception as e:
            print(f"Error in {task_name}: {e}")
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': '文件类型不支持'}), 400

# 图片服务路由
@app.route('/processed/<filename>')
def get_processed_image(filename):
    return send_file(os.path.join(PROCESSED_FOLDER, filename))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)