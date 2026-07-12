

import os
import importlib



class PluginManager:



    def __init__(self):

        self.plugins=[]



    def load(self):


        path="plugins"



        for file in os.listdir(path):


            if file.endswith(".py") and file!="manager.py":


                module=importlib.import_module(

                    f"plugins.{file[:-3]}"

                )


                self.plugins.append(module)



        return self.plugins



