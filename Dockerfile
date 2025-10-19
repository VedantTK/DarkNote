FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /usr/src/app

# system deps
RUN apt-get update && apt-get install -y build-essential libpq-dev gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy app
COPY . .

EXPOSE 8000

# At container start, gunicorn runs (configured in docker-compose)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app", "--workers", "2"]
