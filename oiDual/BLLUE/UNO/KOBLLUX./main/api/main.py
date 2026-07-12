

from fastapi import FastAPI
from pydantic import BaseModel

from agents.operator_agent import KoblluxAgent



app = FastAPI(

title="KOBLLUX OPERATOR API",

version="V8"

)



agent=KoblluxAgent()



class Query(BaseModel):

    message:str



@app.get("/health")
def health():

    return {

        "online":True,

        "system":
        "KOBLLUX OPERATOR",

        "version":
        "V8"

    }



@app.post("/core")
def core(
    query:Query
):

    response=agent.execute(

        query.message

    )


    return response



@app.get("/status")
def status():

    return {

        "online":True,

        "projeto":
        "KOBLLUX",

        "motor":
        "369",

        "memory":
        "VECTOR"

    }



