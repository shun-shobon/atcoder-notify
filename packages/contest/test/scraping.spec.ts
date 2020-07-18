import * as scraping from "../src/scraping";

const getUpcomingContestHtml = (contestHtml: string) => `
  <div id="contest-table-upcoming">
    <div class="panel panel-default">
      <div class="table-responsive">
        <table class="table table-default table-striped table-hover table-condensed table-bordered small">
          <tbody>
            ${contestHtml}
          </tbody>
        </table>
      </div>
    </div>
  </div>
`;

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

describe("parseUpcomingContest()", () => {
  it("should return contest array of length 2 data if contest DOM exists in HTML", () => {
    const upcomingContestHtml = getUpcomingContestHtml(`
      <tr>
        <td class="text-center">
          <a href="https://www.timeanddate.com/worldclock/fixedtime.html?iso=20200705T2100&p1=248" target="_blank">
            <time class="fixtime fixtime-full">2020-07-05 21:00:00+0900</time>
          </a>
        </td>
        <td>
          <span class="user-blue">◉</span>
          <a href="/contests/abc173">AtCoder Beginner Contest 173</a>
        </td>
        <td class="text-center">01:40</td>
        <td class="text-center"> ~ 1999</td>
      </tr>
      <tr>
        <td class="text-center">
          <a href="https://www.timeanddate.com/worldclock/fixedtime.html?iso=20200627T2100&p1=248" target="_blank">
            <time class="fixtime fixtime-full">2020-06-27 21:00:00+0900</time>
          </a>
        </td>
        <td>
          <span class="user-blue">◉</span>
          <a href="/contests/abc172">AtCoder Beginner Contest 172</a>
        </td>
        <td class="text-center">01:40</td>
        <td class="text-center"> ~ 1999</td>
      </tr>
    `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contestArray = scraping.parseUpcomingContest(upcomingContestHtml) as any;
    expect(contestArray).toBeDefined();
    expect(contestArray).not.toBeNull();
    expect(contestArray.length).toBe(2);
  });

  it("should return contest array of length 0 if upcoming contest DOM does not exists in HTML", () => {
    const upcomingContestHtml = getUpcomingContestHtml("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contestArray = scraping.parseUpcomingContest(upcomingContestHtml) as any;
    expect(contestArray).toBeDefined();
    expect(contestArray).not.toBeNull();
    expect(contestArray.length).toBe(0);
  });
});
