import Head from 'next/head';
import Link from 'next/link';
import { useLanguage, LanguageSwitcher } from '../lib/LanguageContext';

const features = [
  {
    titleKey: 'features.removeText.title',
    descriptionKey: 'features.removeText.description',
    icon: '📝',
    href: '/remove-text',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    titleKey: 'features.upscale.title',
    descriptionKey: 'features.upscale.description',
    icon: '🔍',
    href: '/upscale',
    color: 'from-green-500 to-emerald-500'
  },
  {
    titleKey: 'features.removeBackground.title',
    descriptionKey: 'features.removeBackground.description',
    icon: '✂️',
    href: '/background-removal',
    color: 'from-purple-500 to-pink-500'
  },
  {
    titleKey: 'features.haircutChange.title',
    descriptionKey: 'features.haircutChange.description',
    icon: '💇',
    href: '/haircut-change',
    color: 'from-orange-500 to-red-500'
  },
  {
    titleKey: 'features.professionalHeadshot.title',
    descriptionKey: 'features.professionalHeadshot.description',
    icon: '💼',
    href: '/professional-headshot',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    titleKey: 'features.emojiMaker.title',
    descriptionKey: 'features.emojiMaker.description',
    icon: '😀',
    href: '/emoji-maker',
    color: 'from-yellow-500 to-orange-500'
  }
];

const pricingPlans = [
  {
    nameKey: 'pricing.plans.free.name',
    price: '$0',
    period: '/month',
    descriptionKey: 'pricing.plans.free.description',
    featuresKey: 'pricing.plans.free.features',
    buttonTextKey: 'pricing.plans.free.buttonText',
    popular: false
  },
  {
    nameKey: 'pricing.plans.professional.name',
    price: '$4.99',
    period: '/month',
    descriptionKey: 'pricing.plans.professional.description',
    featuresKey: 'pricing.plans.professional.features',
    buttonTextKey: 'pricing.plans.professional.buttonText',
    popular: true
  },
  {
    nameKey: 'pricing.plans.enterprise.name',
    price: '$14.99',
    period: '/month',
    descriptionKey: 'pricing.plans.enterprise.description',
    featuresKey: 'pricing.plans.enterprise.features',
    buttonTextKey: 'pricing.plans.enterprise.buttonText',
    popular: false
  }
];

export default function Home() {
  const { translate, isLoading } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{translate('title')} - AI-Powered Image Editing Tool</title>
        <meta name="description" content={translate('subtitle')} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        {/* Header */}
        <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              {translate('title')}
            </h1>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                {translate('login')}
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all duration-200 transform hover:scale-105">
                {translate('register')}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              {translate('title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {translate('subtitle')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature) => (
              <Link href={feature.href} key={feature.titleKey}>
                <div className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{translate(feature.titleKey)}</h3>
                  <p className="text-gray-600 leading-relaxed">{translate(feature.descriptionKey)}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">{translate('pricing.title')}</h2>
              <p className="text-xl text-gray-600">{translate('pricing.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div key={index} className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-purple-500 transform scale-105' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {translate('pricing.mostPopular')}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">{translate(plan.nameKey)}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{translate(plan.descriptionKey)}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {translate(plan.featuresKey).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}>
                    {translate(plan.buttonTextKey)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full mt-16 py-8 border-t border-gray-200">
           <div className="text-center text-gray-500">
               <p>© 2024 AI Photo Studio. All rights reserved.</p>
           </div>
        </footer>
      </div>
    </>
  );
}
