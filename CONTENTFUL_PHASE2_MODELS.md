# Phase 2: Contentful Content Models (Case Study, Homepage, Blog)

## Model 1: Case Study (Enterprise Edition)

### Current → New Improvements

| Aspect | Current | Improved | Benefit |
|--------|---------|----------|---------|
| Structure | Flat fields | Organized field groups | Faster editor workflow |
| Companies | Text string | Referenced entry | No duplication |
| Assets | URL strings | Contentful Assets | Optimization & versioning |
| Categories | Text | Multiple references | Better organization |
| SEO | Missing | Complete fields | Better search rankings |
| Publishing | None | Full workflow | Team collaboration |
| Images | One featured | Gallery + featured | Richer content |
| Status | None | Draft/Published/Archived | Content lifecycle management |

### Complete Field Structure

```json
{
  "sys": {
    "id": "caseStudy"
  },
  "displayField": "title",
  "name": "Case Study",
  "description": "Project case studies showcasing client work and results",
  "fields": [
    {
      "groupId": "general",
      "name": "General Information"
    },
    {
      "id": "internalId",
      "name": "Internal ID",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "pattern": "^[a-z0-9\\-]+$",
          "message": "Lowercase alphanumeric with hyphens only"
        },
        {
          "unique": true,
          "message": "ID must be unique"
        }
      ],
      "groupId": "general"
    },
    {
      "id": "title",
      "name": "Project Title",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "size": {
            "max": 120
          }
        }
      ],
      "helpText": "Main title displayed for this case study",
      "groupId": "general"
    },
    {
      "id": "slug",
      "name": "URL Slug",
      "type": "Slug",
      "required": true,
      "validations": [],
      "appearance": "slugEditor",
      "groupId": "general"
    },
    {
      "id": "status",
      "name": "Content Status",
      "type": "Symbol",
      "required": true,
      "validations": [],
      "appearance": "dropdown",
      "defaultValue": "draft",
      "helpText": "Draft = Not visible | Published = Live | Archived = Hidden",
      "groupId": "general"
    },
    {
      "id": "featured",
      "name": "Featured Case Study",
      "type": "Boolean",
      "required": false,
      "defaultValue": false,
      "helpText": "Show on homepage and featured section",
      "groupId": "general"
    },
    {
      "id": "featuredOrder",
      "name": "Featured Display Order",
      "type": "Integer",
      "required": false,
      "validations": [],
      "appearance": "numberEditor",
      "helpText": "Lower numbers appear first (1, 2, 3, etc.)",
      "groupId": "general"
    },
    {
      "groupId": "content",
      "name": "Core Content"
    },
    {
      "id": "clientName",
      "name": "Client Name",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "size": {
            "max": 100
          }
        }
      ],
      "helpText": "Display name of the client (e.g., 'TechCorp Inc')",
      "groupId": "content"
    },
    {
      "id": "clientCompany",
      "name": "Client Company (Reference)",
      "type": "Link",
      "linkType": "Entry",
      "required": false,
      "validations": [
        {
          "linkContentType": ["company"]
        }
      ],
      "helpText": "Link to company entry for reusable company data",
      "groupId": "content"
    },
    {
      "id": "projectOverview",
      "name": "Project Overview",
      "type": "RichText",
      "required": true,
      "validations": [
        {
          "size": {
            "min": 100,
            "max": 2000
          }
        }
      ],
      "helpText": "High-level summary of the project (100-2000 characters)",
      "appearance": "richTextEditor",
      "groupId": "content"
    },
    {
      "id": "challenge",
      "name": "Challenge",
      "type": "RichText",
      "required": true,
      "validations": [
        {
          "size": {
            "min": 100,
            "max": 2000
          }
        }
      ],
      "helpText": "Problems the client faced before our solution",
      "appearance": "richTextEditor",
      "groupId": "content"
    },
    {
      "id": "solution",
      "name": "Solution",
      "type": "RichText",
      "required": true,
      "validations": [
        {
          "size": {
            "min": 100,
            "max": 2000
          }
        }
      ],
      "helpText": "How we solved the challenge",
      "appearance": "richTextEditor",
      "groupId": "content"
    },
    {
      "id": "results",
      "name": "Results & Impact",
      "type": "RichText",
      "required": true,
      "validations": [
        {
          "size": {
            "min": 100,
            "max": 2000
          }
        }
      ],
      "helpText": "Measurable outcomes and business impact",
      "appearance": "richTextEditor",
      "groupId": "content"
    },
    {
      "id": "testimonial",
      "name": "Client Testimonial (Quote)",
      "type": "Text",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 500
          }
        }
      ],
      "appearance": "multipleLine",
      "helpText": "Optional direct quote from client",
      "groupId": "content"
    },
    {
      "groupId": "classification",
      "name": "Classification & Tagging"
    },
    {
      "id": "categories",
      "name": "Categories",
      "type": "Array",
      "items": {
        "type": "Link",
        "linkType": "Entry",
        "validations": [
          {
            "linkContentType": ["category"]
          }
        ]
      },
      "required": false,
      "validations": [
        {
          "size": {
            "max": 5
          }
        }
      ],
      "helpText": "Select up to 5 categories (Web Dev, Design, Mobile, etc.)",
      "groupId": "classification"
    },
    {
      "id": "sectors",
      "name": "Industry Sectors",
      "type": "Array",
      "items": {
        "type": "Link",
        "linkType": "Entry",
        "validations": [
          {
            "linkContentType": ["sector"]
          }
        ]
      },
      "required": false,
      "validations": [
        {
          "size": {
            "max": 5
          }
        }
      ],
      "helpText": "Industries this case study applies to",
      "groupId": "classification"
    },
    {
      "id": "technologies",
      "name": "Technologies Used",
      "type": "Object",
      "required": false,
      "helpText": "List of technologies (React, Node.js, AWS, etc.)",
      "groupId": "classification"
    },
    {
      "groupId": "media",
      "name": "Media & Assets"
    },
    {
      "id": "featuredImage",
      "name": "Featured Image (Hero)",
      "type": "Link",
      "linkType": "Asset",
      "required": true,
      "validations": [
        {
          "assetImageDimensions": {
            "width": {
              "min": 1000,
              "max": 2000
            },
            "height": {
              "min": 500,
              "max": 1000
            }
          }
        },
        {
          "assetFileSize": {
            "max": 5242880
          }
        }
      ],
      "helpText": "Main hero image (recommended: 1200x600px, max 5MB)",
      "groupId": "media"
    },
    {
      "id": "galleryImages",
      "name": "Gallery Images",
      "type": "Array",
      "items": {
        "type": "Link",
        "linkType": "Asset"
      },
      "required": false,
      "validations": [
        {
          "size": {
            "max": 10
          }
        }
      ],
      "helpText": "Additional project images (max 10)",
      "groupId": "media"
    },
    {
      "id": "videoUrl",
      "name": "Video URL (YouTube/Vimeo)",
      "type": "Symbol",
      "required": false,
      "validations": [],
      "helpText": "Full URL to video (e.g., https://youtube.com/watch?v=...)",
      "groupId": "media"
    },
    {
      "groupId": "details",
      "name": "Project Details"
    },
    {
      "id": "duration",
      "name": "Project Duration",
      "type": "Symbol",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 50
          }
        }
      ],
      "helpText": "e.g., '3 months', '6 weeks', '90 days'",
      "groupId": "details"
    },
    {
      "id": "teamMembers",
      "name": "Team Members Involved",
      "type": "Array",
      "items": {
        "type": "Link",
        "linkType": "Entry",
        "validations": [
          {
            "linkContentType": ["teamMember"]
          }
        ]
      },
      "required": false,
      "validations": [
        {
          "size": {
            "max": 10
          }
        }
      ],
      "helpText": "Team members who worked on this project",
      "groupId": "details"
    },
    {
      "id": "clientWebsite",
      "name": "Client Website",
      "type": "Symbol",
      "required": false,
      "validations": [
        {
          "regexp": {
            "pattern": "^https?://.*"
          }
        }
      ],
      "helpText": "Client's website URL",
      "groupId": "details"
    },
    {
      "id": "projectLink",
      "name": "Project/Demo Link",
      "type": "Symbol",
      "required": false,
      "validations": [
        {
          "regexp": {
            "pattern": "^https?://.*"
          }
        }
      ],
      "helpText": "Link to live project or demo",
      "groupId": "details"
    },
    {
      "id": "budget",
      "name": "Budget/Investment",
      "type": "Symbol",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 100
          }
        }
      ],
      "helpText": "e.g., 'Confidential', '$50K-$100K', 'Open'",
      "groupId": "details"
    },
    {
      "groupId": "seo",
      "name": "SEO & Social"
    },
    {
      "id": "seoTitle",
      "name": "SEO Title",
      "type": "Symbol",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 60
          }
        }
      ],
      "helpText": "Search engine title (60 chars max) - auto-generated from title if empty",
      "groupId": "seo"
    },
    {
      "id": "seoDescription",
      "name": "SEO Description",
      "type": "Symbol",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 160
          }
        }
      ],
      "helpText": "Meta description for search results (160 chars max)",
      "groupId": "seo"
    },
    {
      "id": "seoKeywords",
      "name": "SEO Keywords",
      "type": "Symbol",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 200
          }
        }
      ],
      "helpText": "Comma-separated keywords (optional, not heavily weighted by modern search engines)",
      "groupId": "seo"
    },
    {
      "id": "ogImage",
      "name": "Open Graph Image (Social Share)",
      "type": "Link",
      "linkType": "Asset",
      "required": false,
      "validations": [
        {
          "assetImageDimensions": {
            "width": {
              "min": 1000,
              "max": 2000
            },
            "height": {
              "min": 500,
              "max": 1000
            }
          }
        }
      ],
      "helpText": "Image for social media sharing (1200x630px recommended)",
      "groupId": "seo"
    },
    {
      "id": "canonicalUrl",
      "name": "Canonical URL",
      "type": "Symbol",
      "required": false,
      "validations": [
        {
          "regexp": {
            "pattern": "^https?://.*"
          }
        }
      ],
      "helpText": "Use if content is duplicated elsewhere - prevents SEO penalties",
      "groupId": "seo"
    },
    {
      "groupId": "publishing",
      "name": "Publishing & Workflow"
    },
    {
      "id": "publishedDate",
      "name": "Published Date",
      "type": "Date",
      "required": true,
      "helpText": "When this case study is/was published",
      "groupId": "publishing"
    },
    {
      "id": "scheduledPublishDate",
      "name": "Scheduled Publish Date",
      "type": "Date",
      "required": false,
      "helpText": "Automatically publish at this date/time (optional)",
      "groupId": "publishing"
    },
    {
      "id": "scheduledUnpublishDate",
      "name": "Scheduled Unpublish Date",
      "type": "Date",
      "required": false,
      "helpText": "Automatically hide/archive at this date/time (optional)",
      "groupId": "publishing"
    },
    {
      "id": "approvalStatus",
      "name": "Approval Status",
      "type": "Symbol",
      "required": true,
      "appearance": "dropdown",
      "defaultValue": "pending",
      "helpText": "Pending = Awaiting review | Approved = Ready | Rejected = Needs changes",
      "groupId": "publishing"
    },
    {
      "id": "approvalNotes",
      "name": "Approval/Review Notes",
      "type": "Text",
      "required": false,
      "appearance": "multipleLine",
      "helpText": "Feedback from reviewers or approval notes",
      "groupId": "publishing"
    },
    {
      "id": "contentVersion",
      "name": "Content Version",
      "type": "Integer",
      "required": false,
      "helpText": "Auto-managed version counter",
      "groupId": "publishing"
    },
    {
      "groupId": "advanced",
      "name": "Advanced Settings"
    },
    {
      "id": "internalNotes",
      "name": "Internal Notes",
      "type": "Text",
      "required": false,
      "appearance": "multipleLine",
      "helpText": "Editor-only notes (not visible to readers)",
      "groupId": "advanced"
    },
    {
      "id": "archiveReason",
      "name": "Archive Reason",
      "type": "Text",
      "required": false,
      "appearance": "multipleLine",
      "helpText": "Why was this archived? (for reference)",
      "groupId": "advanced"
    },
    {
      "id": "metadataTags",
      "name": "Custom Metadata",
      "type": "Object",
      "required": false,
      "helpText": "Custom JSON for future integrations (analytics, tracking, etc.)",
      "groupId": "advanced"
    }
  ]
}
```

