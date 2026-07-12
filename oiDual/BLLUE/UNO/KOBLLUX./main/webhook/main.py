from fastapi import FastAPI
from .whatsapp import router

app = FastAPI(
    title="KOBLLUX WhatsApp Gateway",
    version="V5"
)

app.include_router(router)

@app.get("/health")
def health():
    return {
        "online": True,
        "system": "KOBLLUX"
    }

@app.get("/status")
def status():
    return {
        "online": True,
        "projeto": "Kobllux Infodose",
        "vibração": "🌀🕳️💠"
    }
