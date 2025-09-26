# Deploy X-Clone to Render
Write-Host "🚀 Deploying X-Clone to Render..." -ForegroundColor Cyan

# Check if git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Deployment Instructions:" -ForegroundColor Yellow
Write-Host ""
Write-Host "STEP 1: Deploy Backend" -ForegroundColor Green
Write-Host "1. Go to https://render.com and sign in with GitHub"
Write-Host "2. Click 'New' → 'Web Service'"
Write-Host "3. Connect GitHub repo: Mukesk/xclone"
Write-Host "4. Use these settings:" -ForegroundColor Cyan
Write-Host "   Name: xclone-backend"
Write-Host "   Environment: Node"
Write-Host "   Branch: main"
Write-Host "   Root Directory: backend-deploy"
Write-Host "   Build Command: npm install"
Write-Host "   Start Command: npm start"
Write-Host ""

Write-Host "STEP 2: Add Environment Variables" -ForegroundColor Green
Write-Host "Add these in Render dashboard:" -ForegroundColor Cyan
$envVars = @{
    "MONGO" = "mongodb+srv://mukesh:mukesh%402005@cluster0.pqqkp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    "JWT_SECRET" = "your_local_jwt_secret_here_make_it_long_and_secure"
    "CLOUDINARY_CLOUD_NAME" = "do21g4z9a"
    "CLOUDINARY_API_KEY" = "244317735436633"
    "CLOUDINARY_API_SECRET" = "EhtF9k1NVc8C3TaztVB62Ksek7o"
    "NODE_ENV" = "production"
}

foreach ($env in $envVars.GetEnumerator()) {
    Write-Host "   $($env.Key)=$($env.Value)"
}

Write-Host ""
Write-Host "STEP 3: Deploy Frontend" -ForegroundColor Green
Write-Host "1. Click 'New' → 'Static Site'"
Write-Host "2. Connect same GitHub repo: Mukesk/xclone"
Write-Host "3. Use these settings:" -ForegroundColor Cyan
Write-Host "   Name: xclone-frontend"
Write-Host "   Branch: main"
Write-Host "   Root Directory: frontend-deploy"
Write-Host "   Build Command: npm install && npm run build"
Write-Host "   Publish Directory: dist"
Write-Host ""
Write-Host "4. Add environment variable:" -ForegroundColor Cyan
Write-Host "   VITE_BACKEND_URL=https://xclone-backend.onrender.com"
Write-Host "   (Replace with actual backend URL from step 1)"
Write-Host ""

Write-Host "🎯 Expected URLs after deployment:" -ForegroundColor Magenta
Write-Host "Backend:  https://xclone-backend-[random].onrender.com"
Write-Host "Frontend: https://xclone-frontend-[random].onrender.com"
Write-Host ""

Write-Host "✨ Your X-Clone will be live in 3-5 minutes!" -ForegroundColor Green

# Open Render in browser
Write-Host "Opening Render dashboard..." -ForegroundColor Cyan
Start-Process "https://render.com/dashboard"

Write-Host ""
Write-Host "📝 Note: Copy the backend URL and update the frontend environment variable!"
Write-Host "🎉 Happy deploying!" -ForegroundColor Green