

import chromadb


client = chromadb.PersistentClient(
    path="./chromadb/data"
)



collection = client.get_or_create_collection(

    name="kobllux_memory"

)



def save_memory(
    text,
    metadata=None
):


    collection.add(

        documents=[text],

        metadatas=[metadata or {}],

        ids=[str(hash(text))]

    )




def search_memory(
    query,
    limit=5
):


    result = collection.query(

        query_texts=[query],

        n_results=limit

    )


    return result



