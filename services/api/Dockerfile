# Production Dockerfile for Katiba BookBackend API
FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    curl \
    wget \
    gnupg \
    ca-certificates \
    libnss3 \
    libglib2.0-0 \
    libgtk-3-0 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libcairo2 \
    libpango-1.0-0 \
    libjpeg62-turbo \
    libpng16-16 \
    fonts-liberation \
    tesseract-ocr \
    tesseract-ocr-eng \
    libtesseract-dev \
    libgl1 \
    # PostgreSQL development libraries for psycopg2
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
# Install in smaller batches to avoid timeouts
RUN pip install --upgrade pip --timeout 120 --retries 5

# Install core dependencies first
RUN pip install --no-cache-dir --timeout 120 --retries 5 \
    fastapi==0.135.1 \
    uvicorn[standard]==0.41.0 \
    gunicorn==23.0.0 \
    python-multipart==0.0.22

# Install database dependencies
RUN pip install --no-cache-dir --timeout 120 --retries 5 \
    sqlalchemy==2.0.48 \
    alembic==1.15.1 \
    psycopg2-binary==2.9.11 \
    asyncpg==0.30.0

# Install remaining dependencies
RUN pip install --no-cache-dir --timeout 300 --retries 5 -r requirements.txt

# Install Playwright browsers
RUN python -m playwright install chromium firefox webkit

# Copy project
COPY app/ ./app/
COPY alembic/ ./alembic/
COPY alembic.ini .
COPY scripts/ ./scripts/

# Create runtime directories
RUN mkdir -p _data/logs _data/uploads _data/extraction _data/pdf _data/output

# Create non-root user
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app

USER app

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
 CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

# Start server
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]