import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { 
  DEFAULT_HOMEPAGE_CONTENT, 
  DEFAULT_PROFILE_DATA, 
  CASE_STUDIES, 
  DEFAULT_BLOG_POSTS, 
  INITIAL_ADMIN_STATS, 
  DEFAULT_APP_SETTINGS 
} from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;

// Use high limits for base64 industrial images and large diagrams upload
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://bdsahin365_db_user:9QOpgX6ta9M0R28k@sahin.atchqgn.mongodb.net/sahin_portfolio?retryWrites=true&w=majority";

console.log("Connecting to MongoDB Atlas...");
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas database.");
    seedDatabase();
  })
  .catch((err) => {
    console.error("CRITICAL: MongoDB connection failure:", err);
  });

// Mongoose Schemas & Models
const HomepageSchema = new mongoose.Schema({
  heroTagline: String,
  heroHeading: String,
  heroSubheading: String,
  heroStat1Val: String,
  heroStat1Label: String,
  heroStat2Val: String,
  heroStat2Label: String,
  heroStat3Val: String,
  heroStat3Label: String,
  heroProfileName: String,
  heroProfileTitle: String,
  heroProfileImage: String,
  heroProfileVideo: String,
  journalTagline: String,
  journalHeading: String,
  journalDesc: String,
  expertiseTagline: String,
  expertiseHeading: String,
  expertiseDesc: String,
  contactTagline: String,
  contactHeading: String,
  contactDesc: String,
  contactEmail: String,
  contactLinkedin: String,
  contactGithub: String,
  headerLogoIcon: String
}, { minimize: false, timestamps: true });

const ProfileSchema = new mongoose.Schema({
  name: String,
  title: String,
  location: String,
  email: String,
  phone: String,
  whatsapp: String,
  summary: String,
  skills: String,
  imageUrl: String,
  experience: [
    {
      role: String,
      company: String,
      period: String,
      details: String
    }
  ],
  education: [
    {
      degree: String,
      institution: String,
      passingYear: String,
      result: String
    }
  ],
  personalDetails: {
    dob: String,
    height: String,
    weight: String,
    bloodGroup: String,
    maritalStatus: String,
    religion: String,
    nationality: String,
    presentAddress: String,
    permanentAddress: String,
    fatherName: String,
    fatherProfession: String,
    motherName: String,
    motherProfession: String,
    siblings: String
  }
}, { minimize: false, timestamps: true });

const CaseStudySchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: String,
  category: String,
  tags: [String],
  shortDesc: String,
  problem: String,
  calculation: String,
  solution: String,
  results: [String],
  imageUrl: String,
  galleryImages: [String],
  duration: String,
  specs: {
    voltage: String,
    capacity: String,
    duration: String,
    equipment: String,
    standard: String,
    sector: String
  }
}, { minimize: false, timestamps: true });

const BlogPostSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: String,
  category: String,
  date: String,
  readTime: String,
  summary: String,
  content: String,
  tags: [String],
  imageUrl: String,
  published: Boolean
}, { minimize: false, timestamps: true });

const ContactMessageSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  company: String,
  message: String,
  date: String
}, { minimize: false, timestamps: true });

const AdminStatsSchema = new mongoose.Schema({
  visitors: { type: Number, default: 0 },
  caseStudiesCount: { type: Number, default: 0 },
  contactRequests: { type: Number, default: 0 },
  avgReadTime: { type: String, default: "5 min" }
}, { minimize: false, timestamps: true });

const AppSettingsSchema = new mongoose.Schema({
  showBottomNav: Boolean,
  defaultTheme: String
}, { minimize: false, timestamps: true });

// Register Models
const Homepage = mongoose.models.Homepage || mongoose.model("Homepage", HomepageSchema);
const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
const CaseStudyModel = mongoose.models.CaseStudy || mongoose.model("CaseStudy", CaseStudySchema);
const BlogPostModel = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
const ContactMessageModel = mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
const AdminStats = mongoose.models.AdminStats || mongoose.model("AdminStats", AdminStatsSchema);
const AppSettingsModel = mongoose.models.AppSettings || mongoose.model("AppSettings", AppSettingsSchema);

// Database Seeder Function
async function seedDatabase() {
  try {
    console.log("Verifying MongoDB initialization seeds...");

    const homepageCount = await Homepage.countDocuments();
    if (homepageCount === 0) {
      await Homepage.create(DEFAULT_HOMEPAGE_CONTENT);
      console.log("Database Seed: Default homepage content initialized.");
    }

    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create(DEFAULT_PROFILE_DATA);
      console.log("Database Seed: Default profile CV / biodata initialized.");
    }

    const caseCount = await CaseStudyModel.countDocuments();
    if (caseCount === 0) {
      await CaseStudyModel.insertMany(CASE_STUDIES);
      console.log(`Database Seed: ${CASE_STUDIES.length} default industrial case studies initialized.`);
    }

    const blogCount = await BlogPostModel.countDocuments();
    if (blogCount === 0) {
      await BlogPostModel.insertMany(DEFAULT_BLOG_POSTS);
      console.log(`Database Seed: ${DEFAULT_BLOG_POSTS.length} engineering blog articles initialized.`);
    }

    const statsCount = await AdminStats.countDocuments();
    if (statsCount === 0) {
      await AdminStats.create(INITIAL_ADMIN_STATS);
      console.log("Database Seed: Default stats matrices initialized.");
    }

    const settingsCount = await AppSettingsModel.countDocuments();
    if (settingsCount === 0) {
      await AppSettingsModel.create(DEFAULT_APP_SETTINGS);
      console.log("Database Seed: Default user settings initialized.");
    }

    console.log("MongoDB data synchronization and seed verification complete.");
  } catch (err) {
    console.error("ERROR during database seeding:", err);
  }
}

