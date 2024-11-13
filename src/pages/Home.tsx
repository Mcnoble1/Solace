import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      id: 'aiSupport',
      icon: '🤖',
      color: 'purple',
      href: '/symptom-checker',
    },
    {
      id: 'periodTracking',
      icon: '📅',
      color: 'pink',
      href: '/period-tracker',
    },
    {
      id: 'pregnancy',
      icon: '🤰',
      color: 'blue',
      href: '/period-tracker',
    },
    {
      id: 'mentalHealth',
      icon: '🧠',
      color: 'green',
      href: '/mental-health',
    },
    {
      id: 'facilities',
      icon: '🏥',
      color: 'indigo',
      href: '/healthcare-facilities',
    },
    {
      id: 'privacy',
      icon: '🔒',
      color: 'gray',
      href: '/resources',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {t('home.title')}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {t('home.subtitle')}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/onboarding"
            className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            {t('common.getStarted')}
          </Link>
          <Link
            to="/resources"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            {t('common.learnMore')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link
            key={feature.id}
            to={feature.href}
            className="relative rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`text-${feature.color}-600 mb-4 text-3xl`}>{feature.icon}</div>
            <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
              {t(`home.features.${feature.id}.title`)}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {t(`home.features.${feature.id}.description`)}
            </p>
            <ul className="mt-4 space-y-2">
              {t(`home.features.${feature.id}.items`, { returnObjects: true }).map((item: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      {/* Why Choose Solace */}
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {t('home.whyChooseUs.title')}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t('home.whyChooseUs.items', { returnObjects: true }).map((item: any, index: number) => (
            <div key={index}>
              <div className="text-3xl mb-4">
                {['🎯', '💜', '🌟', '🤝'][index]}
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center bg-purple-50 rounded-2xl p-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {t('home.cta.title')}
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {t('home.cta.subtitle')}
        </p>
        <div className="mt-10">
          <Link
            to="/onboarding"
            className="rounded-md bg-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </div>
    </div>
  );
}