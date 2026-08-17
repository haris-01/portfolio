export const ENGINEERING_SCENE = {
  stages: [
    { name: 'REQUEST', description: 'A request arrives at the edge.' },
    { name: 'API', description: 'The API layer authenticates and routes it.' },
    { name: 'SERVICE', description: 'Business logic processes the request.' },
    { name: 'DATABASE', description: 'Data is read or written.' },
    { name: 'QUEUE', description: 'Long-running work is queued.' },
    { name: 'WORKER', description: 'A background worker picks it up.' },
    { name: 'RESPONSE', description: 'The result flows back to the client.' },
  ],
};
