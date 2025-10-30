#!/bin/bash

# Spring Security JWT Login Sample - API Test Script
# This script tests all API endpoints

echo "========================================"
echo "Spring Security JWT Login Sample - API Test"
echo "========================================"
echo

# Test 1: Login
echo "1. Testing Login API..."
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c /tmp/cookies.txt)

ACCESS_TOKEN=$(echo $RESPONSE | jq -r '.accessToken')
USERNAME=$(echo $RESPONSE | jq -r '.username')
ROLE=$(echo $RESPONSE | jq -r '.role')

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    echo "✅ Login successful"
    echo "   Username: $USERNAME"
    echo "   Role: $ROLE"
else
    echo "❌ Login failed"
    exit 1
fi
echo

# Test 2: Dashboard API with token
echo "2. Testing Protected Dashboard API..."
DASHBOARD_RESPONSE=$(curl -s http://localhost:8080/api/dashboard \
  -H "Authorization: Bearer $ACCESS_TOKEN")

MESSAGE=$(echo $DASHBOARD_RESPONSE | jq -r '.message')
if [ -n "$MESSAGE" ] && [ "$MESSAGE" != "null" ]; then
    echo "✅ Dashboard access successful"
    echo "   Message: $MESSAGE"
else
    echo "❌ Dashboard access failed"
    exit 1
fi
echo

# Test 3: Token refresh
echo "3. Testing Token Refresh API..."
REFRESH_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/refresh \
  -b /tmp/cookies.txt)

NEW_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.accessToken')
if [ -n "$NEW_TOKEN" ] && [ "$NEW_TOKEN" != "null" ]; then
    echo "✅ Token refresh successful"
else
    echo "❌ Token refresh failed"
    exit 1
fi
echo

# Test 4: Logout
echo "4. Testing Logout API..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST http://localhost:8080/api/auth/logout \
  -b /tmp/cookies.txt)

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Logout successful"
else
    echo "❌ Logout failed (HTTP $HTTP_STATUS)"
    exit 1
fi
echo

# Cleanup
rm -f /tmp/cookies.txt

echo "========================================"
echo "All tests passed! ✅"
echo "========================================"
