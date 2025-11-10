#!/bin/bash

echo "🚀 Starting Krafti Preview..."
echo ""

# Check if we're in the workspace directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the /workspace directory"
    exit 1
fi

# Start frontend
echo "📱 Starting Frontend (Next.js)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Frontend starting on http://localhost:3000"
echo ""
echo "🎨 Preview the landing page in your browser!"
echo ""
echo "Press Ctrl+C to stop the preview"
echo ""

# Wait for user to stop
wait $FRONTEND_PID
