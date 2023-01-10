// noinspection JSIgnoredPromiseFromCall

import { DependencyList, useEffect } from 'react';

const useEffectAsync = (effect: () => Promise<void>, deps?: DependencyList) => useEffect(() => {
  effect();
}, deps);

export default useEffectAsync;
