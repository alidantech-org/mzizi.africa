export default function ImpactStats() {
  const stats = [
    {
      value: '$2.5B+',
      label: 'Total Donations Tracked',
      description: 'Across all political entities',
    },
    {
      value: '1,247',
      label: 'Suspicious Reports Submitted',
      description: 'This year alone',
    },
    {
      value: '487',
      label: 'Campaigns Monitored',
      description: 'Active tracking',
    },
    {
      value: '94.2%',
      label: 'Transparency Score',
      description: 'Industry leading',
    },
  ];

  return (
    <section className="py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-foreground mb-4">Making an Impact Together</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our platform is transforming political finance transparency across the nation
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{stat.value}</div>
            <div className="text-lg font-medium text-foreground">{stat.label}</div>
            <div className="text-sm text-muted-foreground mt-2">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      {/* <div className="text-center mt-16">
          <p className="text-xl text-muted-foreground mb-6">
            Join thousands of citizens and organizations committed to financial transparency
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-medium shadow-lg hover:shadow-xl">
              Start Monitoring Today
            </button>
            <button className="px-8 py-4 border border-border text-foreground rounded-xl hover:bg-accent transition-all font-medium">
              Download Report
            </button>
          </div>
        </div> */}
    </section>
  );
}
