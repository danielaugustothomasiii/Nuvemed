export const colors = {
  primary: '#16855a',
  primaryDark: '#0f573e',
  primaryHover: '#146b4a',
  text: '#17392d',
  muted: '#61756d',
  border: '#dce9e1',
  grid: '#e6eee9',
  surfaceHover: '#f0f7f3',
  layout: '#f4f7f5',
};

export const antdTheme = {
  token: {
    colorPrimary: colors.primary,
    colorInfo: colors.primary,
    borderRadius: 8,
    colorBgLayout: colors.layout,
    colorText: colors.text,
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    Layout: { siderBg: colors.primaryDark },
    Menu: { darkItemBg: colors.primaryDark, darkItemSelectedBg: colors.primary, darkItemHoverBg: colors.primaryHover },
    Table: { headerBg: '#f7faf8', headerColor: '#365449' },
  },
};
