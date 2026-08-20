"""
Directory Model - Database model for directory management
"""

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
    Boolean,
    BigInteger,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

import uuid
from app.config.database import Base


class Directory(Base):
    """Directory model for hierarchical folder structure"""

    __tablename__ = "directories"

    id = Column(String(26), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False, index=True)
    path = Column(String(1000), nullable=False, unique=True, index=True)
    parent_id = Column(
        String(26), ForeignKey("directories.id"), nullable=True, index=True
    )
    depth = Column(Integer, nullable=False, default=0, index=True)
    description = Column(Text, nullable=True)

    # Denormalized statistics for performance
    file_count = Column(Integer, nullable=False, default=0, index=True)
    total_size_bytes = Column(BigInteger, nullable=False, default=0)
    last_file_at = Column(DateTime(timezone=True), nullable=True, index=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)

    # Relationships
    parent = relationship("Directory", remote_side=[id], back_populates="children")
    children = relationship(
        "Directory", back_populates="parent", cascade="all, delete-orphan"
    )
    files = relationship(
        "File", back_populates="directory", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Directory(id={self.id.hex[:8]}..., name='{self.name}', path='{self.path}', depth={self.depth})>"

    @property
    def full_path(self):
        """Get the full path of this directory"""
        return self.path

    @property
    def is_root(self):
        """Check if this is a root directory"""
        return self.parent_id is None

    def get_ancestors(self):
        """Get all ancestor directories"""
        ancestors = []
        current = self.parent
        while current:
            ancestors.append(current)
            current = current.parent
        return ancestors[::-1]  # Return in order from root to parent

    def get_descendants(self):
        """Get all descendant directories"""
        descendants = []
        for child in self.children:
            descendants.append(child)
            descendants.extend(child.get_descendants())
        return descendants
