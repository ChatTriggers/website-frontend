export default (sem1: string, sem2: string): -1 | 0 | 1 => {
  const parts1 = sem1.split('.').map(s => parseInt(s, 10));
  const parts2 = sem2.split('.').map(s => parseInt(s, 10));

  if (parts1[0] > parts2[0]) return -1;
  if (parts1[0] < parts2[0]) return 1;
  if (parts1[1] > parts2[1]) return -1;
  if (parts1[1] < parts2[1]) return 1;
  if (parts1[2] > parts2[2]) return -1;
  if (parts1[2] < parts2[2]) return 1;

  return 0;
};
