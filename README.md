# ☕ Chai Adda - College Canteen Management System

A modern, full-stack web application designed to streamline order management for college canteens. Built with Next.js, Node.js, and PostgreSQL, featuring real-time updates and a beautiful, responsive UI.

## 🌐 Live Demo

- **Frontend**: [https://chai-adda-system.vercel.app/](https://chai-adda-system.vercel.app/)
- **Backend API**: [https://chaiadda-system.onrender.com](https://chaiadda-system.onrender.com)

> **Note**: The backend is hosted on Render's free tier and may take 50+ seconds to spin up after inactivity.

## ✨ Features

### For Students
- 📱 **Browse Menu** - View all available items with ratings and reviews
- ⭐ **Rate & Review** - Share feedback on items you've ordered
- 🛒 **Place Orders** - Easy ordering with UPI payment proof upload
- 📊 **Order Tracking** - Real-time status updates on your orders
- 👤 **Profile Management** - View and manage your reviews
- 🗑️ **Account Deletion** - Delete your account and all associated data

### For Vendors
- 📋 **Dashboard** - Comprehensive overview of orders and revenue
- 🍽️ **Menu Management** - Add, edit, and manage menu items with pagination
- ✅ **Order Processing** - Accept, prepare, and complete orders
- 💰 **Payment Verification** - Verify payment proofs and manage transactions
- 📈 **Analytics** - View sales trends and top-selling items
- ⭐ **Review Insights** - See customer ratings and feedback

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Real-time**: Socket.io Client
- **Icons**: Lucide React
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Deployment**: Render

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/uATrisk/ChaiAdda-System.git
cd ChaiAdda-System
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file with the following variables:
# DATABASE_URL="postgresql://user:password@localhost:5432/chaiadda"
# JWT_SECRET="your-secret-key"
# PORT=8000
# FRONTEND_URL="http://localhost:3000"

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file (optional)
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the frontend server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## 🚀 Usage

### Default Credentials

**Vendor Account:**
- Email: `anshtomarnew@gmail.com`
- Password: `1234567890`

**Student Account:**
- Sign up at: [/signup/student](https://chai-adda-system.vercel.app/signup/student)

### Key Workflows

1. **Student Flow**:
   - Browse menu → Add items to cart → Place order → Upload payment proof → Track order status → Rate & review

2. **Vendor Flow**:
   - Login → View dashboard → Manage menu items → Process orders → Verify payments → Update order status

## 📁 Project Structure

```
ChaiAdda-System/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Auth & upload middleware
│   │   ├── routes/           # API routes
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Helper functions
│   └── uploads/              # Payment proof images
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/        # Login page
│   │   │   ├── signup/       # Student signup
│   │   │   ├── menu/         # Public menu
│   │   │   ├── vendor/       # Vendor dashboard
│   │   │   └── student/      # Student dashboard
│   │   ├── components/       # Reusable components
│   │   └── lib/              # API & Socket utilities
│   └── tailwind.config.ts
└── README.md
```

## 🔑 Key Features Implementation

### Real-time Updates
- Socket.io integration for live order status updates
- Automatic dashboard refresh when new orders arrive
- Real-time item availability changes

### Rating & Review System
- Students can rate items (1-5 stars)
- Write detailed reviews
- View average ratings on menu
- Vendors can see all reviews
- Students can delete their own reviews

### Pagination
- Vendor menu supports pagination (5 items per page)
- Easy navigation with Previous/Next buttons
- Search functionality with automatic page reset

### Payment Verification
- Students upload payment proof (UPI screenshots)
- Vendors verify payments before processing
- UTR number tracking for transactions

### Account Management
- Users can update their profile information
- Students can delete their account and all associated data
- Double confirmation for account deletion

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (Student/Admin)
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation
- Secure account deletion with confirmation

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set Framework Preset to **Next.js**
3. Set Root Directory to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://chaiadda-system.onrender.com`
5. Deploy

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set Root Directory to `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Your JWT secret
   - `FRONTEND_URL` - `https://chai-adda-system.vercel.app`
6. Deploy

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🐛 Known Issues & Solutions

All major issues have been resolved:
- ✅ Fixed TypeScript build errors on Render
- ✅ Fixed "Order not found" error on vendor order page
- ✅ Fixed "Unknown Item" display in dashboard
- ✅ Fixed missing UTR number display
- ✅ Fixed reviews.map runtime error
- ✅ Implemented pagination for vendor menu
- ✅ Added review deletion functionality
- ✅ Added account deletion feature

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Ansh Tomar** - [GitHub](https://github.com/uATrisk)

## 🙏 Acknowledgments

- Built for college canteen management
- Inspired by modern food ordering platforms
- Special thanks to all contributors and testers

## 📞 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/uATrisk/ChaiAdda-System/issues)
- Contact: anshtomarnew@gmail.com

---

**Made with ❤️ for Chai Adda**
