#!/bin/bash

echo "🚀 Setting up Project Dashboard..."

# Create backend .env
echo "📝 Creating backend .env file..."
cat > backend/.env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/project_dashboard"
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF

# Create frontend .env
echo "📝 Creating frontend .env file..."
cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=http://localhost:5000
EOF

echo "✅ Environment files created!"
echo ""
echo "Next steps:"
echo "1. Install dependencies:"
echo "   cd backend && npm install"
echo "   cd ../frontend && npm install"
echo ""
echo "2. Setup database:"
echo "   cd backend"
echo "   npx prisma migrate dev"
echo "   npx prisma db seed"
echo ""
echo "3. Start the application:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm start"
echo ""
echo "Or use Docker:"
echo "   docker-compose up -d"
