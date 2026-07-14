import { normalizeSummary } from './summary-normalize.util';

describe('normalizeSummary', () => {
  it('leaves a well-behaved 5-sentence English summary untouched', () => {
    const text =
      'The city council approved the new budget. It includes funding for roads. ' +
      'Officials say work starts next month. Residents raised concerns about noise. ' +
      'Read the full story at: https://example.com/a';
    expect(normalizeSummary(text)).toBe(text);
  });

  it('clamps a bloated English bullet-list response to 5 sentences and keeps the URL sentence', () => {
    const bloated =
      Array.from({ length: 20 }, (_, i) => `- Point ${i + 1} about the story.`).join('\n') +
      '\nRead the full story at: https://example.com/a';
    const out = normalizeSummary(bloated);
    const sentenceCount = out.split(/(?<=[.!?])\s+/).filter(Boolean).length;
    expect(sentenceCount).toBe(5);
    expect(out).toContain('Read the full story at: https://example.com/a');
    expect(out).not.toContain('\n');
    expect(out).not.toContain('- Point');
  });

  it('leaves a well-behaved 5-phrase French summary untouched', () => {
    const text =
      "Le conseil municipal a approuvé le nouveau budget. Il inclut le financement des routes. " +
      "Les travaux commencent le mois prochain. Des habitants ont exprimé des inquiétudes. " +
      "Lire l'article complet sur : https://example.com/a";
    expect(normalizeSummary(text)).toBe(text);
  });

  it('clamps a bloated French numbered-list response and keeps the URL sentence', () => {
    const bloated =
      Array.from({ length: 15 }, (_, i) => `${i + 1}. Détail numéro ${i + 1} de l'histoire.`).join('\n') +
      "\nLire l'article complet sur : https://example.com/a";
    const out = normalizeSummary(bloated);
    const sentenceCount = out.split(/(?<=[.!?])\s+/).filter(Boolean).length;
    expect(sentenceCount).toBe(5);
    expect(out).toContain("Lire l'article complet sur : https://example.com/a");
    expect(out).not.toMatch(/^\d+\./m);
  });

  it('leaves a well-behaved 5-sentence Kinyarwanda summary untouched', () => {
    const text =
      "Iyi nkuru ivuga ku ihinduka ry'amabwiriza. Guverinoma yatangaje amabwiriza mashya. " +
      "Abaturage barasabwa kubahiriza amategeko. Ibi bizatangira gukurikizwa mu kwezi gutaha. " +
      "Soma inkuru yose hano: https://example.com/a";
    expect(normalizeSummary(text)).toBe(text);
  });

  it('clamps a bloated Kinyarwanda response with markdown headers and keeps the URL sentence', () => {
    const bloated =
      Array.from({ length: 12 }, (_, i) => `### Ingingo ya ${i + 1}\nIbisobanuro ${i + 1} ku nkuru.`).join('\n') +
      '\nSoma inkuru yose hano: https://example.com/a';
    const out = normalizeSummary(bloated);
    const sentenceCount = out.split(/(?<=[.!?])\s+/).filter(Boolean).length;
    expect(sentenceCount).toBe(5);
    expect(out).toContain('Soma inkuru yose hano: https://example.com/a');
    expect(out).not.toContain('#');
  });

  it('collapses multi-paragraph output with blank lines even under 5 sentences', () => {
    const text = 'First point here.\n\nSecond point here.\n\nThird point, no closing url.';
    const out = normalizeSummary(text);
    expect(out).not.toContain('\n');
    expect(out).toBe('First point here. Second point here. Third point, no closing url.');
  });
});