### Editor Interface Layout

```
┌─────────────────────────────────────────────────┐
│  CASE STUDY: Project Title                      │
│  slug-here  [Status: Draft]  [Featured: Yes]   │
├─────────────────────────────────────────────────┤
│  Tabs:                                          │
│  [ Overview ] [ Content ] [ Media ] [ Classify ]│
│  [ Details ] [ SEO ] [ Publishing ] [ Advanced]│
├─────────────────────────────────────────────────┤
│  OVERVIEW TAB:                                  │
│  ├─ Client Name: [TechCorp Inc]                │
│  ├─ Client Company: [Select Company...]        │
│  ├─ Featured Image: [Upload/Select Asset]      │
│  ├─ Featured checkbox + order                  │
│  └─ Quick Status badge                         │
├─────────────────────────────────────────────────┤
│  CONTENT TAB:                                   │
│  ├─ Project Overview [Rich Text Editor]        │
│  ├─ Challenge [Rich Text Editor]               │
│  ├─ Solution [Rich Text Editor]                │
│  ├─ Results [Rich Text Editor]                 │
│  └─ Testimonial [Text Area]                    │
├─────────────────────────────────────────────────┤
│  SIDEBAR (Always visible):                     │
│  ├─ Publication Status                         │
│  ├─ Approval Status                            │
│  ├─ Published Date                             │
│  ├─ Scheduling Options                         │
│  ├─ Approval Notes                             │
│  └─ Version History Link                       │
└─────────────────────────────────────────────────┘
```

