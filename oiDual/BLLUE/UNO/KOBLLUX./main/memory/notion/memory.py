

import os
import requests



class NotionMemory:



    def __init__(self):

        self.token=os.getenv(
        "NOTION_TOKEN"
        )

        self.database=os.getenv(
        "NOTION_DATABASE_ID"
        )



    def save(
    self,
    usuario,
    mensagem,
    resposta,
    arquétipo="detectando"
    ):


        url = (

        "https://api.notion.com/v1/pages"

        )


        payload={


        "parent":{

        "database_id":
        self.database

        },


        "properties":{


        "Usuário":{

        "title":[{

        "text":{

        "content":usuario

        }

        }]

        },


        "Mensagem":{

        "rich_text":[{

        "text":{

        "content":mensagem

        }

        }]

        },


        "Resposta":{

        "rich_text":[{

        "text":{

        "content":resposta

        }

        }]

        },


        "Arquétipo":{

        "rich_text":[{

        "text":{

        "content":arquétipo

        }

        }]

        }



        }


        }


        headers={


        "Authorization":

        f"Bearer {self.token}",


        "Notion-Version":

        "2022-06-28"


        }


        return requests.post(

        url,

        json=payload,

        headers=headers

        )



