export default function CitizenReporting() {
  return (
    <section id="portal" className="py-24">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-foreground mb-6">What Would You Like to Report?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Help maintain political finance transparency by reporting suspicious activities or violations. Your voice matters in ensuring
          accountability.
        </p>
      </div>

      {/* Report Options - Creative Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200 to-pink-200 dark:from-red-800 dark:to-pink-800 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative">
            <div className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full mb-4">
              HIGH PRIORITY
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Suspicious Donations</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Unusual contribution patterns, questionable donor sources, or potentially illegal campaign financing activities that warrant
              investigation.
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-800 dark:to-amber-800 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative">
            <div className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full mb-4">
              FINANCIAL IRREGULARITIES
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Hidden Assets</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Undeclared income streams, concealed financial holdings, or missing disclosure statements that violate transparency
              requirements.
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-amber-200 dark:from-yellow-800 dark:to-amber-800 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative">
            <div className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-full mb-4">
              LEGAL VIOLATIONS
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Compliance Issues</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Campaign finance law violations, regulatory breaches, or ethical guideline infractions that compromise electoral integrity.
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-indigo-200 dark:from-purple-800 dark:to-indigo-800 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative">
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full mb-4">
              OTHER CONCERNS
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Transparency Issues</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Any other political finance irregularities, transparency gaps, or accountability concerns that threaten democratic processes.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Make a Report?</h3>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Your report helps ensure political accountability and transparency. All submissions are reviewed by our expert team.
          </p>
          <button
            onClick={() => (window.location.href = '/report')}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Submit Your Report
          </button>
        </div>
      </div>
    </section>
  );
}
