# start.py - 快速启动脚本
import os
import sys
import webbrowser
from threading import Timer

def check_dependencies():
    try:
        import flask
        import cv2
        import numpy as np
        from PIL import Image
        from ultralytics import YOLO
        print("✓ 所有依赖已安装")
        return True
    except ImportError as e:
        print(f"✗ 缺少依赖: {e}")
        print("请运行: pip install -r requirements.txt")
        return False

def open_browser():
    """在服务器启动后自动打开浏览器"""
    Timer(2.5, lambda: webbrowser.open('http://127.0.0.1:5000')).start()

def main():
    print("=== 羊肚菌智能检测系统启动器 ===")
    
    # 检查依赖
    if not check_dependencies():
        sys.exit(1)
    
    # 检查模型文件
    model_files = [
        'model/type/best.pt',
        'model/maturity/best.pt'
    ]
    
    missing_models = []
    for model_file in model_files:
        if not os.path.exists(model_file):
            missing_models.append(model_file)
    
    if missing_models:
        print("⚠ 警告: 以下模型文件不存在:")
        for model in missing_models:
            print(f"  - {model}")
        print("系统将继续运行，但相关检测功能将不可用")
    
    # 创建必要目录
    directories = ['uploads', 'processed', 'static/css', 'static/js', 'templates']
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✓ 创建目录: {directory}")
    
    # 启动服务器
    print("🚀 启动Flask服务器...")
    try:
        from app import app
        open_browser()
        app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()