### Example Case Study Entry

```json
{
  "sys": {
    "id": "case-study-001",
    "type": "Entry",
    "contentType": {
      "sys": {
        "id": "caseStudy"
      }
    }
  },
  "fields": {
    "internalId": "techcorp-platform",
    "title": "SaaS Platform Rebuild for TechCorp",
    "slug": "techcorp-saas-platform",
    "status": "published",
    "featured": true,
    "featuredOrder": 1,
    "clientName": "TechCorp Inc.",
    "clientCompany": {
      "sys": {
        "id": "company-techcorp-001",
        "type": "Link",
        "linkType": "Entry"
      }
    },
    "projectOverview": "Redesigned and rebuilt TechCorp's aging SaaS platform to improve user experience, add enterprise features, and scale infrastructure.",
    "challenge": "TechCorp's legacy platform was difficult to use, lacked modern features, and couldn't scale beyond 10,000 concurrent users.",
    "solution": "We completely rebuilt the platform using React, Node.js, and AWS, implementing a modern architecture that supports unlimited scaling.",
    "results": "60% improvement in user satisfaction, 10x increase in platform capacity, 40% reduction in support tickets.",
    "testimonial": "The new platform transformed how our customers interact with our service. This rebuild was essential to our growth.",
    "categories": [
      {"sys": {"id": "web-dev", "type": "Link", "linkType": "Entry"}},
      {"sys": {"id": "saas", "type": "Link", "linkType": "Entry"}}
    ],
    "sectors": [
      {"sys": {"id": "technology", "type": "Link", "linkType": "Entry"}}
    ],
    "technologies": {
      "frontend": ["React", "TypeScript", "Tailwind CSS"],
      "backend": ["Node.js", "Express", "PostgreSQL"],
      "infrastructure": ["AWS", "Docker", "Kubernetes"]
    },
    "featuredImage": {
      "sys": {"id": "asset-techcorp-hero", "type": "Link", "linkType": "Asset"}
    },
    "galleryImages": [
      {"sys": {"id": "asset-techcorp-1", "type": "Link", "linkType": "Asset"}},
      {"sys": {"id": "asset-techcorp-2", "type": "Link", "linkType": "Asset"}}
    ],
    "videoUrl": "https://youtube.com/watch?v=example",
    "duration": "6 months",
    "teamMembers": [
      {"sys": {"id": "team-sahin", "type": "Link", "linkType": "Entry"}},
      {"sys": {"id": "team-dev-1", "type": "Link", "linkType": "Entry"}}
    ],
    "clientWebsite": "https://techcorp.com",
    "projectLink": "https://app.techcorp.com",
    "budget": "$150K-$200K",
    "seoTitle": "SaaS Platform Rebuild | Case Study | TechCorp Project",
    "seoDescription": "Learn how we rebuilt TechCorp's SaaS platform to improve UX, add enterprise features, and scale to 10x capacity.",
    "seoKeywords": "SaaS, platform rebuild, React, Node.js, scaling",
    "ogImage": {"sys": {"id": "asset-techcorp-og", "type": "Link", "linkType": "Asset"}},
    "publishedDate": "2024-01-15",
    "approvalStatus": "approved",
    "internalNotes": "Great case study. Strong metrics. Use for homepage featured section."
  }
}
```

