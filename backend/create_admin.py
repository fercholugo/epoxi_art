"""Script para crear el usuario administrador inicial.

Uso:
    docker compose exec backend python create_admin.py
    docker compose exec backend python create_admin.py --email admin@epoxyart.co --password MiClave123
"""
import asyncio
import argparse
import sys

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.admin import Admin


async def create_admin(email: str, password: str) -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Admin).where(Admin.email == email))
        existing = result.scalar_one_or_none()

        if existing:
            print(f"⚠  Ya existe un admin con el email: {email}")
            print("   Para cambiar la contraseña, elimina el registro manualmente y vuelve a correr este script.")
            return

        admin = Admin(
            email=email,
            password_hash=get_password_hash(password),
            is_active=True,
        )
        db.add(admin)
        await db.commit()
        await db.refresh(admin)
        print(f"✓  Admin creado exitosamente")
        print(f"   Email:    {email}")
        print(f"   ID:       {admin.id}")
        print(f"   Acceso:   http://localhost/admin/login")


def main() -> None:
    parser = argparse.ArgumentParser(description="Crear usuario administrador de EpoxyArt")
    parser.add_argument("--email", default="admin@epoxyart.co", help="Email del admin")
    parser.add_argument("--password", default=None, help="Contraseña del admin")
    args = parser.parse_args()

    if not args.password:
        import getpass
        args.password = getpass.getpass("Contraseña para el admin: ")
        confirm = getpass.getpass("Confirmar contraseña: ")
        if args.password != confirm:
            print("❌  Las contraseñas no coinciden")
            sys.exit(1)

    if len(args.password) < 8:
        print("❌  La contraseña debe tener al menos 8 caracteres")
        sys.exit(1)

    asyncio.run(create_admin(args.email, args.password))


if __name__ == "__main__":
    main()
