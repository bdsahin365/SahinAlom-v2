import re

with open('src/components/Admin.tsx', 'r') as f:
    content = f.read()

replacements = [
    ('<span>নতুন আর্টিকেল লিখুন</span>', '<span>Write New Article</span>'),
    ('মোট আর্টিকেল সংখ্যা', 'TOTAL ARTICLES'),
    ('লাইভ সাইটে দৃশ্যমান', 'PUBLISHED LIVE'),
    ('খসড়া (Drafts)', 'DRAFTS'),
    ('মোট ক্যাটাগরি', 'TOTAL CATEGORIES'),
    ('placeholder="আর্টিকেলের শিরোনাম, ট্যাগ বা বিষয়বস্তু খুঁজুন..."', 'placeholder="Search articles by title, tags, or keyword..."'),
    ("['সবগুলো', 'প্রকাশিত', 'খসড়া']", "['All', 'Published', 'Draft']"),
    ('ক্যাটাগরি ফিল্টার:', 'Category Filter:'),
    ("['সবগুলো', 'বাউন্ডারি পিলার ও সিভিল', 'বিএনবিসি কোড ও সেফটি', 'ফাউন্ডেশন ও সয়েল টেস্ট গাইড', 'ইলেকট্রিক্যাল সাবস্টেশন ও আর্থিং', 'কনস্ট্রাকশন মেটেরিয়ালস', 'সাধারণ ইঞ্জিনিয়ারিং টিপস']", "['All', 'Boundary Pillar & Civil', 'BNBC Code & Safety', 'Foundation & Soil Test', 'Electrical Substation', 'Construction Materials', 'Engineering Tips']"),
    ("0 words", "0 words"),
    ('<option value="__NEW_CATEGORY__">+ Add Category করুন...</option>', '<option value="__NEW_CATEGORY__">+ Add New Category...</option>'),
    ("{editingProduct ? 'Edit Catalog Product' : 'নতুন ক্যাটালগ পণ্য Add করুন'}", "{editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}"),
    ("{editingCustomer ? 'Edit Industrial Client Profile' : 'নতুন ইন্ডাস্ট্রিয়াল ক্লায়েন্ট Add করুন'}", "{editingCustomer ? 'Edit Industrial Client Profile' : 'Add New Industrial Client'}"),
]

for old, new in replacements:
    content = content.replace(old, new)

# Fix editingBlogSlug template literal string
content = re.sub(
    r'\{editingBlogSlug \? `সম্পাদনা মোড: \$\{editingBlogSlug\}` : \'নতুন আর্টিকেল ড্রাফটিং ওয়ার্কস্পেস'\}',
    "{editingBlogSlug ? `Edit Mode: ${editingBlogSlug}` : 'New Article Draft Workspace'}",
    content
)

# Fix quick action toast for category
content = re.sub(
    r'নতুন ক্যাটাগরি "\$\{newCategoryInput\.trim\(\)\}" তৈরি হয়েছে।',
    'New category "${newCategoryInput.trim()}" created successfully.',
    content
)

# Fix WhatsApp messages
content = re.sub(
    r'setCustomWaText\(`আসসালামু আলাইকুম স্যার, ইঞ্জিনিয়ার্স এন্টারপ্রাইজ থেকে \$\{customer\.name\}-এর সাবস্টেশন মেইনটেন্যান্স ও সেফটি ইন্সপেকশন সাপোর্ট সংক্রান্ত বার্তা।`\);',
    'setCustomWaText(`Dear Sir, Greetings from Engineers Enterprise regarding substation maintenance and safety inspection support for ${customer.name}.`);',
    content
)

content = re.sub(
    r'text: `আসসালামু আলাইকুম স্যার, ইঞ্জিনিয়ার্স এন্টারপ্রাইজ থেকে \$\{whatsAppModalCustomer\.name\}-এর ১১কেভি সাবস্টেশন থার্মাল অডিট ও সেফটি ইন্সপেকশন রিপোর্ট সম্পূর্ণ প্রস্তুত। রিপোর্টটি রিভিউ করতে পারেন। ধন্যবাদ।`',
    'text: `Dear Sir, Greetings from Engineers Enterprise. The 11kV substation thermal audit and safety inspection report for ${whatsAppModalCustomer.name} is ready for review. Thank you.`',
    content
)

content = re.sub(
    r'text: `আসসালামু আলাইকুম স্যার, \$\{whatsAppModalCustomer\.name\}-এর ট্রান্সফরমার ও PFI প্ল্যান্টের নির্ধারিত মেইনটেন্যান্স ডেট ঘনিয়ে এসেছে। কোনো টেকনিক্যাল সার্ভিসের প্রয়োজনে আমাদের জানান। - ইঞ্জিনিয়ার্স এন্টারপ্রাইজ`',
    'text: `Dear Sir, Scheduled maintenance for the transformer and PFI plant at ${whatsAppModalCustomer.name} is due soon. Please let us know if you require technical service. - Engineers Enterprise`',
    content
)

content = re.sub(
    r'text: `আসসালামু আলাইকুম স্যার, ইঞ্জিনিয়ার্স এন্টারপ্রাইজ থেকে আপনার প্ল্যান্টের নতুন সার্ভিস ইনভয়েস পাঠানো হয়েছে। বিলিং সংক্রান্ত তথ্য জানতে মেসেজ দিন।`',
    'text: `Dear Sir, A new service invoice has been issued for your plant site by Engineers Enterprise. Please reply if you require any billing details or payment clarification.`',
    content
)

content = re.sub(
    r'text: `আসসালামু আলাইকুম স্যার, আশা করি ভালো আছেন। আপনার কারখানার সাবস্টেশন ও ইলেকট্রিক্যাল ডিস্ট্রিবিউশনে কোনো ইমার্জেন্সি সাপোর্ট প্রয়োজন হলে জানাবেন। - ইঞ্জিনিয়ার্স এন্টারপ্রাইজ`',
    'text: `Dear Sir, Greetings from Engineers Enterprise. Please let us know if you require any emergency technical support or equipment servicing for your factory substation.`',
    content
)

with open('src/components/Admin.tsx', 'w') as f:
    f.write(content)

print('Cleaned script completed.')
