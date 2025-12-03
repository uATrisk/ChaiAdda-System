#!/bin/bash

# This script creates a test order to verify the receipt functionality

# First, login to get a token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@student.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed. Response: $LOGIN_RESPONSE"
  echo "Please make sure you have a test student account or create one first."
  exit 1
fi

echo "Logged in successfully. Token: ${TOKEN:0:20}..."

# Get menu items
echo "Fetching menu items..."
ITEMS=$(curl -s -X GET "http://localhost:5000/api/items")
ITEM1_ID=$(echo $ITEMS | jq -r '.[0].id')
ITEM1_PRICE=$(echo $ITEMS | jq -r '.[0].price')
ITEM2_ID=$(echo $ITEMS | jq -r '.[1].id')
ITEM2_PRICE=$(echo $ITEMS | jq -r '.[1].price')

echo "Item 1: $ITEM1_ID - ₹$ITEM1_PRICE"
echo "Item 2: $ITEM2_ID - ₹$ITEM2_PRICE"

# Calculate total
TOTAL=$((ITEM1_PRICE * 2 + ITEM2_PRICE * 1))

# Create order
echo "Creating order..."
ORDER_RESPONSE=$(curl -s -X POST "http://localhost:5000/api/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"items\": [
      {\"itemId\": \"$ITEM1_ID\", \"qty\": 2, \"price\": $((ITEM1_PRICE * 2))},
      {\"itemId\": \"$ITEM2_ID\", \"qty\": 1, \"price\": $ITEM2_PRICE}
    ],
    \"amount\": $TOTAL,
    \"utr\": \"TEST123456789\"
  }")

ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.order.id')

if [ "$ORDER_ID" == "null" ] || [ -z "$ORDER_ID" ]; then
  echo "Order creation failed. Response: $ORDER_RESPONSE"
  exit 1
fi

echo "Order created successfully!"
echo "Order ID: $ORDER_ID"
echo ""
echo "Open this URL in your browser to see the receipt:"
echo "http://localhost:3000/order/$ORDER_ID"
