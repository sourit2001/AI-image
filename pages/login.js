import Head from 'next/head';

export default function Login() {
  return (
    <>
      <Head>
        <title>登录/注册 - AI 图像编辑器</title>
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 bg-gray-50 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">登录 / 注册</h1>
          <button className="w-full mb-4 bg-red-500 text-white py-2 rounded hover:bg-red-600">使用 Google 登录</button>
          <input type="email" placeholder="邮箱地址" className="w-full mb-4 px-3 py-2 border rounded" />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">邮箱登录/注册</button>
        </div>
      </main>
    </>
  );
}