// API Routes
// GET & POST Homepage Content
app.get("/api/homepage", async (req, res) => {
  try {
    let content = await Homepage.findOne();
    if (!content) {
      content = await Homepage.create(DEFAULT_HOMEPAGE_CONTENT);
    }
    res.json(content);
  } catch (err: any) {
    console.error("GET /api/homepage Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/homepage", async (req, res) => {
  try {
    let content = await Homepage.findOne();
    if (content) {
      Object.assign(content, req.body);
      await content.save();
    } else {
      content = await Homepage.create(req.body);
    }
    res.json(content);
  } catch (err: any) {
    console.error("POST /api/homepage Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET & POST Profile / CV Biodata Data
app.get("/api/profile", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(DEFAULT_PROFILE_DATA);
    }
    res.json(profile);
  } catch (err: any) {
    console.error("GET /api/profile Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/profile", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      // Clear subdocument arrays to prevent overlap/mismatch issues
      profile.experience = [];
      profile.education = [];
      await profile.save();
      
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      profile = await Profile.create(req.body);
    }
    res.json(profile);
  } catch (err: any) {
    console.error("POST /api/profile Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET & POST Case Studies (CRUD fallback bulk-overwrite matches UI design)
app.get("/api/case-studies", async (req, res) => {
  try {
    let studies = await CaseStudyModel.find().sort({ createdAt: -1 });
    if (studies.length === 0) {
      await CaseStudyModel.insertMany(CASE_STUDIES);
      studies = await CaseStudyModel.find().sort({ createdAt: -1 });
    }
    res.json(studies);
  } catch (err: any) {
    console.error("GET /api/case-studies Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/case-studies", async (req, res) => {
  try {
    await CaseStudyModel.deleteMany({});
    const studies = await CaseStudyModel.insertMany(req.body);
    res.json(studies);
  } catch (err: any) {
    console.error("POST /api/case-studies Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET & POST Blog Posts (CRUD fallback bulk-overwrite matches UI design)
app.get("/api/blog-posts", async (req, res) => {
  try {
    let blogs = await BlogPostModel.find().sort({ createdAt: -1 });
    if (blogs.length === 0) {
      await BlogPostModel.insertMany(DEFAULT_BLOG_POSTS);
      blogs = await BlogPostModel.find().sort({ createdAt: -1 });
    }
    res.json(blogs);
  } catch (err: any) {
    console.error("GET /api/blog-posts Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/blog-posts", async (req, res) => {
  try {
    await BlogPostModel.deleteMany({});
    const blogs = await BlogPostModel.insertMany(req.body);
    res.json(blogs);
  } catch (err: any) {
    console.error("POST /api/blog-posts Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET & POST Contact Messages
app.get("/api/messages", async (req, res) => {
  try {
    const msgs = await ContactMessageModel.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err: any) {
    console.error("GET /api/messages Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const msg = await ContactMessageModel.create(req.body);
    
    // Auto increment contact requests counter in stats
    let stats = await AdminStats.findOne();
    if (!stats) {
      stats = await AdminStats.create(INITIAL_ADMIN_STATS);
    }
    stats.contactRequests = (stats.contactRequests || 0) + 1;
    await stats.save();

    res.json(msg);
  } catch (err: any) {
    console.error("POST /api/messages Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET & POST Admin Stats
app.get("/api/stats", async (req, res) => {
  try {
    let stats = await AdminStats.findOne();
    if (!stats) {
      stats = await AdminStats.create(INITIAL_ADMIN_STATS);
    }
    res.json(stats);
  } catch (err: any) {
    console.error("GET /api/stats Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/stats", async (req, res) => {
  try {
    let stats = await AdminStats.findOne();
    if (stats) {
      Object.assign(stats, req.body);
      await stats.save();
    } else {
      stats = await AdminStats.create(req.body);
    }
    res.json(stats);
  } catch (err: any) {
    console.error("POST /api/stats Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET & POST App Settings
app.get("/api/settings", async (req, res) => {
  try {
    let settings = await AppSettingsModel.findOne();
    if (!settings) {
      settings = await AppSettingsModel.create(DEFAULT_APP_SETTINGS);
    }
    res.json(settings);
  } catch (err: any) {
    console.error("GET /api/settings Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    let settings = await AppSettingsModel.findOne();
    if (settings) {
      Object.assign(settings, req.body);
      await settings.save();
    } else {
      settings = await AppSettingsModel.create(req.body);
    }
    res.json(settings);
  } catch (err: any) {
    console.error("POST /api/settings Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// RESTORE ALL TO FACTORY DEFAULTS
app.post("/api/reset-factory-defaults", async (req, res) => {
  try {
    await Homepage.deleteMany({});
    await Profile.deleteMany({});
    await CaseStudyModel.deleteMany({});
    await BlogPostModel.deleteMany({});
    await ContactMessageModel.deleteMany({});
    await AdminStats.deleteMany({});
    await AppSettingsModel.deleteMany({});

    await Homepage.create(DEFAULT_HOMEPAGE_CONTENT);
    await Profile.create(DEFAULT_PROFILE_DATA);
    await CaseStudyModel.insertMany(CASE_STUDIES);
    await BlogPostModel.insertMany(DEFAULT_BLOG_POSTS);
    await AdminStats.create(INITIAL_ADMIN_STATS);
    await AppSettingsModel.create(DEFAULT_APP_SETTINGS);

    res.json({ success: true, message: "Successfully reset database to factory defaults." });
  } catch (err: any) {
    console.error("POST /api/reset-factory-defaults Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Integrate Vite Middleware or Production Fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving built production assets from dist/ folder.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is booting. Port: ${PORT}`);
    console.log(`Application accessible at http://localhost:${PORT}`);
  });
}

startServer();
