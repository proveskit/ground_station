export type Dataset = {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor: string;
  borderWidth?: number;
  tension?: number;
};

export type DataStructure = {
  labels: string[];
  datasets: Dataset[];
};

export type DataResponse = {
  [key: string]: Array<
    | {
        type: "chart";
        title: string;
        chartType: "line" | "bar" | "doughnut" | "polar";
        data: DataStructure;
      }
    | {
        type: "text";
        title: string;
        data: {
          color: string;
          text: string;
        };
      }
  >;
};
