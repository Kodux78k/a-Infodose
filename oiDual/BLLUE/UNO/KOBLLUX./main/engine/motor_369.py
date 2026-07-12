

from search.library_indexer import LibraryIndexer
from search.context_search import ContextSearch
from context.context_builder import ContextBuilder



class Motor369:


    def execute(self,question):


        index=LibraryIndexer()

        index.scan()

        index.save()


        search=ContextSearch()

        search.load()


        docs=search.search(
        question
        )


        context=ContextBuilder()


        return context.build(
        question,
        docs
        )



if __name__=="__main__":

    motor=Motor369()

    print(
    motor.execute(
    "KOBLLUX"
    )
    )


