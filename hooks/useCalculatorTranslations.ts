import { useLocale } from "next-intl";

interface CalculatorTranslations {
  [key: string]: any;
}

export function useCalculatorTranslations(calculatorName: string): CalculatorTranslations {
  const locale = useLocale();
  
  // 动态导入翻译文件
  try {
    const translations = require(`@/i18n/pages/calculators/${calculatorName}/${locale}.json`);
    return translations;
  } catch (error) {
    console.warn(`Calculator translations not found for ${calculatorName} in ${locale}, falling back to en`);
    try {
      const fallbackTranslations = require(`@/i18n/pages/calculators/${calculatorName}/en.json`);
      return fallbackTranslations;
    } catch (fallbackError) {
      console.error(`Fallback translations not found for ${calculatorName}`);
      return {};
    }
  }
}

// 类型安全的获取翻译函数
export function getTranslation(translations: CalculatorTranslations, path: string, fallback?: string): string {
  const keys = path.split('.');
  let result = translations;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return fallback || path;
    }
  }
  
  return typeof result === 'string' ? result : fallback || path;
}

// 便捷的翻译hook，返回翻译函数
export function useCalculatorT(calculatorName: string) {
  const translations = useCalculatorTranslations(calculatorName);
  
  return (path: string, fallback?: string) => getTranslation(translations, path, fallback);
} 