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


