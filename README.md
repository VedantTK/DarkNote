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

## Create a Kubernetes Secret from your .env file
    kubectl -n flask-demo create secret generic flask-env --from-env-file=.env


## Run
Build and start:
```bash
docker compose up --build
# or docker-compose up --build
```
## Run
K8S Deployment:
```bash
kubectl create namespace flask-demo
kubectl -n flask-demo create secret generic flask-env --from-env-file=.env
```

## Install the CloudNativePG Operator
```bash
kubectl create namespace cnpg-system

helm repo add cnpg https://cloudnative-pg.github.io/charts
helm repo update

helm install cnpg \
  cnpg/cloudnative-pg \
  --namespace cnpg-system

kubectl get pods -n cnpg-system

kubectl apply -f cnpg-cluster.yml

kubectl get clusters -n flask-demo

kubectl get pods -n flask-demo -l cnpg.io/cluster=flask-db
```

