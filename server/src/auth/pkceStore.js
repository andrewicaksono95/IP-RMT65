const store = new Map(); // state -> { verifier, createdAt }

const EXPIRY_MS = 5 * 60 * 1000;

export function putState(state, verifier){
  prune();
  store.set(state, { verifier, createdAt: Date.now() });
}

export function consumeState(state){
  const entry = store.get(state);
  if (!entry) return null;
  store.delete(state);
  if (Date.now() - entry.createdAt > EXPIRY_MS) return null;
  return entry.verifier;
}

function prune(){
  const now = Date.now();
  for (const [k,v] of store.entries()) if (now - v.createdAt > EXPIRY_MS) store.delete(k);
}

export function __clearAll(){ store.clear(); }