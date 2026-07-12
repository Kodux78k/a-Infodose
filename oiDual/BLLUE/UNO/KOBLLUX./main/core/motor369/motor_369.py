

import json
from datetime import datetime


class Motor369:


    def __init__(self):

        self.ciclo = {

            "3":"captar",
            "6":"integrar",
            "9":"expandir"

        }



    def organizar_contexto(self,data):

        return {

            "timestamp":
            datetime.now().isoformat(),

            "entrada":
            data,

            "estado":
            "organizado"

        }



    def executar(self,input):

        contexto=self.organizar_contexto(input)

        return contexto



if __name__=="__main__":

    motor=Motor369()

    print(

        motor.executar(
            "KOBLLUX"
        )

    )


