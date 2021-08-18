const getBufferArray = async (src: string) => {
  const res = await fetch(src);
  return res.arrayBuffer() as Promise<any>;
};

export { getBufferArray };