---

## Migration from Current to New Case Study Model

### Step 1: Audit Current Data
```javascript
// Current structure to migrate from:
{
  id: "case-001",
  title: "TechCorp Project",
  clientName: "TechCorp Inc",
  overview: "...",
  challenge: "...",
  solution: "...",
  results: "...",
  image: "url-to-image",
  categories: ["web", "saas"],
  testimonial: "...",
  // Missing: SEO, workflow, scheduling, relationships
}
```

### Step 2: Mapping Strategy
```javascript
// Old → New field mapping
const fieldMapping = {
  "id" → "internalId" (normalized to kebab-case),
  "title" → "title",
  "clientName" → "clientName",
  "overview" → "projectOverview",
  "challenge" → "challenge",
  "solution" → "solution",
  "results" → "results",
  "image" → "featuredImage" (upload to Contentful Assets),
  "categories" → "categories" (map to new Category entries),
  "testimonial" → "testimonial",
  
  // New fields with defaults:
  "slug" → auto-generate from title,
  "status" → "published" (if currently active),
  "featured" → false,
  "publishedDate" → today,
  "approvalStatus" → "approved",
}
```

### Step 3: Migration Process

```bash
# Pseudo-code for migration script
foreach (oldCaseStudy in oldDatabase) {
  // 1. Lookup or create Category entries
  categories = oldCaseStudy.categories.map(cat => {
    return findOrCreateCategory(cat);
  });
  
  // 2. Upload image to Contentful Assets
  featuredImage = uploadImageToContentful(oldCaseStudy.image);
  
  // 3. Create new case study entry
  newCaseStudy = {
    internalId: normalizeToKebabCase(oldCaseStudy.id),
    title: oldCaseStudy.title,
    slug: generateSlug(oldCaseStudy.title),
    clientName: oldCaseStudy.clientName,
    projectOverview: oldCaseStudy.overview,
    challenge: oldCaseStudy.challenge,
    solution: oldCaseStudy.solution,
    results: oldCaseStudy.results,
    testimonial: oldCaseStudy.testimonial,
    featuredImage: featuredImage,
    categories: categories,
    status: "published",
    publishedDate: new Date(),
    approvalStatus: "approved",
    seoTitle: oldCaseStudy.title + " | Case Study",
    seoDescription: generateSEODescription(oldCaseStudy.overview),
  };
  
  // 4. Create entry in Contentful
  createContentfulEntry(newCaseStudy);
}
```

