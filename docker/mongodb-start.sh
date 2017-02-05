
mongod | tee mongod.txt &
mongo-connector -m localhost:27017 -t localhost:9200 -d elastic2_doc_manager &
tail -f mongod.txt;
