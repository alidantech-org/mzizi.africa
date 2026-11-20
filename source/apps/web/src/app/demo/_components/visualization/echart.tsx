/** Server-rendered ECharts: the chart is real SVG in the HTML, no client JavaScript. */
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { palette, themed } from "#demo/_lib/charts/palette";

export async function EChart({
  option,
  width = 560,
  height = 280,
  label,
}: {
  option: Record<string, unknown>;
  width?: number;
  height?: number;
  label: string;
}) {
  "use cache";
  const chart = echarts.init(null, null, { renderer: "svg", ssr: true, width, height });
  chart.setOption({
    animation: false,
    color: [...palette.series],
    textStyle: { fontFamily: "inherit", color: palette.muted },
    ...option,
  } as EChartsOption);
  const svg = themed(chart.renderToSVGString({ useViewBox: true }));
  chart.dispose();
  return (
    <div
      role="img"
      aria-label={label}
      className="w-full [&>svg]:h-auto [&>svg]:w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
