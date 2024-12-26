import { QrType, ConfigStore, StyleStore, IconStore } from './store.types';

export type HistoryItem = {
  type?: QrType;
  createdAt: Date | string;
  canvas?: string;
  config: ConfigStore;
  icon: IconStore;
  style: StyleStore;
};
