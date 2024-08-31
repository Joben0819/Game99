import { DATA_LANG } from '@/constants/enums';
import * as chineseTranslations from '@/translation/cn';
import * as englishTranslations from '@/translation/en';
import * as indonesianTranslations from '@/translation/in';
// import * as hindiTranslations from '@/translation/hi';
import { useAppSelector } from '@/store';

export const useTranslations = () => {
  const language = useAppSelector((state) => state.appData.language);

  switch (language) {
    case DATA_LANG.CNS:
      return chineseTranslations;
    case DATA_LANG.EN:
      return englishTranslations;
    // case DATA_LANG.HI:
    //   return hindiTranslations;
    default:
      return indonesianTranslations;
  }
};

// 9908 - no chinese translations
