"use client";
export default function ExplorerError({ reset }: { reset: () => void }) {
  return (
    <main className="real-shell">
      <h1>This request could not be completed</h1>
      <p>The address may contain conflicting selections, or the data service may be unavailable.</p>
      <button onClick={reset}>Try again</button> · <a href="/?view=setup">Choose a place</a>
    </main>
  );
}
