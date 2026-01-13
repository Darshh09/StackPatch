export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Your StackPatch Project</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Your project has been set up with StackPatch. Get started by adding features to your app.
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add production-ready features to your app using the StackPatch CLI.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
            <code>npx stackpatch add auth-ui</code>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Available Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Authentication (auth-ui) - Login, signup, and protected routes</li>
            <li>More features coming soon...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
