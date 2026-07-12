

class PluginManager:


    def __init__(self):

        self.plugins=[]



    def register(self,plugin):

        self.plugins.append(plugin)



    def list(self):

        return self.plugins



plugins=PluginManager()


