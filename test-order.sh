#!/bin/bash

# This script creates a test order to verify the receipt functionality

# First, login to get a token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"debug_user_v2@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed. Response: $LOGIN_RESPONSE"
  echo "Please make sure you have a test student account or create one first."
  exit 1
fi

echo "Logged in successfully. Token: ${TOKEN:0:20}..."

# Get menu items
echo "Fetching menu items..."
ITEMS=$(curl -s -X GET "http://localhost:8000/items")
ITEM1_ID=$(echo $ITEMS | jq -r '.[0].id')
ITEM1_PRICE=$(echo $ITEMS | jq -r '.[0].price')

echo "Item 1: $ITEM1_ID - ₹$ITEM1_PRICE"

# Calculate total
TOTAL=$((ITEM1_PRICE * 2))

# Create order
echo "Creating order..."
ORDER_RESPONSE=$(curl -s -X POST "http://localhost:8000/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"items\": [
      {\"itemId\": \"$ITEM1_ID\", \"qty\": 2, \"price\": $ITEM1_PRICE}
    ],
    \"amount\": $TOTAL,
    \"utr\": \"TEST123456789\"
  }")

echo "Response Body:"
echo $ORDER_RESPONSE
