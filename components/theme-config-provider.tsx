'use client';

import { ConfigProvider, theme as antdThemeTokens } from 'antd';
import type { Locale } from 'antd/es/locale';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { antdTheme } from '@/theme';

export function ThemeConfigProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale?: Locale;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        ...antdTheme,
        algorithm: isDark ? antdThemeTokens.darkAlgorithm : antdThemeTokens.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}