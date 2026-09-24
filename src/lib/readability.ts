/**
 * Plain English Readability & De-Jargonization Metrics
 * Implements Flesch-Kincaid Grade Level and Flesch Reading Ease formulas.
 * Quantifies the accessibility improvement between complex legalese and LexiGuard plain English.
 */

export interface ReadabilityMetrics {
  readingEase: number;       // 0 to 100 (higher is easier to read)
  gradeLevel: number;        // Equivalent school grade (e.g. 8.0 = 8th grade)
  difficultyLabel: string;   // "Post-Graduate Legalese", "Difficult", "Accessible Plain English", etc.
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
}

export interface DejargonizationComparison {
  original: ReadabilityMetrics;
  simplified: ReadabilityMetrics;
  clarityImprovementPercent: number;
  gradeReduction: number;
  summaryText: string;
}

/**
 * Counts syllables in an English word using phonetic heuristics
 */
export function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (clean.length <= 3) return 1;

  // Remove silent terminal e
  const trimmed = clean.replace(/(?:[^laeiouy]|ed|es|e)$/, "");
  // Match vowel groups
  const matches = trimmed.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Calculates Flesch-Kincaid readability metrics for a passage of text
 */
export function calculateReadability(text: string): ReadabilityMetrics {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return {
      readingEase: 0,
      gradeLevel: 0,
      difficultyLabel: "No text provided",
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
    };
  }

  // Tokenize sentences
  const sentences = text
    .split(/[.!?]+(?:\s+|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  // Tokenize words
  const words = text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z]/g, "").trim())
    .filter((w) => w.length > 0);
  const wordCount = Math.max(1, words.length);

  // Count total syllables
  let syllableCount = 0;
  for (const word of words) {
    syllableCount += countSyllables(word);
  }

  const asl = wordCount / sentenceCount; // Average sentence length
  const asw = syllableCount / wordCount; // Average syllables per word

  // Flesch Reading Ease: 206.835 - 1.015(ASL) - 84.6(ASW)
  const rawEase = 206.835 - 1.015 * asl - 84.6 * asw;
  const readingEase = Math.round(Math.max(0, Math.min(100, rawEase)));

  // Flesch-Kincaid Grade Level: 0.39(ASL) + 11.8(ASW) - 15.59
  const rawGrade = 0.39 * asl + 11.8 * asw - 15.59;
  const gradeLevel = Math.max(1, Math.round(rawGrade * 10) / 10);

  let difficultyLabel = "Accessible Plain English";
  if (readingEase < 30 || gradeLevel >= 15) {
    difficultyLabel = "Post-Graduate Legalese (Very Complex)";
  } else if (readingEase < 50 || gradeLevel >= 12) {
    difficultyLabel = "Dense Corporate Contract (Difficult)";
  } else if (readingEase < 65 || gradeLevel >= 9) {
    difficultyLabel = "Standard Business Language";
  } else {
    difficultyLabel = "Crystal Clear Plain English (Accessible)";
  }

  return {
    readingEase,
    gradeLevel,
    difficultyLabel,
    wordCount,
    sentenceCount,
    syllableCount,
  };
}

/**
 * Computes the comparative clarity delta between raw legal text and LexiGuard plain English
 */
export function compareDejargonization(
  originalText: string,
  simplifiedText: string
): DejargonizationComparison {
  const original = calculateReadability(originalText);
  const simplified = calculateReadability(simplifiedText);

  const gradeReduction = Math.max(0, Math.round((original.gradeLevel - simplified.gradeLevel) * 10) / 10);
  const easeGain = Math.max(0, simplified.readingEase - original.readingEase);
  const clarityImprovementPercent = Math.min(100, Math.round((easeGain / Math.max(1, 100 - original.readingEase)) * 100));

  return {
    original,
    simplified,
    clarityImprovementPercent,
    gradeReduction,
    summaryText: `Reduced reading difficulty from Grade ${original.gradeLevel} (${original.difficultyLabel}) down to Grade ${simplified.gradeLevel} (${simplified.difficultyLabel}), delivering a +${clarityImprovementPercent}% boost in legal accessibility.`,
  };
}
