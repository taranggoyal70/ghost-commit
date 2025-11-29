# 🔑 API Keys Setup - Required for Real Functionality

## 🚀 Quick Setup (5 minutes)

Ghost Commit needs these API keys to work with REAL repositories:

---

## 1️⃣ GitHub Personal Access Token (Required)

### **Get Your Token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `Ghost Commit`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:user` (Read user profile data)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### **Add to .env.local:**
```bash
GITHUB_TOKEN=ghp_your_token_here
```

---

## 2️⃣ OpenAI API Key (Optional but Recommended)

### **Get Your Key:**
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name it: `Ghost Commit`
4. Copy the key

### **Add to .env.local:**
```bash
OPENAI_API_KEY=sk-your_key_here
```

**Note:** Without OpenAI key, it will use fallback transformation plans (still works!)

---

## 3️⃣ Complete .env.local File

Your `.env.local` should look like this:

```bash
# Stack Auth (Y Combinator S24) - Already configured
NEXT_PUBLIC_STACK_PROJECT_ID=2e833d15-7949-49eb-98db-af9e9c982921
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_hbca2ehbfyh7y63wd2bq4kd9kzd8fsras3v12eg5fcyp0
STACK_SECRET_SERVER_KEY=ssk_ys265kb5cgvvy1vrme1q1r8sppfp8q3mzbchv30hrg1p0

# GitHub API (Required for real repo analysis)
GITHUB_TOKEN=ghp_your_token_here

# OpenAI API (Optional - for AI-powered analysis)
OPENAI_API_KEY=sk-your_key_here

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 4️⃣ Restart Server

After adding keys:

```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Test It Works

1. Go to: http://localhost:3000/resurrect-live
2. Enter a real GitHub URL: `https://github.com/facebook/create-react-app`
3. Click "Resurrect"
4. Should see real analysis!

---

## 🎯 What Each Key Does

### **GITHUB_TOKEN:**
- ✅ Fetches real repository data
- ✅ Reads package.json
- ✅ Analyzes dependencies
- ✅ Gets commit history
- ✅ Creates issues (if enabled)

### **OPENAI_API_KEY:**
- ✅ AI-powered code analysis
- ✅ Smart transformation plans
- ✅ Custom recommendations
- ⚠️ Fallback plans work without it

---

## 💡 Pro Tips

### **GitHub Token Permissions:**
- Use "classic" token (not fine-grained)
- Only needs `repo` scope
- Can be revoked anytime

### **OpenAI API:**
- GPT-4 gives best results
- Costs ~$0.01 per analysis
- Free tier available

### **Security:**
- Never commit .env.local
- Already in .gitignore
- Tokens are private

---

## 🐛 Troubleshooting

### **"GitHub token not configured"**
- Check .env.local exists
- Verify GITHUB_TOKEN is set
- Restart server

### **"Failed to fetch repository"**
- Check token has `repo` scope
- Verify repo URL is correct
- Check repo is public or you have access

### **"OpenAI API error"**
- Optional - will use fallback
- Check API key is valid
- Verify you have credits

---

## 🎬 Ready to Go!

Once you add GITHUB_TOKEN, you can:
- ✅ Analyze any public GitHub repo
- ✅ Get real dependency data
- ✅ See actual package.json
- ✅ Create real transformation plans

**Add the keys and start resurrecting!** 🚀👻✨
