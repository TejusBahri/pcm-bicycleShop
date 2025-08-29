# 🚴‍♂️ PCM Bicycle Shop Website

A modern, responsive website for PCM Bicycle Shop with product catalog, wishlist, and contact information.

## ✨ Features

- Complete product catalog with filtering and search
- Wishlist functionality (local storage)
- Responsive design for all devices
- Contact information and FAQ
- No e-commerce - browse and wishlist only

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Go (Golang)
- **Database**: SQLite

## 🚀 Quick Start

### 1. Install Go Dependencies
```bash
cd backend
go mod tidy
```

### 2. Run Backend Server
```bash
go run main.go
```
Server starts on `http://localhost:8080`

### 3. Open Website
Navigate to `http://localhost:8080` in your browser

## 📁 Project Structure

```
PCM_Site/
├── frontend/          # HTML, CSS, JS files
├── backend/           # Go server
├── database/          # SQLite database
└── README.md
```

## 🌐 Free Deployment

### Backend
- Railway (500 hours/month free)
- Render (free tier)
- Heroku (free tier)

### Frontend
- GitHub Pages (always free)
- Netlify (always free)
- Vercel (always free)

## 🔧 Configuration

- Backend port: 8080 (modify in main.go)
- Database: Auto-created SQLite file
- Sample data included

## 📱 Features

- Product catalog with filters
- Wishlist management
- Responsive design
- Contact information
- FAQ section

## 🐛 Troubleshooting

1. **Go dependencies**: `go clean -modcache && go mod tidy`
2. **Database**: Ensure `database/` directory exists
3. **Frontend**: Check browser console for errors

## 📞 Support

Check browser console and Go server logs for errors.

---

Built with ❤️ for PCM Bicycle Shop 