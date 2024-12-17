import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type Section = 'dots' | 'square' | 'cornerDot' | 'background';

const qrStyleDefaultState = {
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

const qrConfigDefaultState = {
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

export const qrConfigStore = signalStore(
  { providedIn: 'root' },
  withState(qrConfigDefaultState),
  withMethods((store) => {
    return {
      update(value: any) {
        patchState(store, (state) => ({
          ...state,
          ...value,
        }));
      },
      reset() {
        patchState(store, () => qrConfigDefaultState);
      },
      patchFromHistory(historyItem: any) {
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
      update(value: any) {
        patchState(store, (state) => ({
          ...state,
          ...value,
        }));
      },
      reset() {
        patchState(store, () => qrIconDefaultState);
      },
      patchFromHistory(historyItem: any) {
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
      updateGradient(param: Section, value: any) {
        patchState(store, (state) => ({
          ...state,
          [param]: {
            ...state[param],
            gradient: { ...state.dots.gradient, ...value },
          },
        }));
      },
      update(param: Section, value: any) {
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
      patchFromHistory(historyItem: any) {
        patchState(store, (state) => historyItem);
      },
    };
  })
);
