from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import chat_bot, chat_bot_files, user
from config.mongodb import init_db
from utils.exception import CustomExceptionHandler
from utils.helper import create_super_admin
from utils.jwt import JwtMiddleware

app = FastAPI(
    swagger_ui_parameters={"displayRequestDuration": True},
    openapi_url="/openapi.json",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

exempt_routes=[
    "/",
    "/health",
    "/docs",
    "/docs/",
    "/openapi.json",
    "/user/login",
    "/user/register",
    "/user/verify-email",
    "/user/reset-password",
    "/chat-bot/chat",
]

app.add_middleware(CustomExceptionHandler)
app.add_middleware(JwtMiddleware,exempt_routes=exempt_routes)
 

init_db()
create_super_admin()

@app.get("/")
async def root():
    return {"status": "ok"}

@app.get("/health")
async def healthCheck():
    return "Ok"

app.include_router(chat_bot.router,
    prefix="/chat-bot",
    tags=["ChatBot"])

app.include_router(user.router,
    prefix="/user",
    tags=["User"])

app.include_router(chat_bot_files.router,
    prefix="/files",
    tags=["Files"])

 



