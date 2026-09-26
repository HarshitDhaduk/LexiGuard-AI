import { describe, it, expect } from "vitest";
import { PERSONA_PROFILES, getPersonaProfile, PersonaId } from "../src/lib/persona";

describe("User Persona & Context-Aware Logic", () => {
  const personas: PersonaId[] = ["freelancer", "tenant", "small_business", "consumer"];

  it("defines all 4 core non-lawyer challenge personas", () => {
    personas.forEach((id) => {
      const profile = PERSONA_PROFILES[id];
      expect(profile).toBeDefined();
      expect(profile.id).toBe(id);
      expect(profile.name).toBeTruthy();
      expect(profile.tagline).toBeTruthy();
      expect(profile.roleTitle).toBeTruthy();
      expect(profile.iconName).toBeTruthy();
    });
  });

  it("provides tailored key interests and watch-out traps for each persona", () => {
    personas.forEach((id) => {
      const profile = getPersonaProfile(id);
      expect(profile.primaryInterests.length).toBeGreaterThanOrEqual(4);
      expect(profile.watchOutTraps.length).toBeGreaterThanOrEqual(4);
      expect(profile.suggestedQuestions.length).toBeGreaterThanOrEqual(4);
      expect(profile.benchmarkFocus).toBeTruthy();
    });
  });

  it("provides 5 customized pre-signing safety checklist items per persona", () => {
    personas.forEach((id) => {
      const profile = getPersonaProfile(id);
      expect(profile.checklistItems.length).toBe(5);
      profile.checklistItems.forEach((item) => {
        expect(item.id).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.description).toBeTruthy();
        expect(item.recommendation).toBeTruthy();
      });
    });
  });

  it("safely falls back to freelancer persona if an unknown ID is provided", () => {
    // @ts-expect-error Testing invalid fallback
    const fallback = getPersonaProfile("unknown_persona");
    expect(fallback.id).toBe("freelancer");
  });

  it("maps valid matching presets to personas", () => {
    expect(PERSONA_PROFILES.freelancer.matchingPresetId).toBe("freelance-predatory-msa");
    expect(PERSONA_PROFILES.tenant.matchingPresetId).toBe("residential-lease-harsh");
    expect(PERSONA_PROFILES.consumer.matchingPresetId).toBe("saas-terms-invasive");
  });
});
