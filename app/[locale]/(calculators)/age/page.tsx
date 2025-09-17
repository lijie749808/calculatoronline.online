import { Metadata } from "next";
import AgeCalculator from "@/components/calculators/age-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/icon";
import { Link } from "@/i18n/routing";

async function getTranslations(locale: string) {
  try {
    const translations = await import(`@/i18n/pages/calculators/age/${locale}.json`);
    return translations.default;
  } catch {
    const fallback = await import(`@/i18n/pages/calculators/age/en.json`);
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
  
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/age`;
  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/age`;
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

function NavigationBreadcrumb({ t }: { t: Record<string, any> }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Link href="/" className="hover:text-primary">{t.breadcrumb.home}</Link>
      <span>/</span>
      <Link href="/#feature" className="hover:text-primary">{t.breadcrumb.calculators}</Link>
      <span>/</span>
      <span>{t.breadcrumb.current}</span>
    </div>
  );
}

function QuickActions({ t }: { t: Record<string, any> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.sidebar.quickActions.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/scientific">
            <Icon name="RiFunctionLine" className="mr-2 size-4" />
            {t.sidebar.quickActions.scientific}
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/bmi">
            <Icon name="RiHeartLine" className="mr-2 size-4" />
            {t.sidebar.quickActions.bmi}
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/#feature">
            <Icon name="RiCalculatorLine" className="mr-2 size-4" />
            {t.sidebar.quickActions.allCalculators}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function RelatedCalculators({ t }: { t: Record<string, any> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.sidebar.relatedCalculators.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {t.sidebar.relatedCalculators.items.map((calc: Record<string, string>, index: number) => (
            <Link
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
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CalculatorFeatures({ t }: { t: Record<string, any> }) {
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



export default async function AgeCalculatorPage({
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
                  <Icon name="RiCalendar2Line" className="size-6 text-primary" />
                  {t.calculator.title}
                </CardTitle>
                <CardDescription>
                  {t.calculator.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AgeCalculator t={t.calculator} locale={locale} />
              </CardContent>
            </Card>

            {/* How to Use */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t.howToUse.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t.howToUse.steps.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {t.howToUse.steps.items.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">{t.howToUse.features.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {t.howToUse.features.items.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">{t.howToUse.tips.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {t.howToUse.tips.items.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* About Age Calculation */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t.about.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t.about.accuracy.title}</h3>
                  <p className="text-muted-foreground">
                    {t.about.accuracy.description}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">{t.about.applications.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {t.about.applications.items.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">{t.about.calculations.title}</h3>
                  <p className="text-muted-foreground">
                    {t.about.calculations.description}
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