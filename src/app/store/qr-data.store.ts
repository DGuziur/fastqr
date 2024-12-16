import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

const qrStyleDefaultState = {
  dots: {
    color: '#000000',
    isGradient: true,
    type: 'rounded',
    gradient: {
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
    isGradient: true,
    type: 'dot',
    gradient: {
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
    isGradient: true,
    type: 'extra-rounded',
    gradient: {
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
    isGradient: true,
    gradient: {
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
      reset() {
        patchState(store, () => qrStyleDefaultState);
      },
      patchFromHistory(historyItem: any) {
        patchState(store, (state) => historyItem);
      },
    };
  })
);
