# DarkNote

## Prereqs
- Docker & Docker Compose installed
- Copy `.env.example` to `.env` and set values (SECRET_KEY, DB credentials, etc.)

# .env 
    FLASK_ENV=production
    FLASK_DEBUG=0
    SECRET_KEY=<your-key>
    POSTGRES_USER=flaskuser
    POSTGRES_PASSWORD=flaskpassword
    POSTGRES_DB=flaskdb
    POSTGRES_HOST=db
    POSTGRES_PORT=5432
    DATABASE_URL=postgresql://flaskuser:flaskpassword@db:5432/flaskdb

## Run
Build and start:
```bash
docker compose up --build
# or docker-compose up --build
```
## Run
Build and start:
```bash
kubectl create namespace flask-demo
kubectl -n flask-demo create secret generic flask-env --from-env-file=.env
```
