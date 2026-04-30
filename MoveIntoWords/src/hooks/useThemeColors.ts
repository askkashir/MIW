import { ColorSchemes, ThemeColors } from '../constants/Theme';
import { useUserStore } from '../store/useUserStore';

export const useThemeColors = (): ThemeColors => {
  const theme = useUserStore((state) => state.theme);
  return ColorSchemes[theme];
};

