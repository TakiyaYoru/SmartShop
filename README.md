npm i graphql graphql-yoga

npm install lodash @envelop/graphql-middleware

npm install mongoose dotenv

# Cài đặt migrate-mongo global
npm install -g migrate-mongo

# Cài đặt Jest và mongodb-memory-server
npm install --save-dev jest mongodb-memory-server

npm install bcrypt

npm install jsonwebtoken bcrypt

npm install express uuid



  curl http://localhost:4000/graphql \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg3NDc5MTgsImV4cCI6MTc0ODgzNDMxOH0.H8-5pjZVlx1T1F_Tx940EpciO-BHMG5Mk7mi6HZy1rY" \
  -F operations='{"query":"mutation ($file: Upload!) { uploadImage(file: $file) { success message filename url } }","variables":{"file":null}}' \
  -F map='{"0":["variables.file"]}' \
  -F 0=@\home\takiya\SmartShop\server\img\image_3.jpg

683bff348046303c5a404899

curl -X POST http://localhost:4000/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg3NDc5MTgsImV4cCI6MTc0ODgzNDMxOH0.H8-5pjZVlx1T1F_Tx940EpciO-BHMG5Mk7mi6HZy1rY" \
  -F operations='{"query":"mutation ($productId: ID!, $file: File!) { uploadProductImage(productId: $productId, file: $file) { success message filename url } }","variables":{"productId":"683bff348046303c5a404899","file":null}}' \
  -F map='{"0":["variables.file"]}' \
  -F 0=@/home/takiya/SmartShop/server/img/image_3.jpg

curl -X POST http://localhost:4000/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg3NDc5MTgsImV4cCI6MTc0ODgzNDMxOH0.H8-5pjZVlx1T1F_Tx940EpciO-BHMG5Mk7mi6HZy1rY" \
  -F operations='{"query":"mutation ($productId: ID!, $files: [File!]!) { uploadProductImages(productId: $productId, files: $files) { success message filename url } }","variables":{"productId":"683bff348046303c5a404899","files":[null]}}' \
  -F map='{"0":["variables.files.0"]}' \
  -F 0=@/home/takiya/SmartShop/server/img/image_3.jpg

  curl -X POST http://localhost:4000/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI2ODNiYzUzYzZiMjJhODk3N2I4YTc4ZmQiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ4NzQ3OTE4LCJleHAiOjE3NDg4MzQzMTh9.H8-5pjZVlx1T1F_Tx940EpciO-BHMG5Mk7mi6HZy1rY" \
  -F operations='{"query":"mutation ($productId: ID!, $files: [File!]!) { uploadProductImages(productId: $productId, files: $files) { success message filename url } }","variables":{"productId":"683bff348046303c5a404899","files":[null,null,null]}}' \
  -F map='{"0":["variables.files.0"],"1":["variables.files.1"],"2":["variables.files.2"]}' \
  -F 0=@/home/takiya/SmartShop/server/img/image_3.jpg \
  -F 1=@/home/takiya/SmartShop/server/img/image_3.jpg \
  -F 2=@/home/takiya/SmartShop/server/img/image_3.jpg

  # Test upload single image trước
curl -X POST http://localhost:4000/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg3NDc5MTgsImV4cCI6MTc0ODgzNDMxOH0.H8-5pjZVlx1T1F_Tx940EpciO-BHMG5Mk7mi6HZy1rY" \
  -F operations='{ "query": "mutation ($file: File!) { upload(file: $file) }", "variables": {"file": null} }' \
  -F map='{ "0": ["variables.file"] }' \
  -F 0=@/home/takiya/SmartShop/server/img/image_3.jpg

  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg3NDc5MTgsImV4cCI6MTc0ODgzNDMxOH0.H8-5pjZVlx1T1F_Tx940EpciO-BHMG5Mk7mi6HZy1rY

  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg3NjU4NDIsImV4cCI6MTc0ODg1MjI0Mn0.W5sW1e_2lUrYDN2XobF-1n2gPtTmu03B9TaM4uCRfOY

# Đăng nhập admin
  curl -X POST http://localhost:4000/ \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(input: {username: \"admin\", password: \"admin123\"}) { success message data { jwt } } }"}'

  curl -X POST http://localhost:4000/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg3NjU4NDIsImV4cCI6MTc0ODg1MjI0Mn0.W5sW1e_2lUrYDN2XobF-1n2gPtTmu03B9TaM4uCRfOY" \
  -F operations='{"query":"mutation ($productId: ID!, $files: [File!]!) { uploadProductImages(productId: $productId, files: $files) { success message filename url } }","variables":{"productId":"683bff348046303c5a404899","files":[null,null,null]}}' \
  -F map='{"0":["variables.files.0"],"1":["variables.files.1"],"2":["variables.files.2"]}' \
  -F 0=@/home/takiya/SmartShop/server/img/image_3.jpg \
  -F 1=@/home/takiya/SmartShop/server/img/image_3.jpg \
  -F 2=@/home/takiya/SmartShop/server/img/image_3.jpg


  #  upload mutile image 
     curl -X POST http://localhost:4000/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg3NjU4NDIsImV4cCI6MTc0ODg1MjI0Mn0.W5sW1e_2lUrYDN2XobF-1n2gPtTmu03B9TaM4uCRfOY" \
  -F operations='{"query":"mutation ($productId: ID!, $files: [File!]!) { uploadProductImages(productId: $productId, files: $files) { success message filename url } }","variables":{"productId":"683bc53c6b22a8977b8a7906","files":[null,null,null]}}' \
  -F map='{"0":["variables.files.0"],"1":["variables.files.1"],"2":["variables.files.2"]}' \
  -F 0=@/home/takiya/SmartShop/server/img/img.png \
  -F 1=@/home/takiya/SmartShop/server/img/img.png \
  -F 2=@/home/takiya/SmartShop/server/img/img.png


{"data":{"uploadProductImages":{"success":true,"message":"3 file(s) uploaded successfully for product","filename":"product_683bff348046303c5a404899_1748765866090_0_4fd206cd-f94a-4622-be49-19df06473a56.jpg, product_683bff348046303c5a404899_1748765866098_1_f46a6f86-60b5-4bb3-a56e-df7b11da2e04.jpg, product_683bff348046303c5a404899_1748765866104_2_6cab082f-42e2-4e04-8e0d-45fcf28088ec.jpg","url":"/img/product_683bff348046303c5a404899_1748765866090_0_4fd206cd-f94a-4622-be49-19df06473a56.jpg"}}}



npm install @apollo/client graphql react-router-dom @headlessui/react @heroicons/react tailwindcss postcss autoprefixer react-hot-toast lucide-react


sudo lsof -i :4000
sudo kill -9 $(sudo lsof -t -i :4000)

sudo docker ps -a
sudo docker ps
sudo docker start smartshop-db
sudo systemctl stop mongod