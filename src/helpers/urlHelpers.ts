const replaceLastURLSegment = (segment: string): string => {
  const pathSegments = location.pathname.split('/');
  pathSegments.pop();
  pathSegments.push(`${segment}`);
  const newPath = pathSegments.join('/');
  return newPath;
};

export { replaceLastURLSegment };
