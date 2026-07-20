export interface LoadItem {
  id: string;
  name: string;
  quantity: number;
  powerWatts: number;
  pf: number;
  phase: '1-Phase' | '3-Phase';
  diversityFactor: number;
}
