```markdown
# 🍵 Tea4Code - Collaborative Bug-Fixing Platform

[![GitHub Repo stars](https://img.shields.io/github/stars/Nee-sudo/Tea4Code?style=social)](?label=Stars)](https://github.com/Nee-sudo/Tea4Code)
[![GitHub issues](https://img.shields.io/github/issues/Nee-sudo/Tea4Code?color=red)](https://github.com/Nee-sudo/Tea4Code/issues)
[![GitHub license](https://img.shields.io/github/license/Nee-sudo/Tea4Code)](LICENSE)
[![Node.js CI](https://github.com/Nee-sudo/Tea4Code/actions/workflows/node.js.yml/badge.svg)](https://github.com/Nee-sudo/Tea4Code/actions)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> **"Post a bug. Help fix it. Earn tea & samosa."**  
> A fun, collaborative platform where developers **report, solve, and reward** each other for fixing bugs — all over a virtual cup of chai! ☕

---

## ✨ Features

| Feature | Description |
|-------|-------------|
| **GitHub OAuth Login** | Sign in seamlessly with your GitHub account |
| **Post & Browse Bugs** | Report bugs with title, description, code snippets, and screenshots |
| **Reward System** | Offer fun rewards like *"Tea & Samosa"*, *"Pizza"*, or *"High Five"* |
| **Tech Stack Filters** | Filter bugs by `Node.js`, `React`, `Python`, etc. |
| **User Dashboard** | Track your posted bugs, solved issues, and earned rewards |
| **Responsive Design** | Built with **Bootstrap 5** + custom CSS for mobile & desktop |
| **Secure & Scalable** | Helmet, sessions, input validation, and MongoDB backend |
| **Real-Time Updates** | Live feed of new bugs and activity |

---

## 🛠️ Tech Stack

```text
Frontend:     EJS • Bootstrap 5.3 • Custom CSS • Responsive Layout
Backend:      Node.js • Express.js
Database:     MongoDB • Mongoose ODM
Auth:         Passport.js (GitHub OAuth) • Express Session
Security:     Helmet • Input Sanitization
Dev Tools:    ESLint • Prettier • Nodemon • Winston Logger • Jest (Tests)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v16+**
- MongoDB **v6.0+** (Local or [MongoDB Atlas](https://mongodb.com))
- GitHub OAuth App (Create [here](https://github.com/settings/developers))

---

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Nee-sudo/Tea4Code.git
cd Tea4Code

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
```

#### `.env` Configuration
```env
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/tea4code

# Session
SESSION_SECRET=your_very_secure_session_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
```

```bash
# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
Tea4Code/
├── config/               # Passport & app config
├── models/               # Mongoose models (Bug, User)
│   ├── Bug.js
│   └── User.js
├── public/               # Static assets
│   └── styles.css        # Custom CSS with variables
├── routes/               # Express routes
│   ├── bugs.js
│   ├── index.js
│   └── users.js
├── views/                # EJS templates
│   ├── partials/         # Header, footer, navbar
│   ├── dashboard.ejs
│   ├── new-bug.ejs
│   ├── bug.ejs
│   └── profile.ejs
├── server.js             # Entry point
├── .env.example
├── package.json
└── README.md
```

---

## 🧪 Testing

```bash
npm test
```

*(Unit & integration tests with Jest — coming soon!)*

---

## 🚀 Deployment

### Recommended: [Render](https://render.com) / [Railway](https://railway.app) / [Vercel (Node)] 

1. Connect your GitHub repo
2. Set environment variables in dashboard
3. Deploy!

> **Tip**: Use MongoDB Atlas for free cloud database.

---

## 🤝 Contributing

We **love contributions** — whether it's a bug fix, new reward idea, or UI polish!

```bash
# 1. Fork & clone
git clone https://github.com/yourusername/Tea4Code.git

# 2. Create branch
git checkout -b feature/awesome-reward

# 3. Commit & push
git commit -m "Add pizza reward emoji"
git push origin feature/awesome-reward

# 4. Open Pull Request
```

**Guidelines**:
- Follow **Prettier** formatting
- Add comments for complex logic
- Update README if adding features

---

## 🐛 Roadmap

| Status | Feature |
|--------|--------|
| Done | GitHub Login, Bug Posting, Rewards |
| In Progress | Real-time notifications (Socket.io) |
| Planned | Leaderboard, AI bug summarizer, Mobile PWA |

---

## 📄 License

[MIT License](LICENSE) – Free to use, modify, and distribute.

---

## 🙏 Acknowledgments

- Built with ❤️ by **[Neeraj Chauhan](https://github.com/Nee-sudo)**
- Inspired by open-source collaboration and chai breaks
- Thanks to **Bootstrap**, **Express**, and **MongoDB** communities

---

## 📬 Contact

- **GitHub**: [@Nee-sudo](https://github.com/Nee-sudo)
- **Email**: [bhuprajchauhan72087@gmail.com](mailto:bhuprajchauhan72087@gmail.com)
- **Project Link**: [https://github.com/Nee-sudo/Tea4Code](https://github.com/Nee-sudo/Tea4Code)

---

> **Found a bug in Tea4Code?**  
> **Post it here — and offer a virtual chai!**

---

*Last Updated: October 30, 2025*
```

---

### How to Use This README:

1. Go to: [https://github.com/Nee-sudo/Tea4Code](https://github.com/Nee-sudo/Tea4Code)
2. Open `README.md`
3. Replace entire content with the above
4. **Commit** → Done!

---

### Optional Upgrades (Let me know!):
- Add **live demo link** (e.g., `https://tea4code.onrender.com`)
- Add **screenshots** or **demo GIF**
- Add **badges** for test coverage, uptime
- Add **contribution graph** or **visitor count**

---

**Your repo now looks professional, fun, and ready to attract contributors & users!**  
Want the same for your **Incident** repo? Just say the word!
