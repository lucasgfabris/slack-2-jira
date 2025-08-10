import { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Slack to Jira Integration</title>
        <meta name="description" content="Backend para integração Slack-Jira" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Slack to Jira Integration
          </h1>
          <p className="text-gray-600 mb-4">
            Backend funcionando corretamente. Use o comando <code>/criar-ticket</code> no Slack para criar tickets no Jira.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800 text-sm">
              ✅ Serviço online e pronto para uso
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
