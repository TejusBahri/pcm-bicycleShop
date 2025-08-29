package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
)

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
	Brand       string  `json:"brand"`
	ImageURL    string  `json:"image_url"`
	StockStatus string  `json:"stock_status"`
}

type Category struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type ShopInfo struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
	Email   string `json:"email"`
	Hours   string `json:"hours"`
}

var db *sql.DB

func main() {
	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Initialize database
	initDB()
	defer db.Close()

	// Create router
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/products", getProducts).Methods("GET")
	api.HandleFunc("/products/{id}", getProduct).Methods("GET")
	api.HandleFunc("/categories", getCategories).Methods("GET")
	api.HandleFunc("/contact", getContact).Methods("GET")

	// Serve static files
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("../frontend")))

	// CORS middleware - configure for production
	corsOrigins := []string{"*"}
	if origin := os.Getenv("CORS_ORIGIN"); origin != "" {
		corsOrigins = []string{origin}
	}

	c := cors.New(cors.Options{
		AllowedOrigins: corsOrigins,
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	// Start server
	log.Printf("Server starting on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, c.Handler(r)))
}

func initDB() {
	var err error
	dbPath := os.Getenv("DATABASE_URL")
	if dbPath == "" {
		dbPath = "../database/shop.db"
	}

	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal(err)
	}

	// Create tables
	createTables()
	insertSampleData()
}

func createTables() {
	// Products table
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS products (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			description TEXT,
			price DECIMAL(10,2) NOT NULL,
			category TEXT NOT NULL,
			brand TEXT,
			image_url TEXT,
			stock_status TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		log.Fatal(err)
	}

	// Categories table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS categories (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			description TEXT
		)
	`)
	if err != nil {
		log.Fatal(err)
	}

	// Shop info table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS shop_info (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			address TEXT NOT NULL,
			phone TEXT NOT NULL,
			email TEXT NOT NULL,
			hours TEXT NOT NULL
		)
	`)
	if err != nil {
		log.Fatal(err)
	}
}

func insertSampleData() {
	// Insert categories
	categories := []string{"Mountain Bikes", "Road Bikes", "Hybrid Bikes", "Electric Bikes", "Accessories"}
	for _, cat := range categories {
		_, err := db.Exec("INSERT OR IGNORE INTO categories (name) VALUES (?)", cat)
		if err != nil {
			log.Printf("Error inserting category %s: %v", cat, err)
		}
	}

	// Insert shop info
	_, err := db.Exec(`
		INSERT OR REPLACE INTO shop_info (id, name, address, phone, email, hours) 
		VALUES (1, 'PCM Bicycle Shop', '123 Cycling Street, Downtown, City, State 12345', 
		        '+1 (555) 123-4567', 'info@pcmbikes.com', 
		        'Mon-Fri: 9AM-7PM, Sat: 9AM-6PM, Sun: 10AM-5PM')
	`)
	if err != nil {
		log.Printf("Error inserting shop info: %v", err)
	}

	// Insert sample products
	products := []Product{
		{Name: "Mountain Bike Pro X1", Description: "Professional grade mountain bike with advanced suspension system, perfect for trail riding and off-road adventures.", Price: 1299.99, Category: "Mountain Bikes", Brand: "Trek", ImageURL: "/images/mtb-pro-x1.jpg", StockStatus: "In Stock"},
		{Name: "Road Bike Speed Master", Description: "Lightweight carbon fiber road bike designed for speed and endurance. Ideal for racing and long-distance rides.", Price: 2499.99, Category: "Road Bikes", Brand: "Specialized", ImageURL: "/images/road-speed-master.jpg", StockStatus: "In Stock"},
		{Name: "Hybrid City Cruiser", Description: "Comfortable hybrid bike perfect for city commuting and recreational riding. Features upright seating position.", Price: 599.99, Category: "Hybrid Bikes", Brand: "Giant", ImageURL: "/images/hybrid-city-cruiser.jpg", StockStatus: "In Stock"},
		{Name: "E-Bike Commuter Plus", Description: "Electric bike with pedal assist, perfect for daily commuting. 50-mile range on single charge.", Price: 1899.99, Category: "Electric Bikes", Brand: "Rad Power", ImageURL: "/images/ebike-commuter.jpg", StockStatus: "Limited Stock"},
		{Name: "Kids Mountain Explorer", Description: "Durable kids mountain bike with 20-inch wheels. Safe and fun for young riders.", Price: 299.99, Category: "Mountain Bikes", Brand: "Trek", ImageURL: "/images/kids-mtb-explorer.jpg", StockStatus: "In Stock"},
		{Name: "Road Bike Endurance Elite", Description: "Endurance road bike with relaxed geometry for comfortable long rides. Aluminum frame with carbon fork.", Price: 899.99, Category: "Road Bikes", Brand: "Cannondale", ImageURL: "/images/road-endurance-elite.jpg", StockStatus: "In Stock"},
		{Name: "Hybrid Fitness Pro", Description: "Performance hybrid bike with fitness-focused geometry. Great for exercise and recreational riding.", Price: 749.99, Category: "Hybrid Bikes", Brand: "Specialized", ImageURL: "/images/hybrid-fitness-pro.jpg", StockStatus: "In Stock"},
		{Name: "E-Bike Mountain Trail", Description: "Electric mountain bike with full suspension and powerful motor. Conquer any trail with ease.", Price: 3499.99, Category: "Electric Bikes", Brand: "Trek", ImageURL: "/images/ebike-mountain-trail.jpg", StockStatus: "In Stock"},
		{Name: "Cycling Helmet Pro", Description: "Premium cycling helmet with MIPS technology for maximum safety. Lightweight and well-ventilated.", Price: 89.99, Category: "Accessories", Brand: "Bell", ImageURL: "/images/helmet-pro.jpg", StockStatus: "In Stock"},
		{Name: "Bike Lock Premium", Description: "Heavy-duty U-lock with anti-theft protection. Includes mounting bracket for easy storage.", Price: 49.99, Category: "Accessories", Brand: "Kryptonite", ImageURL: "/images/bike-lock-premium.jpg", StockStatus: "In Stock"},
	}

	for _, product := range products {
		_, err := db.Exec(`
			INSERT OR IGNORE INTO products (name, description, price, category, brand, image_url, stock_status) 
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`, product.Name, product.Description, product.Price, product.Category, product.Brand, product.ImageURL, product.StockStatus)
		if err != nil {
			log.Printf("Error inserting product %s: %v", product.Name, err)
		}
	}
}

func getProducts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, description, price, category, brand, image_url, stock_status FROM products ORDER BY category, name")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.Category, &p.Brand, &p.ImageURL, &p.StockStatus)
		if err != nil {
			continue
		}
		products = append(products, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func getProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	var p Product
	err = db.QueryRow("SELECT id, name, description, price, category, brand, image_url, stock_status FROM products WHERE id = ?", id).
		Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.Category, &p.Brand, &p.ImageURL, &p.StockStatus)
	if err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func getCategories(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, description FROM categories ORDER BY name")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var c Category
		err := rows.Scan(&c.ID, &c.Name, &c.Description)
		if err != nil {
			continue
		}
		products = append(products, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}

func getContact(w http.ResponseWriter, r *http.Request) {
	var info ShopInfo
	err := db.QueryRow("SELECT name, address, phone, email, hours FROM shop_info WHERE id = 1").
		Scan(&info.Name, &info.Address, &info.Phone, &info.Email, &info.Hours)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(info)
}
