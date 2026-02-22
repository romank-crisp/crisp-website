const words = [
  "*No",
  "project",
  "is",
  "too",
  "small*.",
  "From",
  "pitch"
];

words.forEach(word => {
  const match = word.match(/^(\*)([^*]+)(\*)(.*)$/);
  console.log(`Word: "${word}", Match:`, match ? [match[1], match[2], match[3], match[4]] : null);
});
