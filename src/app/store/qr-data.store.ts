import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ErrorCodeLevel } from '../features/qr-generator/qr-generator.component';
import {
  GradientData,
  HistoryItem,
} from '../features/history/history.component';
import {
  CornerDotType,
  CornerSquareType,
  DotType,
  FileExtension,
} from 'qr-code-styling';

type Section = 'dots' | 'square' | 'cornerDot' | 'background';

const qrStyleDefaultState: StyleStore = {
  dots: {
    color: '#000000',
    type: 'rounded',
    gradient: {
      enabled: true,
      type: 'linear',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#ffffff' },
        { offset: 1, color: '#77779C' },
      ],
    },
  },
  cornerDot: {
    color: '#000000',
    type: 'dot',
    gradient: {
      enabled: true,
      type: 'linear',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#ffffff' },
        { offset: 1, color: '#77779C' },
      ],
    },
  },
  square: {
    color: '#000000',
    type: 'extra-rounded',
    gradient: {
      enabled: true,
      type: 'linear',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#ffffff' },
        { offset: 1, color: '#77779C' },
      ],
    },
  },
  background: {
    color: '#ffffff',
    isTransparent: false,
    gradient: {
      enabled: true,
      type: 'linear',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#ffffff' },
        { offset: 1, color: '#77779C' },
      ],
    },
  },
};

const qrConfigDefaultState: ConfigStore = {
  value: '',
  level: 'L',
  margin: 4,
  downloadType: 'png',
};

const qrIconDefaultState = {
  name: '',
  src: '',
  size: 0.5,
  hideBackgroundDots: false,
  margin: 0,
};

type ConfigStore = {
  value: string;
  level: ErrorCodeLevel;
  margin: number;
  downloadType: FileExtension;
};

type IconStore = typeof qrIconDefaultState;
type StyleStore = {
  dots: {
    type: DotType;
    color: string;
    gradient: GradientData;
  };
  cornerDot: {
    type: CornerDotType;
    color: string;
    gradient: GradientData;
  };
  square: {
    type: CornerSquareType;
    color: string;
    gradient: GradientData;
  };
  background: {
    isTransparent: boolean;
    color: string;
    gradient: GradientData;
  };
};
export const qrConfigStore = signalStore(
  { providedIn: 'root' },
  withState(qrConfigDefaultState),
  withMethods((store) => {
    return {
      update(value: Partial<ConfigStore>) {
        patchState(store, (state: ConfigStore) => ({
          ...state,
          ...value,
        }));
      },
      reset() {
        patchState(store, () => qrConfigDefaultState);
      },
      patchFromHistory(historyItem: Partial<ConfigStore>) {
        patchState(store, (state) => historyItem);
      },
    };
  })
);

export const qrIconStore = signalStore(
  { providedIn: 'root' },
  withState(qrIconDefaultState),
  withMethods((store) => {
    return {
      update(value: Partial<IconStore>) {
        patchState(store, (state) => ({
          ...state,
          ...value,
        }));
      },
      reset() {
        patchState(store, () => qrIconDefaultState);
      },
      patchFromHistory(historyItem: Partial<IconStore>) {
        patchState(store, (state) => historyItem);
      },
    };
  })
);

export const qrStyleStore = signalStore(
  { providedIn: 'root' },
  withState(qrStyleDefaultState),
  withMethods((store) => {
    return {
      updateGradient(param: Section, value: Partial<GradientData>) {
        patchState(store, (state) => ({
          ...state,
          [param]: {
            ...state[param],
            gradient: { ...state.dots.gradient, ...value },
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
        patchState(store, () => qrStyleDefaultState);
      },
      patchFromHistory(historyItem: HistoryItem) {
        patchState(store, (state) => state);
      },
    };
  })
);
