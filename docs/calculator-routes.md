# Calculator Routes Structure

## Route Organization

This project uses Next.js App Router with route groups to organize calculator pages efficiently.

### Directory Structure

```
app/[locale]/
├── (default)/                 # Main landing pages
│   ├── page.tsx              # Homepage
│   ├── pricing/              # Pricing page
│   └── showcase/             # Showcase page
├── (calculators)/            # Calculator pages group
│   ├── layout.tsx            # Shared layout for all calculators
│   ├── scientific/           # Scientific calculator
│   │   └── page.tsx
│   ├── mortgage/             # Mortgage calculator (planned)
│   │   └── page.tsx
│   ├── bmi/                  # BMI calculator (planned)
│   │   └── page.tsx
│   └── ...                   # Other calculators
└── (admin)/                  # Admin pages
    └── ...
```

## Implemented Calculators

### ✅ Scientific Calculator
- **Route**: `/scientific`
- **File**: `app/[locale]/(calculators)/scientific/page.tsx`
- **Component**: `components/calculators/scientific-calculator/index.tsx`
- **Features**:
  - Basic arithmetic operations
  - Trigonometric functions (sin, cos, tan)
  - Logarithmic functions (ln, log)
  - Power and root functions
  - Mathematical constants (π, e)
  - Memory functions (MC, MR, M+, M-)
  - Keyboard support
  - Calculation history
  - Copy to clipboard

## Planned Calculators

### 📋 Math & Science Category
- [ ] **Graphing Calculator** - `/graphing`
- [ ] **Matrix Calculator** - `/matrix`
- [ ] **Equation Solver** - `/equation-solver`
- [ ] **Statistics Calculator** - `/statistics`

### 💰 Financial Category
- [ ] **Mortgage Calculator** - `/mortgage`
- [ ] **Loan Calculator** - `/loan`
- [ ] **Investment Calculator** - `/investment`
- [ ] **Tax Calculator** - `/tax`
- [ ] **Retirement Calculator** - `/retirement`
- [ ] **Compound Interest Calculator** - `/compound-interest`

### 🏥 Health & Fitness Category
- [ ] **BMI Calculator** - `/bmi`
- [ ] **Calorie Calculator** - `/calorie`
- [ ] **Body Fat Calculator** - `/body-fat`
- [ ] **Pregnancy Calculator** - `/pregnancy`

### 🔄 Unit Conversion Category
- [ ] **Length Converter** - `/length-converter`
- [ ] **Weight Converter** - `/weight-converter`
- [ ] **Temperature Converter** - `/temperature-converter`
- [ ] **Currency Converter** - `/currency-converter`
- [ ] **Area Converter** - `/area-converter`

### 📅 Date & Time Category
- [ ] **Age Calculator** - `/age-calculator`
- [ ] **Date Difference Calculator** - `/date-difference`
- [ ] **Time Zone Converter** - `/timezone-converter`

### 🛠️ Specialized Tools Category
- [ ] **GPA Calculator** - `/gpa-calculator`
- [ ] **Grade Calculator** - `/grade-calculator`
- [ ] **Tip Calculator** - `/tip-calculator`
- [ ] **Password Generator** - `/password-generator`
- [ ] **Random Number Generator** - `/random-number`
- [ ] **Percentage Calculator** - `/percentage`

## Development Guidelines

### Adding a New Calculator

1. **Create the calculator component**:
   ```
   components/calculators/[calculator-name]/index.tsx
   ```

2. **Create the page**:
   ```
   app/[locale]/(calculators)/[calculator-name]/page.tsx
   ```

3. **Follow the page structure**:
   - SEO metadata
   - Breadcrumb navigation
   - Calculator component
   - Usage instructions
   - Mathematical principles
   - Related calculators sidebar

4. **Update landing page links**:
   - Add to `i18n/pages/landing/en.json`
   - Add to `i18n/pages/landing/zh.json`

### Page Template Structure

Each calculator page should include:
- **Header Section**: Title, description, breadcrumbs
- **Main Content**: Calculator component + documentation
- **Sidebar**: Quick actions, related calculators, features list
- **SEO**: Proper metadata and canonical URLs

### Component Guidelines

Calculator components should:
- Be client-side components (`"use client"`)
- Support keyboard input
- Include clear/reset functionality
- Show calculation history when applicable
- Be responsive for mobile devices
- Follow the design system (Shadcn UI)

## URL Structure

All calculator URLs follow the pattern:
- English: `/calculator-name`
- Chinese: `/zh/calculator-name`
- Other locales: `/[locale]/calculator-name`

Examples:
- `/scientific` → Scientific Calculator (English)
- `/zh/scientific` → 科学计算器 (Chinese)
- `/mortgage` → Mortgage Calculator (English)
- `/zh/mortgage` → 房贷计算器 (Chinese) 