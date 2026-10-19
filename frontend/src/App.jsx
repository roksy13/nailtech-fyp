import { useState } from 'react'

function App() {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function checkBackend() {
        setLoading(true)
        setMessage('')

        try {
            const response = await fetch('/api/health')

            if (!response.ok) {
                throw new Error('Request failed')
            }

            setMessage(await response.text())
        } catch {
            setMessage('Could not connect. Check that your backend is running.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-rose-50 p-10">
            <h1 className="text-5xl font-bold text-rose-700">
                NailTech
            </h1>

            <p className="mt-4 text-lg text-gray-700">
                Discover your next nail design.
            </p>

            <button
                onClick={checkBackend}
                disabled={loading}
                className="mt-6 rounded-lg bg-rose-700 px-5 py-3 text-white disabled:opacity-50"
            >
                {loading ? 'Connecting...' : 'Check backend'}
            </button>

            <p className="mt-4 text-gray-700" role="status">
                {message}
            </p>
        </main>
    )
}

export default App