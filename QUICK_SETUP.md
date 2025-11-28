# ⚡ QUICK SETUP - 5 Minutes

## 🎯 **What You Need**

Just 2 things to make it REAL:
1. GitHub Token (2 min)
2. OpenAI Key (2 min) - Optional but impressive

---

## 🔑 **Step 1: GitHub Token (2 Minutes)**

### **Get Token:**
1. **Open:** https://github.com/settings/tokens
2. **Click:** "Generate new token" → "Generate new token (classic)"
3. **Fill in:**
   - Note: `Ghost Commit Demo`
   - Expiration: `7 days`
   - Scopes: ✅ Check **`repo`** (Full control of private repositories)
4. **Click:** "Generate token" (scroll down)
5. **Copy** the token (starts with `ghp_...`)

### **Add Token:**
```bash
# Open .env.local
nano .env.local

# Find this line:
GITHUB_TOKEN=your_github_personal_access_token_here

# Replace with your token:
GITHUB_TOKEN=ghp_your_actual_token_here

# Save: Ctrl+O, Enter, Ctrl+X
```

---

## 🤖 **Step 2: OpenAI Key (2 Minutes)** *Optional*

### **Get Key:**
1. **Open:** https://platform.openai.com/api-keys
2. **Click:** "Create new secret key"
3. **Name:** `Ghost Commit`
4. **Copy** the key (starts with `sk-...`)

### **Add Key:**
```bash
# Open .env.local (if not already open)
nano .env.local

# Find this line:
OPENAI_API_KEY=your_openai_api_key_here

# Replace with your key:
OPENAI_API_KEY=sk-your_actual_key_here

# Save: Ctrl+O, Enter, Ctrl+X
```

---

## 🚀 **Step 3: Restart Server (1 Minute)**

```bash
# Stop current server
# Press Ctrl+C in the terminal running npm

# Start again
npm run dev
```

---

## ✅ **Step 4: Test It! (1 Minute)**

### **Test the Real Feature:**

1. **Open:** http://localhost:3001/demo

2. **Paste a repo URL:**
   ```
   https://github.com/facebook/react
   ```
   Or use your own repo:
   ```
   https://github.com/taranggoyalg70/Finazava-analytics
   ```

3. **Click:** "Analyze"
   - Should show real data in 2-3 seconds
   - Stars, dependencies, AI insights

4. **Click:** "Create GitHub Issue (REAL!)"
   - Creates actual issue in 2-3 seconds
   - Shows issue number and URL

5. **Click:** "View Issue on GitHub"
   - Opens the actual GitHub issue
   - IT'S REALLY THERE! 🎉

---

## 🎬 **You're Ready to Demo!**

### **Your 2-Minute Demo:**
```
1. "Let me show you Ghost Commit..."
   → Go to /demo

2. "Watch it analyze a real repo..."
   → Paste URL, click Analyze
   → Show real data

3. "Now I'll create a real GitHub issue..."
   → Click button
   → Issue created!

4. "Let me show you on GitHub..."
   → Click link
   → It's actually there!

5. "Real AI. Real output. Real functionality."
```

---

## 🆘 **Troubleshooting**

### **"GitHub token not configured"**
- Check `.env.local` has `GITHUB_TOKEN=ghp_...`
- Make sure you saved the file
- Restart server: `Ctrl+C`, then `npm run dev`

### **"Permission denied"**
- Token needs `repo` scope
- Generate new token with correct permissions

### **"OpenAI error"**
- OpenAI key is optional
- Demo still works without it (just no AI insights)
- Add later if needed

---

## 📝 **Quick Reference**

### **Files:**
- `.env.local` - Your API keys (already created ✅)
- `REAL_FEATURE_SETUP.md` - Full guide
- `QUICK_SETUP.md` - This file

### **URLs:**
- Demo: http://localhost:3001/demo
- GitHub Tokens: https://github.com/settings/tokens
- OpenAI Keys: https://platform.openai.com/api-keys

### **Commands:**
```bash
# Edit env file
nano .env.local

# Restart server
npm run dev

# Check if running
curl http://localhost:3001
```

---

## ✅ **Checklist**

- [ ] Get GitHub token
- [ ] Add to .env.local
- [ ] Get OpenAI key (optional)
- [ ] Add to .env.local
- [ ] Restart server
- [ ] Test at /demo
- [ ] Create test issue
- [ ] Verify on GitHub
- [ ] Practice demo 3x
- [ ] READY! 🚀

---

## 🎉 **That's It!**

**Total time: 5 minutes**  
**Result: Real, working AI feature**  
**Impact: MASSIVE at hackathon**

**Now go test it!** 🚀👻✨
