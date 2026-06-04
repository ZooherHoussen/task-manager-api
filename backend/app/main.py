from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, tasks
from alembic.config import Config
from alembic import command

def run_migrations():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")

run_migrations()

app = FastAPI(
    title="Task Manager API",
    description="Fullstack task manager — FastAPI + React + PostgreSQL",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://task-manager-api-three.vercel.app",
        "https://task-manager-api-git-main-zooher-houssen-s-projects.vercel.app",
        "https://task-manager-5ylstvbrb-zooher-houssen-s-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)

@app.get("/")
def root():
    return {"message": "Task Manager API is running"}