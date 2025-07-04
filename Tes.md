Bước 1: Login để lấy JWT token
```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(input: { username: \"admin\", password: \"admin123\" }) { success message data { jwt user { username role } } } }"
  }'
```

"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg4MzQzNDMsImV4cCI6MTc0ODkyMDc0M30.V3kIzsCZ7xyT2Np3-vcC6oTiwMHOwTy0roS7b14_uBU"

Bước 2: Tạo Brand (cần JWT token)
```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg4MzQzNDMsImV4cCI6MTc0ODkyMDc0M30.V3kIzsCZ7xyT2Np3-vcC6oTiwMHOwTy0roS7b14_uBU" \
  -d '{
    "query": "mutation { createBrand(input: { name: \"Apple2\", description: \"Technology company from Cupertino\", website: \"https://apple.com\", country: \"USA\", foundedYear: 1976 }) { _id name slug description } }"
  }'
```

Bước 3: Lấy danh sách Brands
```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { allBrands { _id name slug description website country foundedYear } }"
  }'
```

{"data":{"allBrands":[{"_id":"683d18483b3473c4cdeebf41","name":"Apple2","slug":"apple2","description":"Technology company from Cupertino","website":"https://apple.com","country":"USA","foundedYear":1976}]}}


Bước 4: Lấy danh sách Categories
```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { allCategories { _id name description } }"
  }'
```

{"data":{"allCategories":[{"_id":"683c867ecab16dbe99245c85","name":"Ăn trưa tại phòng"

Bước 5: Tạo Product với Brand (cần JWT + Brand ID + Category ID)
```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZCIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg4MzQzNDMsImV4cCI6MTc0ODkyMDc0M30.V3kIzsCZ7xyT2Np3-vcC6oTiwMHOwTy0roS7b14_uBU" \
  -d '{
    "query": "mutation { createProduct(input: { name: \"iPhone 15 Pro\", description: \"Latest iPhone model\", price: 25000000, sku: \"IPHONE15PRO-001\", stock: 10, brand: \"683d18483b3473c4cdeebf41\", category: \"683c867ecab16dbe99245c85\" }) { _id name price sku brand { name slug } category { name } } }"
  }'
```

{"data":{"createProduct":{"_id":"683d18be3b3473c4cdeebf4b","name":"iPhone 15 Pro","price":25000000,"sku":"IPHONE15PRO-001","brand":{"name":"Apple2","slug":"apple2"},"category":{"name":"Ăn trưa tại phòng"}}}}




curl -X POST http://localhost:4000/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWVmNGNhZDU2NDQ4NDFiOTA3MjYyMiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTE2MjkyNjIsImV4cCI6MTc1MTcxNTY2Mn0.bh-_otvKsekiyX0N03ljahWBZKgq8Ykm7Z-eNSiME4s" \
  -F operations='{"query":"mutation ($file: File!) { upload(file: $file) }","variables":{"file":null}}' \
  -F map='{"0":["variables.file"]}' \
  -F 0=@/path/to/your/image.jpg


  curl -X POST http://localhost:4000/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWVmNGNhZDU2NDQ4NDFiOTA3MjYyMiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTE2MjkyNjIsImV4cCI6MTc1MTcxNTY2Mn0.bh-_otvKsekiyX0N03ljahWBZKgq8Ykm7Z-eNSiME4s" \
  -F operations='{"query":"mutation ($file: File!) { upload(file: $file) }","variables":{"file":null}}' \
  -F map='{"0":["variables.file"]}' \
  -F 0=@./anh1.webp

  685f50456b63bdecb681d424

  curl -X POST http://localhost:4000/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWVmNGNhZDU2NDQ4NDFiOTA3MjYyMiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTE2MjkyNjIsImV4cCI6MTc1MTcxNTY2Mn0.bh-_otvKsekiyX0N03ljahWBZKgq8Ykm7Z-eNSiME4s" \
  -F operations='{"query":"mutation ($productId: ID!, $file: File!) { uploadProductImage(productId: $productId, file: $file) { success message filename url } }","variables":{"productId":"685f50456b63bdecb681d424","file":null}}' \
  -F map='{"0":["variables.file"]}' \
  -F 0=@./anh1.webp

  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWVmNGNhZDU2NDQ4NDFiOTA3MjYyMiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTE2Mjk1NTUsImV4cCI6MTc1MTcxNTk1NX0.LZ9KqayYluvSSqGSkrKxFtZ8nWdg3k-3nY-smLFArgQ

  # Thay YOUR_NEW_JWT_TOKEN bằng token mới
curl -X POST http://localhost:4000/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWVmNGNhZDU2NDQ4NDFiOTA3MjYyMiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTE2MzAwMTEsImV4cCI6MTc1MTcxNjQxMX0.5Ll7S8BATIF91BZcT-Z4XYD5VwDiwqVpq9U1YQL5Wqc" \
  -F operations='{"query":"mutation ($productId: ID!, $files: [File!]!) { uploadProductImages(productId: $productId, files: $files) { success message filename url } }","variables":{"productId":"685f50456b63bdecb681d424","files":[null,null]}}' \
  -F map='{"0":["variables.files.0"],"1":["variables.files.1"]}' \
  -F 0=@./anh1.webp \
  -F 1=@./anh1.webp