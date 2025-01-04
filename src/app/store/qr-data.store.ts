import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  DEFAULT_QR_CONFIG,
  DEFAULT_QR_ICON,
  DEFAULT_QR_STYLE,
} from './qr-data.config';
import { HistoryItem } from '../types/history-item.type';
import { ConfigStore, IconStore, StyleStore } from '../types/store.types';
import { GradientData } from '../types/store.types';

type Section = 'dots' | 'square' | 'cornerDot' | 'background';

export const qrConfigStore = signalStore(
  { providedIn: 'root' },
  withState(DEFAULT_QR_CONFIG),
  withMethods((store) => {
    return {
      update(value: Partial<ConfigStore>) {
        patchState(store, (state: ConfigStore) => ({
          ...state,
          ...value,
        }));
      },
      reset() {
        patchState(store, () => DEFAULT_QR_CONFIG);
      },
      patchFromHistory(historyItem: HistoryItem) {
        patchState(store, (state: ConfigStore) => ({
          ...state,
          ...historyItem.config,
        }));
      },
    };
  })
);

export const qrIconStore = signalStore(
  { providedIn: 'root' },
  withState(DEFAULT_QR_ICON),
  withMethods((store) => {
    return {
      update(value: Partial<IconStore>) {
        patchState(store, (state) => ({
          ...state,
          ...value,
        }));
      },
      reset() {
        patchState(store, () => DEFAULT_QR_ICON);
      },
      patchFromHistory(historyItem: HistoryItem) {
        patchState(store, (state: IconStore) => ({
          ...state,
          ...historyItem.icon,
        }));
      },
    };
  })
);

export const qrStyleStore = signalStore(
  { providedIn: 'root' },
  withState(DEFAULT_QR_STYLE),
  withMethods((store) => {
    return {
      updateGradient(param: Section, value: Partial<GradientData>) {
        patchState(store, (state) => ({
          ...state,
          [param]: {
            ...state[param],
            gradient: { ...state[param].gradient, ...value },
          },
        }));
      },
      update(
        param: Section,
        value:
          | Partial<StyleStore['dots']>
          | Partial<StyleStore['background']>
          | Partial<StyleStore['square']>
          | Partial<StyleStore['cornerDot']>
      ) {
        patchState(store, (state) => ({
          ...state,
          [param]: {
            ...state[param],
            ...value,
          },
        }));
      },
      reset() {
        patchState(store, () => DEFAULT_QR_STYLE);
      },
      patchFromHistory(historyItem: HistoryItem) {
        patchState(store, (state: StyleStore) => ({
          ...state,
          ...historyItem.style,
        }));
      },
    };
  })
);
