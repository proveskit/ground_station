import SimpleTextCard from "@/components/dashboard/custom/SimpleCard";
import PageHeader from "@/components/PageHeader";
import {
  chartComponents,
  dashboardLayout,
  generateLayout,
  type DashboardLayoutType,
} from "@/lib/layout";
import { sampleData } from "@/lib/sampleData";
import {
  generateChartData,
  underScoreToTitleCase,
  useMakeQuery,
} from "@/lib/utils";
import type { PacketSchema } from "@/types/SchemaTypes";
import type { Packet } from "@/types/ApiTypes";
import { useMemo, useState } from "react";
import { Responsive, WidthProvider, type Layout } from "react-grid-layout";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import type { ChartType } from "@/types/CardTypes";

export default function Dashboard() {
  let { mid } = useParams();

  const packetsQuery = useMakeQuery<{
    schema: PacketSchema;
    packets: Packet[];
  }>("api/get/packets", async () => {
    const response = await fetch(`/api/get/packets?id=${mid}`);
    if (!response.ok) {
      throw new Error("Failed to get packets");
    }
    return response.json();
  });

  const getDataFromPackets = (fieldName: string) => {
    if (!packetsQuery.data) {
      return;
    }

    const final = packetsQuery.data.packets.map((packet) => {
      const data = JSON.parse(packet.packet_data);
      return data[fieldName];
    });
    return final;
  };

  const generateDefaultPacketLayout = () => {
    if (!packetsQuery.data) {
      return;
    }

    const layout: DashboardLayoutType = {
      Packets: [],
    };

    let yVal = 0;

    packetsQuery.data.schema.map((s) => {
      // By default just 2x2 squares that go down
      const l: {
        chartType: ChartType;
        layout: Layout;
      } = {
        chartType: "line",
        layout: {
          w: 4,
          h: 4,
          x: 0,
          y: yVal,
          i: s.name,
        },
      };

      yVal += 4;

      if (s.type === "int" || s.type === "float" || s.type === "vec3") {
        layout["Packets"].push(l);
      } else {
        l.chartType = "text";
        layout["Packets"].push(l);
      }
    });

    setPacketLayout(layout);
  };

  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  // Packet layout (actual data from packets)
  const [packetLayout, setPacketLayout] = useState<
    DashboardLayoutType | undefined
  >(undefined);

  const onPacketLayoutChange = (layout: Layout[]) => {
    const newLayout = packetLayout["Packets"].map((item) => {
      const foundLayout = layout.find((l) => l.i === item.layout.i)!;
      return {
        chartType: item.chartType,
        layout: foundLayout,
      };
    });

    const updatedLayout = {
      ...currentLayout,
      ["Packets"]: newLayout,
    };

    localStorage.setItem("packetLayout", JSON.stringify(updatedLayout));
    setPacketLayout(updatedLayout);
  };

  // Static layout (just test data for now)
  const [currentLayout, setCurrentLayout] = useState<DashboardLayoutType>(
    () => {
      const savedLayout = localStorage.getItem("layout");
      return savedLayout ? JSON.parse(savedLayout) : dashboardLayout;
    },
  );

  const onLayoutChange = (layout: Layout[], category: string) => {
    const newLayout = currentLayout[category].map((item) => {
      const foundLayout = layout.find((l) => l.i === item.layout.i)!;
      return {
        chartType: item.chartType,
        layout: foundLayout,
      };
    });

    const updatedLayout = {
      ...currentLayout,
      [category]: newLayout,
    };

    localStorage.setItem("layout", JSON.stringify(updatedLayout));
    setCurrentLayout(updatedLayout);
  };

  console.log(packetLayout);

  return (
    <>
      <PageHeader title="Dashboard" />
      <Button onClick={generateDefaultPacketLayout} className="w-42">
        Reset Layout to Default
      </Button>
      <div key={"packets"} className="flex flex-col gap-2 px-2">
        {!packetLayout ? (
          <p>Loading packet layout...</p>
        ) : (
          <>
            <h2 className="text-4xl font-bold">
              {underScoreToTitleCase("packets")}
            </h2>
            <ResponsiveGridLayout
              className="layout rounded-md"
              layouts={{ lg: generateLayout(packetLayout["Packets"]) }}
              cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
              rowHeight={30}
              onLayoutChange={(layout) => onPacketLayoutChange(layout)}
            >
              {packetLayout["Packets"].map((item) => {
                const data = getDataFromPackets(item.layout.i);

                if (!data)
                  return (
                    <div key={item.layout.i}>
                      <SimpleTextCard
                        title={underScoreToTitleCase(item.layout.i)}
                        data={{
                          color: "text-red-500",
                          text: `No data found for ${underScoreToTitleCase(
                            item.layout.i,
                          )}`,
                        }}
                      />
                    </div>
                  );

                const ChartComponent = chartComponents[item.chartType];
                const chartData = generateChartData(item.chartType, data);
                return (
                  <div key={item.layout.i}>
                    <ChartComponent
                      title={underScoreToTitleCase(item.layout.i)}
                      data={chartData} // eslint-disable-line @typescript-eslint/no-explicit-any -- i legit can't find any way to type this
                    />
                  </div>
                );
              })}
            </ResponsiveGridLayout>
          </>
        )}
      </div>
      {Object.entries(currentLayout).map(([key, value]) => (
        <div key={key} className="flex flex-col gap-2 px-2">
          <h2 className="text-4xl font-bold">{underScoreToTitleCase(key)}</h2>
          <ResponsiveGridLayout
            className="layout rounded-md"
            layouts={{ lg: generateLayout(value) }}
            cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
            rowHeight={30}
            onLayoutChange={(layout) => onLayoutChange(layout, key)}
          >
            {value.map((item) => {
              const data = sampleData[key].find(
                (data) => data.title === item.layout.i,
              )?.data;

              if (!data)
                return (
                  <div key={item.layout.i}>
                    <SimpleTextCard
                      title={underScoreToTitleCase(item.layout.i)}
                      data={{
                        color: "text-red-500",
                        text: `No data found for ${underScoreToTitleCase(
                          item.layout.i,
                        )}`,
                      }}
                    />
                  </div>
                );

              const ChartComponent = chartComponents[item.chartType];
              return (
                <div key={item.layout.i}>
                  <ChartComponent
                    title={underScoreToTitleCase(item.layout.i)}
                    data={data as any} // eslint-disable-line @typescript-eslint/no-explicit-any -- i legit can't find any way to type this
                  />
                </div>
              );
            })}
          </ResponsiveGridLayout>
        </div>
      ))}
    </>
  );
}
