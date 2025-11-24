import argparse
from app import app, db
from app import DetectionHistory  # 导入数据库模型

def list_records():
    """列出所有记录"""
    with app.app_context():
        records = DetectionHistory.query.all()
        if not records:
            print("数据库中没有记录")
            return
            
        print(f"共有 {len(records)} 条记录:")
        for record in records:
            print(f"ID: {record.id}, 类型: {record.type}, 文件名: {record.filename}, 时间: {record.timestamp}")

def delete_record(record_id):
    """删除指定ID的记录"""
    with app.app_context():
        record = DetectionHistory.query.get(record_id)
        if not record:
            print(f"错误: ID为 {record_id} 的记录不存在")
            return
            
        try:
            db.session.delete(record)
            db.session.commit()
            print(f"成功删除ID为 {record_id} 的记录")
        except Exception as e:
            db.session.rollback()
            print(f"删除失败: {str(e)}")

def clear_database(confirm=False):
    """清空数据库所有记录"""
    if not confirm:
        # 二次确认防止误操作
        response = input("确定要清空所有记录吗? 此操作不可恢复! (输入 'yes' 确认): ")
        if response.lower() != 'yes':
            print("操作已取消")
            return
            
    with app.app_context():
        try:
            # 查询并删除所有记录
            num_records = DetectionHistory.query.count()
            DetectionHistory.query.delete()
            db.session.commit()
            print(f"成功清空数据库，共删除 {num_records} 条记录")
        except Exception as e:
            db.session.rollback()
            print(f"清空失败: {str(e)}")

if __name__ == "__main__":
    # 设置命令行参数
    parser = argparse.ArgumentParser(description='羊肚菌检测系统数据库操作工具')
    parser.add_argument('--list', action='store_true', help='列出所有记录')
    parser.add_argument('--delete', type=int, help='删除指定ID的记录')
    parser.add_argument('--clear', action='store_true', help='清空所有记录')
    parser.add_argument('--force', action='store_true', help='强制清空，无需确认')
    
    args = parser.parse_args()
    
    # 执行相应操作
    if args.list:
        list_records()
    elif args.delete:
        delete_record(args.delete)
    elif args.clear:
        clear_database(args.force)
    else:
        parser.print_help()
