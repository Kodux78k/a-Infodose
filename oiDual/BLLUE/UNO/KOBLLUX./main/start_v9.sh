

#!/bin/bash


python rag/index_library.py


uvicorn api.main:app \

--host 0.0.0.0 \

--port 8000



