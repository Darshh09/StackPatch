export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-blue-600">{{PROJECT_NAME}}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Get started by editing <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">app/page.tsx</code>
        </p>
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Add features with: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">npx stackpatch add auth-ui</code>
          </p>
        </div>
      </div>
    </div>
  );
}