### Step 4: Website Compatibility

Your website frontend needs **NO changes** because:

```typescript
// The service layer abstracts the migration
export async function getCaseStudies() {
  const entries = await contentfulClient.getEntries({
    content_type: 'caseStudy' // New model
  });
  
  // Return same shape as before
  return entries.items.map(entry => ({
    id: entry.fields.internalId,
    title: entry.fields.title,
    slug: entry.fields.slug,
    clientName: entry.fields.clientName,
    overview: entry.fields.projectOverview,
    challenge: entry.fields.challenge,
    solution: entry.fields.solution,
    results: entry.fields.results,
    image: entry.fields.featuredImage.fields.file.url,
    categories: entry.fields.categories.map(cat => cat.fields.slug),
    testimonial: entry.fields.testimonial
  }));
}

// Your frontend receives exact same data shape as before
// No breaking changes! ✅
```

---

## Benefits Summary

✅ **Better Editor Experience** - Organized field groups, clear hierarchy
✅ **SEO Improvements** - Complete SEO fields enable better rankings
✅ **Content Relationships** - Companies, categories, team members referenced (no duplication)
✅ **Asset Management** - Images in Contentful for optimization
✅ **Workflow Support** - Approval, scheduling, versioning
✅ **Non-Breaking** - Website frontend unchanged
✅ **Scalable** - Ready for 100x more case studies
✅ **Team Collaboration** - Clear approval workflows

