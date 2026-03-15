from app.database import engine
from app.models import Base, User, UserRole
from sqlalchemy.orm import Session
from app import auth

def init_db():
    print("Dropping and recreating all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Create initial admin user
    db = Session(bind=engine)
    try:
        admin_user = User(
            username="admin",
            email="admin@brightcity.com",
            hashed_password=auth.get_password_hash("admin123"),
            role=UserRole.ADMIN
        )
        db.add(admin_user)
        
        # Also create a regular citizen for testing
        citizen_user = User(
            username="citizen",
            email="citizen@test.com",
            hashed_password=auth.get_password_hash("citizen123"),
            role=UserRole.CITIZEN
        )
        db.add(citizen_user)
        
        db.commit()
        print("Initial users created successfully!")
        print("Admin: admin / admin123")
        print("Citizen: citizen / citizen123")
    except Exception as e:
        print(f"Error creating users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
