

import os
import json



class TLLibrary:


    def __init__(self,path="TL_LIBRARY"):

        self.path=path



    def buscar(self,termo):


        resultados=[]


        for root,dirs,files in os.walk(
            self.path
        ):


            for file in files:


                if termo.lower() in file.lower():

                    resultados.append(

                        os.path.join(
                            root,
                            file
                        )

                    )


        return resultados



    def listar(self):

        arquivos=[]


        for root,dirs,files in os.walk(
            self.path
        ):

            for f in files:

                arquivos.append(
                    os.path.join(
                        root,
                        f
                    )
                )


        return arquivos



