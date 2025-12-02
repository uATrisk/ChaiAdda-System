#!/bin/bash

BASE_URL="http://localhost:8000"

# 1. Signup/Login
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gmail.com", "password": "password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed. Trying signup..."
  SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
    -H "Content-Type: application/json" \
    -d '{"name": "Admin", "email": "admin@gmail.com", "password": "password123"}')
  
  echo "Signup response: $SIGNUP_RESPONSE"
  
  # Login again
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "admin@gmail.com", "password": "password123"}')
  
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "Authentication failed."
  exit 1
fi

echo "Token: $TOKEN"

# 2. Add Item with Image
echo "Adding item..."
# Create a dummy image file
echo "dummy image content" > dummy.jpg

ADD_ITEM_RESPONSE=$(curl -s -X POST "$BASE_URL/items" \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Test Chai" \
  -F "price=20" \
  -F "category=Tea & Coffee" \
  -F "image=@dummy.jpg;type=image/jpeg")

echo "Add Item Response: $ADD_ITEM_RESPONSE"

# 3. Get Items
echo "Getting items..."
GET_ITEMS_RESPONSE=$(curl -s "$BASE_URL/items")
echo "Get Items Response: $GET_ITEMS_RESPONSE"

# Check if Test Chai is in the response
if [[ "$GET_ITEMS_RESPONSE" == *"Test Chai"* ]]; then
  echo "Verification Successful: Test Chai found in items."
else
  echo "Verification Failed: Test Chai not found."
fi

rm dummy.jpg
