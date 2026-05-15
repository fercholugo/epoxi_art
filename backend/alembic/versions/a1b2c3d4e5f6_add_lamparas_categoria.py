"""add lamparas to productcategoria enum

Revision ID: a1b2c3d4e5f6
Revises: 9a6d32c3002e
Create Date: 2026-05-15 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "9a6d32c3002e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE productcategoria ADD VALUE IF NOT EXISTS 'lamparas'")


def downgrade() -> None:
    # PostgreSQL does not support removing enum values; downgrade is a no-op
    pass
