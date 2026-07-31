# Phase 1: Contentful Taxonomy & Reference Models

## Model 1: Category

### Contentful Configuration

```json
{
  "sys": {
    "id": "category"
  },
  "displayField": "name",
  "name": "Category",
  "description": "Content categories for organizing case studies, blog posts, and products",
  "fields": [
    {
      "id": "internalName",
      "name": "Internal Name",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "pattern": "^[a-z0-9\\-]+$",
          "message": "Must be lowercase alphanumeric with hyphens only"
        }
      ],
      "appearance": "inputField"
    },
    {
      "id": "name",
      "name": "Name",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "size": {
            "max": 100
          }
        }
      ],
      "appearance": "inputField"
    },
    {
      "id": "slug",
      "name": "Slug",
      "type": "Slug",
      "required": true,
      "validations": [],
      "appearance": "slugEditor"
    },
    {
      "id": "description",
      "name": "Description",
      "type": "Text",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 200
          }
        }
      ],
      "appearance": "inputField"
    },
    {
      "id": "icon",
      "name": "Icon",
      "type": "Symbol",
      "required": false,
      "validations": [],
      "appearance": "inputField",
      "helpText": "Icon identifier (e.g., 'briefcase', 'code', 'design'). Use in frontend for display."
    },
    {
      "id": "color",
      "name": "Color/Badge Style",
      "type": "Symbol",
      "required": false,
      "validations": [],
      "appearance": "dropdown",
      "helpText": "Visual style for category badges"
    },
    {
      "id": "displayOrder",
      "name": "Display Order",
      "type": "Integer",
      "required": false,
      "validations": [],
      "appearance": "numberEditor"
    }
  ]
}
```

### Entry Templates

```javascript
// Example Entries
const categories = [
  {
    "internalName": "web-dev",
    "name": "Web Development",
    "slug": "web-dev",
    "description": "Full-stack and frontend web applications",
    "icon": "globe",
    "color": "blue",
    "displayOrder": 1
  },
  {
    "internalName": "ui-ux",
    "name": "UI/UX Design",
    "slug": "ui-ux",
    "description": "User interface and experience design",
    "icon": "palette",
    "color": "purple",
    "displayOrder": 2
  },
  {
    "internalName": "mobile-apps",
    "name": "Mobile Apps",
    "slug": "mobile-apps",
    "description": "iOS and Android applications",
    "icon": "smartphone",
    "color": "green",
    "displayOrder": 3
  },
  {
    "internalName": "branding",
    "name": "Branding",
    "slug": "branding",
    "description": "Brand identity and visual guidelines",
    "icon": "tag",
    "color": "orange",
    "displayOrder": 4
  }
];
```

---

## Model 2: Sector

### Contentful Configuration

```json
{
  "sys": {
    "id": "sector"
  },
  "displayField": "name",
  "name": "Sector",
  "description": "Industry sectors for case studies and companies",
  "fields": [
    {
      "id": "internalName",
      "name": "Internal Name",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "pattern": "^[a-z0-9\\-]+$",
          "message": "Must be lowercase alphanumeric with hyphens only"
        }
      ]
    },
    {
      "id": "name",
      "name": "Sector Name",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "size": {
            "max": 100
          }
        }
      ]
    },
    {
      "id": "slug",
      "name": "Slug",
      "type": "Slug",
      "required": true
    },
    {
      "id": "description",
      "name": "Description",
      "type": "Text",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 300
          }
        }
      ]
    },
    {
      "id": "industryCode",
      "name": "Industry Code",
      "type": "Symbol",
      "required": false,
      "validations": [],
      "helpText": "Internal code for analytics and filtering (e.g., 'tech', 'fin', 'health')"
    }
  ]
}
```

### Entry Templates

```javascript
const sectors = [
  {
    "internalName": "technology",
    "name": "Technology",
    "slug": "technology",
    "description": "Software, SaaS, and tech companies",
    "industryCode": "tech"
  },
  {
    "internalName": "finance",
    "name": "Finance",
    "slug": "finance",
    "description": "Financial services, fintech, banking",
    "industryCode": "fin"
  },
  {
    "internalName": "healthcare",
    "name": "Healthcare",
    "slug": "healthcare",
    "description": "Healthcare, medical, wellness",
    "industryCode": "health"
  },
  {
    "internalName": "ecommerce",
    "name": "E-Commerce",
    "slug": "ecommerce",
    "description": "Online retail, marketplaces, shopping",
    "industryCode": "ecom"
  },
  {
    "internalName": "saas",
    "name": "SaaS",
    "slug": "saas",
    "description": "Software as a Service platforms",
    "industryCode": "saas"
  }
];
```

---

## Model 3: Team Member

### Contentful Configuration

