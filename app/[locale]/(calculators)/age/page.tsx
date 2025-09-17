import { Metadata } from "next";
import AgeCalculator from "@/components/calculators/age-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/icon";

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

function QuickActions({ t }: { t: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.sidebar.quickActions.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start" asChild>
          <a href="/scientific">
            <Icon name="RiFunctionLine" className="mr-2 size-4" />
            {t.sidebar.quickActions.scientific}
          </a>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <a href="/bmi">
            <Icon name="RiHeartLine" className="mr-2 size-4" />
            {t.sidebar.quickActions.bmi}
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

function UsageGuide({ t }: { t: any }) {
  const steps = t.usage.steps;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="RiQuestionLine" className="size-6 text-primary" />
          {t.usage.title}
        </CardTitle>
        <CardDescription>{t.usage.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step: any, index: number) => (
            <div key={index} className="flex gap-4">
              <Badge variant="outline" className="size-8 rounded-full flex items-center justify-center flex-shrink-0">
                {index + 1}
              </Badge>
              <div>
                <h4 className="font-semibold mb-1">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AboutAgeCalculation({ t }: { t: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="RiInformationLine" className="size-6 text-primary" />
          {t.about.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none dark:prose-invert">
        <p>{t.about.description}</p>
        <h4>{t.about.accuracy.title}</h4>
        <p>{t.about.accuracy.description}</p>
        <h4>{t.about.applications.title}</h4>
        <ul>
          {t.about.applications.list.map((item: string, index: number) => (
            <li key={index}>{item}</li>
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