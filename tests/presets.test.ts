import { describe, it, expect } from "vitest";
import { CONTRACT_PRESETS } from "../src/lib/presets";

describe("Contract Presets Validation", () => {
  it("includes all 3 target domain presets", () => {
    expect(CONTRACT_PRESETS.length).toBeGreaterThanOrEqual(3);
    const categories = CONTRACT_PRESETS.map((p) => p.category);
    expect(categories).toContain("Freelance MSA");
    expect(categories).toContain("Residential Lease");
    expect(categories).toContain("SaaS Terms");
  });

  it("ensures each preset has substantive text and valid descriptions", () => {
    for (const preset of CONTRACT_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.rawText.length).toBeGreaterThan(200);
      expect(preset.badge).toBeTruthy();
      expect(preset.description).toBeTruthy();
    }
  });

  it("contains a comparable text version for freelance redline diffing", () => {
    const freelance = CONTRACT_PRESETS.find((p) => p.category === "Freelance MSA");
    expect(freelance).toBeDefined();
    expect(freelance?.comparableText).toBeDefined();
    expect(freelance?.comparableText?.length).toBeGreaterThan(200);
  });
});
