export default function CustomExercisesPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-0">
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white px-2 sm:px-0">My Custom Exercises</h1>
      <div className="text-zinc-400 p-4 sm:p-6 bg-zinc-900/50 rounded-lg border border-zinc-800 mx-2 sm:mx-0 text-sm sm:text-base">
        This page will show only the custom exercises created by the logged-in user.
      </div>
    </div>
  );
}
