

from chromadb.database import search_memory



class RAGRetriever:


    def retrieve(
        self,
        question
    ):


        result = search_memory(

            question

        )


        return {


            "documents":

            result.get(

                "documents",

                []

            )

        }



