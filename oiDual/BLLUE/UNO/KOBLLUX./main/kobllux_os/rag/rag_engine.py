

from kobllux_os.memory.vector_memory import memory


class RAGEngine:


    def retrieve_before_generate(self,query):

        context=

        memory.retrieve(query)


        return {

        "query":query,

        "context":context,

        "instruction":
        "USE_CONTEXT_FIRST"

        }



rag=RAGEngine()


