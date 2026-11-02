// Simple Chart Components
const PieChartComponent = ({ data, colors, labels }: { data: number[]; colors: string[]; labels: string[] }) => {
  const total = data.reduce((sum, val) => sum + val, 0);
  let currentAngle = 0;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {data.map((value, index) => {
          const percentage = (value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;

          currentAngle += angle;

          return (
            <path
              key={index}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={colors[index]}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center transform rotate-90">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>
    </div>
  );
};

const BarChartComponent = ({ data, labels, color }: { data: number[]; labels: string[]; color: string }) => {
  const maxValue = Math.max(...data);

  return (
    <div className="w-full h-64 flex items-end justify-between space-x-2">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div className="w-full bg-gray-100 rounded-t relative">
            <div className={`w-full ${color} rounded-t transition-all duration-500`} style={{ height: `${(value / maxValue) * 100}%` }} />
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">{value.toLocaleString()}</span>
          </div>
          <span className="text-xs text-gray-600 mt-2 text-center">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
};

const LineChartComponent = ({ data, labels }: { data: number[]; labels: string[] }) => {
  const maxValue = Math.max(...data);
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full h-64 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}

        {/* Data line */}
        <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" />

        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (value / maxValue) * 100;
          return <circle key={index} cx={x} cy={y} r="2" fill="#3b82f6" />;
        })}
      </svg>

      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
        {labels.map((label, index) => (
          <span key={index} className="flex-1 text-center">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export { PieChartComponent, BarChartComponent, LineChartComponent };
