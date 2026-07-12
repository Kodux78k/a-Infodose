

from core.tl_library.library 
import TLLibrary
from core.memory.fractal_memory import FractalMemory



class RetrievalEngine:



    def __init__(self):

        self.library=TLLibrary()

        self.memory=FractalMemory()



    def retrieve(self,query):


        return {

            "library":

            self.library.buscar(
                query
            ),


            "memory":

            self.memory.recall()

        }



