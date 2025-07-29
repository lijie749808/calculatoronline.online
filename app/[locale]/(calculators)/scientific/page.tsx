import { Metadata } from "next";
import ScientificCalculator from "@/components/calculators/scientific-calculator";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/icon";
import { useCalculatorTranslations } from "@/hooks/useCalculatorTranslations";

async function getTranslations(locale: string) {
  try {
    const translations = await import(`@/i18n/pages/calculators/scientific/${locale}.json`);
    return translations.default;
  } catch {
    const fallback = await import(`@/i18n/pages/calculators/scientific/en.json`);
    return fallback.default;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);
  
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/scientific`;
  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/scientific`;
  }

  return {
    title: t.seo.title,
    description: t.seo.description,
    keywords: t.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// Client component for navigation links
function NavigationBreadcrumb({ t }: { t: any }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <a href="/" className="hover:text-primary">{t.breadcrumb.home}</a>
      <span>/</span>
      <a href="/#feature" className="hover:text-primary">{t.breadcrumb.calculators}</a>
      <span>/</span>
      <span>{t.breadcrumb.current}</span>
    </div>
  );
}

// Client component for quick actions
function QuickActions({ t }: { t: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.sidebar.quickActions.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start" asChild>
          <a href="/graphing">
            <Icon name="RiLineChartLine" className="mr-2 size-4" />
            {t.sidebar.quickActions.graphing}
          </a>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <a href="/matrix">
            <Icon name="RiGridLine" className="mr-2 size-4" />
            {t.sidebar.quickActions.matrix}
          </a>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <a href="/#feature">
            <Icon name="RiCalculatorLine" className="mr-2 size-4" />
            {t.sidebar.quickActions.allCalculators}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// Client component for related calculators
function RelatedCalculators({ t }: { t: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.sidebar.relatedCalculators.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {t.sidebar.relatedCalculators.items.map((calc: any, index: number) => (
            <a
              key={index}
              href={calc.url}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
                <Icon name={calc.icon} className="size-4 text-primary" />
              </div>
              <span className="text-sm font-medium group-hover:text-primary">
                {calc.title}
              </span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Client component for features
function CalculatorFeatures({ t }: { t: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.sidebar.features.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {t.sidebar.features.items.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-2">
              <Icon name="RiCheckLine" className="size-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default async function ScientificCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return (
    <div>
      {/* Header */}
      <div className="border-b bg-muted/5">
        <div className="container py-8">
          <NavigationBreadcrumb t={t} />
          <h1 className="text-4xl font-bold mb-4">{t.header.title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t.header.description}
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="RiFunctionLine" className="size-6 text-primary" />
                  {t.calculator.title}
                </CardTitle>
                <CardDescription>
                  {t.calculator.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScientificCalculator />
              </CardContent>
            </Card>

            {/* How to Use */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t.howToUse.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t.howToUse.basicOperations.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {t.howToUse.basicOperations.items.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">{t.howToUse.advancedFunctions.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {t.howToUse.advancedFunctions.items.map((item: any, index: number) => (
                      <li key={index}>
                        <strong>{item.functions}:</strong> {item.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">{t.howToUse.keyboardShortcuts.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>{t.howToUse.keyboardShortcuts.left.numbers.split(':')[0]}:</strong> {t.howToUse.keyboardShortcuts.left.numbers.split(':')[1]}</p>
                      <p><strong>{t.howToUse.keyboardShortcuts.left.operations.split(':')[0]}:</strong> {t.howToUse.keyboardShortcuts.left.operations.split(':')[1]}</p>
                      <p><strong>{t.howToUse.keyboardShortcuts.left.decimal.split(':')[0]}:</strong> {t.howToUse.keyboardShortcuts.left.decimal.split(':')[1]}</p>
                      <p><strong>{t.howToUse.keyboardShortcuts.left.calculate.split(':')[0]}:</strong> {t.howToUse.keyboardShortcuts.left.calculate.split(':')[1]}</p>
                    </div>
                    <div>
                      <p><strong>{t.howToUse.keyboardShortcuts.right.clear.split(':')[0]}:</strong> {t.howToUse.keyboardShortcuts.right.clear.split(':')[1]}</p>
                      <p><strong>{t.howToUse.keyboardShortcuts.right.clearAll.split(':')[0]}:</strong> {t.howToUse.keyboardShortcuts.right.clearAll.split(':')[1]}</p>
                      <p><strong>{t.howToUse.keyboardShortcuts.right.parentheses.split(':')[0]}:</strong> {t.howToUse.keyboardShortcuts.right.parentheses.split(':')[1]}</p>
                      <p><strong>{t.howToUse.keyboardShortcuts.right.pi.split(':')[0]}:</strong> {t.howToUse.keyboardShortcuts.right.pi.split(':')[1]}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mathematical Principles */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t.mathematicalPrinciples.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t.mathematicalPrinciples.trigonometric.title}</h3>
                  <p className="text-muted-foreground">
                    {t.mathematicalPrinciples.trigonometric.description}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">{t.mathematicalPrinciples.logarithmic.title}</h3>
                  <p className="text-muted-foreground">
                    {t.mathematicalPrinciples.logarithmic.description}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">{t.mathematicalPrinciples.orderOfOperations.title}</h3>
                  <p className="text-muted-foreground">
                    {t.mathematicalPrinciples.orderOfOperations.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions t={t} />
            <RelatedCalculators t={t} />
            <CalculatorFeatures t={t} />
          </div>
        </div>
      </div>
    </div>
  );
} 