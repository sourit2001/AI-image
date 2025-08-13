import Head from 'next/head';
import Link from 'next/link';

const features = [
  {
    name: '消除背景',
    description: '一键移除图片背景，支持人像、商品等。',
    href: '/background-removal',
    icon: '✂️',
  },
  {
    name: '高清放大',
    description: '无损放大图片2-4倍，提升分辨率和细节。',
    href: '/upscale',
    icon: '🔍',
  },
  {
    name: '变换发型和发色',
    description: '尝试不同发型与发色，发现新的自己。',
    href: '/haircut-change',
    icon: '💇‍♀️',
  },
  {
    name: '职业头像',
    description: '生成专业、高质量的商务风格头像。',
    href: '/professional-headshot',
    icon: '👔',
  },
  {
    name: '消除文字',
    description: '智能擦除图片中的所有文字内容。',
    href: '/remove-text',
    icon: '📝',
  },
  {
    name: '生成Emoji',
    description: '用你的图片和想法创造有趣的Emoji表情。',
    href: '/emoji-maker',
    icon: '😀',
  },
];

const pricingPlans = [
  {
    name: '免费版',
    price: '$0',
    period: '/month',
    description: '适合个人用户体验',
    features: [
      '每月 5 次免费处理',
      '基础功能支持',
      '标准处理速度',
      '社区支持'
    ],
    buttonText: '免费使用',
    popular: false
  },
  {
    name: '专业版',
    price: '$4.99',
    period: '/month',
    description: '适合个人和小团队',
    features: [
      '每月 100 次处理',
      '所有功能全面支持',
      '高速处理优先级',
      '优先客服支持',
      '高清输出质量'
    ],
    buttonText: '开始使用',
    popular: true
  },
  {
    name: '企业版',
    price: '$14.99',
    period: '/month',
    description: '适合大型团队和企业',
    features: [
      '无限次处理',
      'API 接口支持',
      '批量处理功能',
      '专属客服经理',
      '定制化解决方案'
    ],
    buttonText: '联系销售',
    popular: false
  }
];

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Photo Studio - 一站式智能图片处理</title>
        <meta name="description" content="AI Photo Studio 提供背景移除、高清放大、发型变换、职业头像生成等多种强大的AI图片编辑功能。" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        {/* Header */}
        <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              AI Photo Studio
            </h1>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                登录
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all duration-200 transform hover:scale-105">
                注册
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">一站式智能图片处理平台</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">无论是专业设计还是日常娱乐，我们提供强大、易用的AI工具，助你轻松实现创意。</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature) => (
              <Link href={feature.href} key={feature.name}>
                <div className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.name}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">选择适合你的计划</h2>
              <p className="text-xl text-gray-600">从免费体验开始，随时升级到专业版本</p>
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
                        最受欢迎
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
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
                    {plan.buttonText}
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
