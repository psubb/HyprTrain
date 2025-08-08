export default function CustomExercisesPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <h1 className="text-xl sm:text-2xl font-semibold">My Custom Exercises</h1>
      <div className="text-zinc-400 p-4 sm:p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
        This page will show only the custom exercises created by the logged-in user.
      </div>
    </div>
  );
}
