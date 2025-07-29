# 计算器页面多语言扩展指南

## 概述

本指南介绍如何为计算器页面实现多语言支持，以及如何添加新的计算器页面。基于科学计算器的实现模式，所有新的计算器页面都应遵循相同的结构。

## 目录结构

```
i18n/pages/calculators/
├── scientific/
│   ├── en.json
│   └── zh.json
├── matrix/
│   ├── en.json
│   └── zh.json
└── [新计算器名称]/
    ├── en.json
    └── zh.json
```

## 翻译文件结构

每个计算器的翻译文件都应包含以下标准结构：

```json
{
  "seo": {
    "title": "页面标题",
    "description": "页面描述",
    "keywords": "关键词"
  },
  "breadcrumb": {
    "home": "首页",
    "calculators": "计算器",
    "current": "当前计算器名称"
  },
  "header": {
    "title": "计算器标题",
    "description": "计算器描述"
  },
  "calculator": {
    "title": "计算器标题",
    "description": "计算器使用说明"
  },
  "sidebar": {
    "quickActions": {
      "title": "快速操作",
      "action1": "操作1",
      "action2": "操作2"
    },
    "relatedCalculators": {
      "title": "相关计算器",
      "items": [
        {
          "title": "相关计算器1",
          "url": "/calculator1",
          "icon": "RiIcon"
        }
      ]
    },
    "features": {
      "title": "计算器特性",
      "items": [
        "特性1",
        "特性2"
      ]
    }
  },
  "howToUse": {
    "title": "如何使用",
    "basicOperations": {
      "title": "基本操作",
      "items": ["操作1", "操作2"]
    },
    "advancedFunctions": {
      "title": "高级功能",
      "items": [
        {
          "functions": "函数名",
          "description": "函数描述"
        }
      ]
    }
  },
  "mathematicalPrinciples": {
    "title": "数学原理",
    "section1": {
      "title": "原理1",
      "description": "描述"
    }
  }
}
```

## 使用翻译系统

### 1. 导入翻译Hook

```typescript
import { useCalculatorTranslations } from "@/hooks/useCalculatorTranslations";
```

### 2. 在服务端组件中获取翻译

```typescript
async function getTranslations(locale: string) {
  try {
    const translations = await import(`@/i18n/pages/calculators/[计算器名称]/${locale}.json`);
    return translations.default;
  } catch {
    const fallback = await import(`@/i18n/pages/calculators/[计算器名称]/en.json`);
    return fallback.default;
  }
}
```

### 3. 在组件中使用翻译

```typescript
export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return (
    <div>
      <h1>{t.header.title}</h1>
      <p>{t.header.description}</p>
    </div>
  );
}
```

## 添加新计算器页面的步骤

### 1. 创建页面组件

在 `app/[locale]/(calculators)/[calculator-name]/page.tsx` 创建页面：

```typescript
import { Metadata } from "next";
import CalculatorComponent from "@/components/calculators/[calculator-name]";
// ... 其他导入

async function getTranslations(locale: string) {
  try {
    const translations = await import(`@/i18n/pages/calculators/[calculator-name]/${locale}.json`);
    return translations.default;
  } catch {
    const fallback = await import(`@/i18n/pages/calculators/[calculator-name]/en.json`);
    return fallback.default;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);
  
  return {
    title: t.seo.title,
    description: t.seo.description,
    keywords: t.seo.keywords,
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return (
    // 页面结构类似科学计算器
  );
}
```

### 2. 创建翻译文件

在 `i18n/pages/calculators/[calculator-name]/` 目录下创建：
- `en.json` - 英文翻译
- `zh.json` - 中文翻译

### 3. 创建计算器组件

在 `components/calculators/[calculator-name]/index.tsx` 创建具体的计算器功能组件。

### 4. 更新相关计算器链接

在其他计算器的翻译文件中添加新计算器的链接引用。

## 最佳实践

### 1. 一致性
- 所有计算器页面应使用相同的结构和布局
- 翻译文件的键名应保持一致
- UI 组件的命名和功能应标准化

### 2. 可维护性
- 将通用的翻译内容提取到共享文件中
- 使用类型安全的翻译函数
- 为所有翻译提供回退机制

### 3. SEO 优化
- 每个计算器页面都应有独特的 title 和 description
- 使用适当的关键词
- 确保多语言版本的 canonical URL 正确

### 4. 用户体验
- 保持侧边栏的相关计算器推荐更新
- 确保所有交互元素都有适当的翻译
- 提供清晰的使用说明和数学原理解释

## 示例：添加矩阵计算器

1. 创建目录和文件：
```bash
mkdir -p i18n/pages/calculators/matrix
mkdir -p app/[locale]/(calculators)/matrix
mkdir -p components/calculators/matrix-calculator
```

2. 创建翻译文件 `i18n/pages/calculators/matrix/en.json` 和 `zh.json`

3. 创建页面组件 `app/[locale]/(calculators)/matrix/page.tsx`

4. 实现计算器功能 `components/calculators/matrix-calculator/index.tsx`

5. 在相关计算器的翻译文件中添加矩阵计算器链接

## 注意事项

- 翻译文件中的 JSON 结构必须在所有语言版本中保持一致
- 新增计算器时，记得更新主页的功能列表翻译
- 确保所有新添加的图标在 Icon 组件中可用
- 测试多语言切换功能和 URL 路由 