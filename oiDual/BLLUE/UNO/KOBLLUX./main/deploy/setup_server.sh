

#!/bin/bash


apt update


apt install -y \

python3-pip \
nginx \
git


pip install -r requirements.txt



systemctl restart nginx



echo "KOBLLUX SERVER ONLINE"