```json
{
  "sys": {
    "id": "teamMember"
  },
  "displayField": "name",
  "name": "Team Member",
  "description": "Team members, authors, and content creators",
  "fields": [
    {
      "id": "internalId",
      "name": "Internal ID",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "pattern": "^[a-z0-9\\-]+$"
        }
      ],
      "appearance": "inputField"
    },
    {
      "id": "name",
      "name": "Full Name",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "size": {
            "max": 100
          }
        }
      ]
    },
    {
      "id": "email",
      "name": "Email Address",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "regexp": {
            "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
          }
        }
      ]
    },
    {
      "id": "role",
      "name": "Role/Position",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "size": {
            "max": 50
          }
        }
      ]
    },
    {
      "id": "bio",
      "name": "Bio",
      "type": "Text",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 500
          }
        }
      ],
      "appearance": "multipleLine"
    },
    {
      "id": "avatar",
      "name": "Avatar Image",
      "type": "Link",
      "linkType": "Asset",
      "required": false,
      "validations": [
        {
          "assetImageDimensions": {
            "width": {
              "min": 200,
              "max": 500
            },
            "height": {
              "min": 200,
              "max": 500
            }
          }
        }
      ]
    },
    {
      "id": "socialLinks",
      "name": "Social Media Links",
      "type": "Object",
      "required": false,
      "helpText": "Links to professional profiles"
    },
    {
      "id": "isActive",
      "name": "Active Member",
      "type": "Boolean",
      "required": true,
      "defaultValue": true
    }
  ]
}
```

### Entry Example

```javascript
{
  "internalId": "sahin-alom",
  "name": "Sahin Alom",
  "email": "sahin@example.com",
  "role": "Founder & Principal Architect",
  "bio": "Full-stack developer and CMS specialist with 8+ years of experience building scalable web applications.",
  "avatar": { "sys": { "id": "asset-id", "type": "Link" } },
  "socialLinks": {
    "twitter": "https://twitter.com/sahinalom",
    "linkedin": "https://linkedin.com/in/sahinalom",
    "github": "https://github.com/sahinalom"
  },
  "isActive": true
}
```

---

## Model 4: Company

### Contentful Configuration

```json
{
  "sys": {
    "id": "company"
  },
  "displayField": "name",
  "name": "Company",
  "description": "Client companies and case study clients",
  "fields": [
    {
      "id": "internalId",
      "name": "Internal ID",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "pattern": "^[a-z0-9\\-]+$"
        }
      ]
    },
    {
      "id": "name",
      "name": "Company Name",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "size": {
            "max": 150
          }
        }
      ]
    },
    {
      "id": "website",
      "name": "Website URL",
      "type": "Symbol",
      "required": false,
      "validations": [
        {
          "regexp": {
            "pattern": "^https?://.*"
          }
        }
      ]
    },
    {
      "id": "logo",
      "name": "Logo",
      "type": "Link",
      "linkType": "Asset",
      "required": false
    },
    {
      "id": "sector",
      "name": "Industry Sector",
      "type": "Link",
      "linkType": "Entry",
      "required": false,
      "validations": [
        {
          "linkContentType": ["sector"]
        }
      ]
    },
    {
      "id": "companySize",
      "name": "Company Size",
      "type": "Symbol",
      "required": false,
      "validations": [],
      "appearance": "dropdown"
    },
    {
      "id": "location",
      "name": "Location",
      "type": "Symbol",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 100
          }
        }
      ]
    },
    {
      "id": "description",
      "name": "Description",
      "type": "Text",
      "required": false,
      "validations": [
        {
          "size": {
            "max": 500
          }
        }
      ],
      "appearance": "multipleLine"
    }
  ]
}
```

---

## Creation Instructions for Contentful UI

### Step-by-Step:

1. **Go to Content Model**
   - Contentful Dashboard → Your Space → Content Model

2. **Create New Content Type**
   - Click "Create Content Type"
   - Name: "Category"
   - API ID: "category"
   - Click "Create"

3. **Add Fields**
   - Follow the field structure above
   - Set display field (usually "name")
   - Configure validations for each field
   - Save

4. **Add Content**
   - Go to Content
   - Create entries for each taxonomy item
   - Publish entries

### Validation Setup

For each model, configure:
- **Required fields:** name, slug, internalName
- **Unique fields:** slug, internalId
- **Format validation:** email, URL, pattern matching
- **Size constraints:** max character limits

---

## Benefits of Phase 1 Structure

✅ **Eliminates Duplication** - One company entry, referenced many times
✅ **Enables Relationships** - Proper linking between content types
✅ **Scalable** - Easy to add new categories, sectors, team members
✅ **Filterable** - Backend can filter by category/sector
✅ **Maintainable** - Update once, reflects everywhere
✅ **Foundation** - Ready for Phase 2 models

---

## Next: Phase 2

After Phase 1 is complete and tested, proceed to redesigned Case Study model which will use these taxonomy models.

