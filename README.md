# Σύστημα Διαχείρισης Ευρωπαίων Πολιτών

Μια full-stack εφαρμογή για τη διαχείριση στοιχείων ευρωπαίων πολιτών, χτισμένη με React, Node.js, TypeScript και MongoDB.

## Περιγραφή

Αυτή η εφαρμογή παρέχει:

- **Frontend**: React με TypeScript και Vite
- **Backend**: Node.js με Express και TypeScript
- **Database**: MongoDB με Mongoose
- **Authentication**: JWT-based authentication με role-based access control
- **Σύστημα Διαχείρισης Ευρωπαίων Πολιτών**: CRUD operations για διαχείριση ευρωπαίων πολιτών

### Ρόλοι Χρηστών

- **Υπάλληλοι**: Έχουν πλήρη πρόσβαση για διαχείριση όλων των ευρωπαίων πολιτών (δημιουργία, ενημέρωση, διαγραφή)
- **Πολίτες**: Μπορούν να αναζητούν μόνο τα δικά τους στοιχεία με τον αριθμό διαβατηρίου

## Προαπαιτούμενα

Πριν ξεκινήσετε, βεβαιωθείτε ότι έχετε εγκατεστημένα:

- **Node.js** (v16 ή νεότερη έκδοση)
- **MongoDB** (v4.4 ή νεότερη έκδοση)
- **npm** ή **yarn**
- **Git**

## Εγκατάσταση

### 1. Κλωνοποίηση του Repository

```bash
git clone <repository-url>
cd PepiWebProject
```

### 2. Εγκατάσταση Dependencies

```bash
# Εγκατάσταση όλων των dependencies (frontend + backend)
npm run install-all
```

Ή ξεχωριστά:

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### 3. Ρύθμιση Environment Variables

Δημιουργήστε ένα `.env` αρχείο στο `backend/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/citizen_management

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
```

## Ανάπτυξη (Development)

### 1. Εκκίνηση MongoDB

Βεβαιωθείτε ότι το MongoDB τρέχει:

```bash
# Windows (αν έχετε MongoDB ως service)
net start MongoDB

# macOS (με Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 2. Εκκίνηση της Εφαρμογής

```bash
# Εκκίνηση και frontend και backend μαζί
npm run dev
```

Αυτό θα ξεκινήσει:

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Ξεχωριστή Εκκίνηση

```bash
# Backend μόνο
npm run start-backend

# Frontend μόνο
npm run start-frontend
```

## Build για Production

### 1. Build Frontend

```bash
cd frontend
npm run build
```

Αυτό θα δημιουργήσει τα optimized files στο `frontend/dist/` directory.

### 2. Build Backend

```bash
cd backend
npm run build
```

Αυτό θα compile το TypeScript code στο `backend/dist/` directory.

### 3. Build Όλης της Εφαρμογής

```bash
# Από το root directory
npm run build
```

## Deployment

### 1. Local Production Build

```bash
# Build όλης της εφαρμογής
npm run build

# Εκκίνηση production server
npm run start
```

### 2. Docker Deployment

Δημιουργήστε `Dockerfile` στο root directory:

```dockerfile
# Multi-stage build
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS backend-build

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Install serve for static files
RUN npm install -g serve

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start script
CMD ["sh", "-c", "cd backend && npm start & serve -s frontend/dist -l 3000"]
```

Build και εκκίνηση:

```bash
# Build Docker image
docker build -t citizen-management-app .

# Run container
docker run -p 5000:5000 -p 3000:3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/citizen_management \
  -e JWT_SECRET=your_jwt_secret \
  citizen-management-app
```

### 3. Cloud Deployment (Heroku)

#### Heroku Setup

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
```

#### Deploy to Heroku

```bash
# Build frontend
cd frontend
npm run build

# Copy build to backend public directory
cp -r dist/* ../backend/public/

# Deploy
cd ../backend
git init
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 4. Cloud Deployment (Vercel + Railway)

#### Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-backend-url.railway.app
```

#### Backend (Railway)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up

# Set environment variables
railway variables set MONGODB_URI=your_mongodb_connection_string
railway variables set JWT_SECRET=your_jwt_secret
```

### 5. Traditional Server Deployment

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/citizen-management/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### PM2 Configuration

Δημιουργήστε `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "citizen-management-backend",
      script: "./backend/dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};
```

Deploy με PM2:

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/citizen_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS (για production)
CORS_ORIGIN=https://your-frontend-domain.com
```

## Scripts

### Root Package.json Scripts

```json
{
  "scripts": {
    "install-all": "cd frontend && npm install && cd ../backend && npm install",
    "dev": "concurrently \"npm run start-backend\" \"npm run start-frontend\"",
    "start-backend": "cd backend && npm run dev",
    "start-frontend": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build && cd ../backend && npm run build",
    "start": "cd backend && npm start"
  }
}
```

### Frontend Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Backend Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Εγγραφή νέου χρήστη
- `POST /api/auth/login` - Σύνδεση χρήστη
- `GET /api/auth/me` - Λήψη στοιχείων τρέχοντος χρήστη

### Citizens

- `GET /api/citizens` - Λήψη όλων των ευρωπαίων πολιτών (μόνο για υπαλλήλους)
- `GET /api/citizens/:passportNumber` - Αναζήτηση πολίτη με αριθμό διαβατηρίου
- `POST /api/citizens` - Δημιουργία νέου πολίτη
- `PUT /api/citizens/:id` - Ενημέρωση πολίτη
- `DELETE /api/citizens/:id` - Διαγραφή πολίτη

### Health Check

- `GET /health` - Έλεγχος κατάστασης server

## Δομή Project

```
PepiWebProject/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CitizenManager.tsx
│   │   │   ├── CitizenLookup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Calendar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/                     # Node.js Backend
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Citizen.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── citizens.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── utils/
│   │   │   └── jwt.ts
│   │   ├── config.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json                 # Root package για scripts
├── README.md
└── .gitignore
```

## Troubleshooting

### Συνήθη Προβλήματα

1. **MongoDB Connection Error**

   ```bash
   # Βεβαιωθείτε ότι το MongoDB τρέχει
   sudo systemctl status mongod

   # Επανεκκίνηση MongoDB
   sudo systemctl restart mongod
   ```

2. **Port Already in Use**

   ```bash
   # Βρείτε ποια process χρησιμοποιεί το port
   lsof -i :5000

   # Kill το process
   kill -9 <PID>
   ```

3. **Build Errors**

   ```bash
   # Καθαρισμός node_modules
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **CORS Issues**
   - Βεβαιωθείτε ότι το CORS_ORIGIN είναι σωστά ρυθμισμένο
   - Έλεγχος των environment variables

### Logs

```bash
# Backend logs
cd backend
npm run dev

# PM2 logs (αν χρησιμοποιείτε PM2)
pm2 logs citizen-management-backend
```

## Συντήρηση

### Backup Database

```bash
# MongoDB backup
mongodump --db citizen_management --out ./backup/$(date +%Y%m%d)

# Restore
mongorestore --db citizen_management ./backup/20240101/citizen_management
```

### Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit fix
```

## License

[Αναφέρετε την άδεια χρήσης εδώ]

## Support

Για υποστήριξη ή ερωτήσεις, επικοινωνήστε με [your-email@domain.com]
