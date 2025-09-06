type Subscriber = (msg: { title: string; detail?: string; status?: number }) => void;

const subs = new Set<Subscriber>();

export function subscribeToast(fn: Subscriber) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export function emitToast(msg: { title: string; detail?: string; status?: number }) {
  subs.forEach((fn) => fn(msg));
}

