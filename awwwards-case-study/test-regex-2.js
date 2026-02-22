const words = [
  "*No",
  "project",
  "is",
  "too",
  "small*.",
  "From",
  "pitch"
];

let isHighlighting = false;

const processedWords = words.map(word => {
  let displayWord = word;
  let trailingPunctuation = "";
  
  // Single word that starts AND ends with * (and might have punctuation)
  const singleMatch = word.match(/^(\*)([^*]+)(\*)(.*)$/);
  if (singleMatch && !isHighlighting) {
      return { word: singleMatch[2], isHighlighted: true, trailingPunctuation: singleMatch[4] };
  }
  
  // Check for starting asterisk
  if (word.startsWith("*") && !isHighlighting) {
    isHighlighting = true;
    displayWord = word.slice(1);
    return { word: displayWord, isHighlighted: true, trailingPunctuation };
  }
  
  // Check for ending asterisk (with possible punctuation)
  if (isHighlighting) {
    // Note: this assumes the word itself might contain an asterisk anywhere if it ends there, 
    // but typically it's at the end. Let's do a reliable check:
    const endMatch = word.match(/^(.*)(\*)(.*)$/);
    if (endMatch) {
      isHighlighting = false;
      displayWord = endMatch[1];
      trailingPunctuation = endMatch[3];
      return { word: displayWord, isHighlighted: true, trailingPunctuation };
    }
  }

  // Middle of highlight or normal word
  return { word: displayWord, isHighlighted, trailingPunctuation };
});

console.log(processedWords);
