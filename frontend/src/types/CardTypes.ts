export interface ChartProps {
  labels: string[];
  datasets: Dataset[];
}

export type ArcProps = number;

export interface TextProps {
  color: string;
  text: string;
}

export interface SatInfoProps {
  lat: number;
  lng: number;
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor: string;
  borderWidth?: number;
  tension?: number;
}

export interface CardTypeToData {
  line: ChartProps;
  bar: ChartProps;
  doughnut: ChartProps;
  polar: ChartProps;
  arc: ArcProps;
  text: TextProps;
  satInfo: SatInfoProps;
}

export type ChartType = keyof CardTypeToData;

export type DataEntry = {
  [K in ChartType]: {
    title: string;
    chartType: K;
    data: CardTypeToData[K];
  };
}[ChartType];
