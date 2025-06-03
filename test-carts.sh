curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZiIsInVzZXJuYW1lIjoiY3VzdG9tZXIxIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzQ4OTIxMTI2LCJleHAiOjE3NDkwMDc1MjZ9.v_MMarLSJPMsNb5hLtrLKBKgHYjctBWJXExr_-JMECY" \
  -d '{
    "query": "mutation { addToCart(input: { productId: \"683d18be3b3473c4cdeebf4b\", quantity: 2 }) { _id quantity unitPrice productName totalPrice } }"
  }'

  curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2JjNTNjNmIyMmE4OTc3YjhhNzhmZiIsInVzZXJuYW1lIjoiY3VzdG9tZXIxIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzQ4OTIxMTI2LCJleHAiOjE3NDkwMDc1MjZ9.v_MMarLSJPMsNb5hLtrLKBKgHYjctBWJXExr_-JMECY" \
  -d '{
    "query": "query { getCart { items { _id quantity unitPrice productName totalPrice } totalItems subtotal } }"
  }'