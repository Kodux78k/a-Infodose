

from orchestrator.orchestrator import Orchestrator
from memory.memory_sync import MemorySync
from memory.tl_library import TLLibrary
from plugins.plugin_manager import PluginManager



class KoblluxKernelV11:


    def __init__(self):

        self.orchestrator=Orchestrator()

        self.memory=MemorySync()

        self.library=TLLibrary()

        self.plugins=PluginManager()



    def boot(self):

        return {


        "status":

        "ONLINE",


        "library":

        len(
            self.library.scan()
        ),


        "plugins":

        self.plugins.discover()

        }



