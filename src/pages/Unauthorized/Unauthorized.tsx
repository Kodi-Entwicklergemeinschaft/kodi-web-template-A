import { useTypedTranslation } from '@/hooks';

const Unauthorized = () => {
  const { t } = useTypedTranslation();
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0d0d0d] px-4">
      <div className="w-full max-w-lg p-10 rounded-2xl bg-white dark:bg-white/10 shadow-lg border border-gray-200 dark:border-white/10 text-center">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
          {t('unAuthorized.heading')}
        </h1>

        {/* Thin divider line */}
        <div className="w-16 h-1 mx-auto bg-blue-600 dark:bg-blue-400 rounded-full mb-6"></div>

        {/* Description */}
        <p
          className="text-gray-600 dark:text-gray-300 leading-relaxed text-base"
          dangerouslySetInnerHTML={{ __html: t('unAuthorized.description') }}
        ></p>

        {/* Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition font-medium"
        >
          {t('unAuthorized.goBack')}
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
