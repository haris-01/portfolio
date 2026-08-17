export const AI_LAB_SCENE = {
  stages: [
    { name: 'DOCUMENTS', description: 'Source material enters the pipeline.' },
    { name: 'PARSING', description: 'Raw text is extracted and cleaned.' },
    { name: 'CHUNKS', description: 'Content is split into retrievable pieces.' },
    { name: 'EMBEDDINGS', description: 'Each chunk becomes a vector.' },
    { name: 'VECTOR SEARCH', description: 'A query is matched against the index.' },
    { name: 'RETRIEVAL', description: 'The most relevant chunks are pulled back.' },
    { name: 'LLM', description: 'The model reasons over what was retrieved.' },
    { name: 'ANSWER', description: 'A grounded answer reaches the user.' },
  ],
};
