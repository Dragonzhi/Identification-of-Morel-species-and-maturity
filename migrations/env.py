from __future__ import with_statement

import logging
from logging.config import fileConfig

from flask import current_app

from alembic import context

# 这是 Alembic 配置对象，用于获取/设置配置选项
config = context.config

# 解释配置文件用于 Python 日志记录
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

# 添加你的模型的 MetaData 对象
config.set_main_option(
    'sqlalchemy.url',
    str(current_app.extensions['migrate'].db.engine.url).replace('%', '%%')
)
target_metadata = current_app.extensions['migrate'].db.metadata

# 其他迁移配置...
def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')

    connectable = current_app.extensions['migrate'].db.engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            process_revision_directives=process_revision_directives,
            **current_app.extensions['migrate'].configure_args
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
