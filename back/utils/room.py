from nanoid.generate import generate
from sqlalchemy.orm import Session

from models.room import Room


def generate_join_code(length: int = 6) -> str:
    """
    Génère un code aléatoire en utilisant nanoid.
    """
    alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return generate(alphabet, length)

def get_unique_join_code(db: Session, length: int = 6) -> str:
    """
    Génère un code de join unique en vérifiant dans la base de données.
    """
    while True:
        code = generate_join_code(length)
        if not db.query(Room).filter(Room.join_code == code, Room.close == 0).first():
            return code