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

import {
  User,
  BlogPost as BlogPostModel,
  CaseStudy as CaseStudyModel,
  Settings as AppSettingsModel
} from "./models";

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

// Register Models
const Homepage = mongoose.models.Homepage || mongoose.model("Homepage", HomepageSchema);
const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
const ContactMessageModel = mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
const AdminStats = mongoose.models.AdminStats || mongoose.model("AdminStats", AdminStatsSchema);

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
      await CaseStudyModel.insertMany(CASE_STUDIES as any);
      console.log(`Database Seed: ${CASE_STUDIES.length} default industrial case studies initialized.`);
    } else {
      // Sync and update default case studies
      for (const study of CASE_STUDIES) {
        const exists = await CaseStudyModel.findOne({ slug: study.slug } as any);
        if (!exists) {
          await CaseStudyModel.create(study as any);
          console.log(`Database Seed Sync: Missing case study "${study.title}" inserted into MongoDB.`);
        } else {
          await CaseStudyModel.updateOne({ slug: study.slug } as any, { $set: study as any });
        }
      }
    }

    const blogCount = await BlogPostModel.countDocuments();
    if (blogCount === 0) {
      await BlogPostModel.insertMany(DEFAULT_BLOG_POSTS as any);
      console.log(`Database Seed: ${DEFAULT_BLOG_POSTS.length} engineering blog articles initialized.`);
    } else {
      // Sync and update default blog posts
      for (const post of DEFAULT_BLOG_POSTS) {
        const exists = await BlogPostModel.findOne({ slug: post.slug } as any);
        if (!exists) {
          await BlogPostModel.create(post as any);
          console.log(`Database Seed Sync: Missing blog post "${post.title}" inserted into MongoDB.`);
        } else {
          await BlogPostModel.updateOne({ slug: post.slug } as any, { $set: post as any });
        }
      }
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
      await CaseStudyModel.insertMany(CASE_STUDIES as any);
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
    const studies = await CaseStudyModel.insertMany(req.body as any);
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
      await BlogPostModel.insertMany(DEFAULT_BLOG_POSTS as any);
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
    const blogs = await BlogPostModel.insertMany(req.body as any);
    res.json(blogs);
  } catch (err: any) {
    console.error("POST /api/blog-posts Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /sitemap.xml - Dynamic XML Sitemap for SEO Crawlers & AI search bots
app.get("/sitemap.xml", async (req, res) => {
  try {
    const blogs = await BlogPostModel.find({ published: true } as any);
    const caseStudies = await CaseStudyModel.find();
    
    // Construct the root origin dynamically based on request host
    const origin = `${req.protocol}://${req.get("host")}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Home page
    xml += `  <url>\n`;
    xml += `    <loc>${origin}/</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // 2. Main Sections
    const sections = ["work", "expertise", "contact", "admin"];
    for (const section of sections) {
      xml += `  <url>\n`;
      xml += `    <loc>${origin}/#${section}</loc>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    // 3. Blog articles
    for (const blog of blogs) {
      xml += `  <url>\n`;
      xml += `    <loc>${origin}/#/blog/${blog.slug}</loc>\n`;
      // Use fallback if updatedAt is missing
      const rawDate = (blog as any).updatedAt || (blog as any).createdAt || new Date();
      xml += `    <lastmod>${new Date(rawDate).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    // 4. Case Studies
    for (const cs of caseStudies) {
      xml += `  <url>\n`;
      xml += `    <loc>${origin}/#/work/${cs.slug}</loc>\n`;
      const rawDate = (cs as any).updatedAt || (cs as any).createdAt || new Date();
      xml += `    <lastmod>${new Date(rawDate).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (err: any) {
    console.error("GET /sitemap.xml Error:", err);
    res.status(500).send("<error>Failed to generate sitemap</error>");
  }
});

// GET /robots.txt - Rulebook for search engines and AI scraper bots
app.get("/robots.txt", (req, res) => {
  const origin = `${req.protocol}://${req.get("host")}`;
  let txt = `User-agent: *\n`;
  txt += `Allow: /\n`;
  txt += `Disallow: /api/messages\n`; // Prevent scrapers from stealing user messages
  txt += `Disallow: /api/reset-factory-defaults\n`;
  txt += `\n`;
  txt += `Sitemap: ${origin}/sitemap.xml\n`;
  
  res.header("Content-Type", "text/plain");
  res.status(200).send(txt);
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

// DELETE Contact Message
app.delete("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ContactMessageModel.deleteOne({ id });
    
    // Decrement contact requests counter in stats
    let stats = await AdminStats.findOne();
    if (stats) {
      stats.contactRequests = Math.max(0, (stats.contactRequests || 0) - 1);
      await stats.save();
    }
    
    res.json({ success: true, message: `Message ${id} deleted successfully.` });
  } catch (err: any) {
    console.error("DELETE /api/messages Error:", err);
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
    await CaseStudyModel.insertMany(CASE_STUDIES as any);
    await BlogPostModel.insertMany(DEFAULT_BLOG_POSTS as any);
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
