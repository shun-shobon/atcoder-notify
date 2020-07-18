import * as scraping from "../src/scraping";

describe("fetchPage()", () => {
  it("should return raw html string if it succeeded to access contest page", async () => {
    const html = await scraping.fetchPage();
    expect(html).toBeDefined();
    expect(typeof html).toBe("string");
  });

  it("should return null if it failed to access contest page", async () => {
    const html = await scraping.fetchPage();
    expect(html).toBeDefined();
    expect(html).toBeNull();
  });
});
