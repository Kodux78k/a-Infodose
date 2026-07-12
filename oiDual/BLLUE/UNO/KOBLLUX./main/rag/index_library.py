

from rag.tl_library import TLLibrary

from chromadb.database import save_memory



library=TLLibrary()



for file in library.scan():


    save_memory(

        file,

        {

        "source":
        file

        }

    )



print(

"TL_LIBRARY INDEXADA"

)



