import httpx
from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/whatsapp")
async def whatsapp(request: Request):
    data = await request.form()
    user = data.get("From")
    message = data.get("Body")
    
    # A Ponte: O Ouvido entrega a intenção ao Cérebro (Porta 8000)
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8000/core",
                json={"message": message},
                timeout=30.0
            )
            brain = response.json()
            infodose = brain.get("response", "O vórtice está processando...")
        except Exception as e:
            infodose = f"Silêncio temporário no núcleo: {str(e)}"

    # O Retorno (Ainda em modo escuta, pronto para a Twilio enviar de volta)
    return {
        "user": user,
        "received": message,
        "kobllux_says": infodose
    }
