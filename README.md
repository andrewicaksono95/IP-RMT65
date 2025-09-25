# 🍎 FROOTS - AI-Powered Fruit Discovery Platform

A beautiful, modern fullstack application for discovering, exploring, and managing your favorite fruits with AI-powered personalized recommendations. Built with persistent authentication, elegant UI/UX, and comprehensive nutritional insights.

## 🟢 Server Port

**Production Configuration:**
- **Configured Port:** 80 (as per `ecosystem.config.cjs`)
- **Actual Running Port:** 3000 (fallback due to port 80 permission denied)

```
# Configured for production
http://localhost:80

# Currently running on (requires sudo for port 80)
http://localhost:3000
```

**Note:** Port 80 requires root privileges. If you need to run on port 80, use:
```bash
sudo pm2 start ecosystem.config.cjs
```

## ...existing documentation...
