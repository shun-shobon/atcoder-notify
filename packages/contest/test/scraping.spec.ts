import * as scraping from "../src/scraping";

jest.mock("axios");
import axios, { AxiosInstance } from "axios";

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
    const mockedResponse = "This is mocked response";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockedAxios: jest.Mocked<AxiosInstance> = axios as any;
    mockedAxios.get.mockResolvedValue({ data: mockedResponse });

    const html = await scraping.fetchPage();
    expect(html).toBeDefined();
    expect(html).not.toBeNull();
    expect(html).toBe(mockedResponse);
  });

  it("should return null if it failed to access contest page", async () => {
    const mockedResponse = "This is mocked error";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockedAxios: jest.Mocked<AxiosInstance> = axios as any;
    mockedAxios.get.mockImplementation(() => {
      throw new Error(mockedResponse);
    });

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

  it("should return contest array which has only one contest which has data #1", () => {
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
    `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contestArray = scraping.parseUpcomingContest(upcomingContestHtml) as any;
    expect(contestArray).toBeDefined();
    expect(contestArray).not.toBeNull();
    const contest = contestArray[0];
    expect(contest).toBeDefined();
    expect(contest.title).toBe("AtCoder Beginner Contest 173");
    expect(contest.url).toBe("/contests/abc173");
    expect(contest.color).toBe("blue");
    expect(contest.begin.getTime()).toBe(new Date("2020-07-05 21:00:00+0900").getTime());
    expect(contest.end.getTime()).toBe(new Date("2020-07-05 22:40:00+0900").getTime());
    expect(contest.duration.hours).toBe(1);
    expect(contest.duration.minutes).toBe(40);
    expect(contest.isRated).toBeTruthy();
    expect(contest.targetRate.max).toBe(1999);
    expect(contest.targetRate.min).toBeUndefined();
  });

  it("should return contest array which has only one contest which has data #2", () => {
    const upcomingContestHtml = getUpcomingContestHtml(`
      <tr>
        <td class="text-center">
          <a href="https://www.timeanddate.com/worldclock/fixedtime.html?iso=20200620T2100&p1=248" target="_blank">
            <time class="fixtime fixtime-full">2020-06-20 21:00:00+0900</time>
          </a>
        </td>
        <td>
          <span class="user-red">◉</span>
          <a href="/contests/agc046">AtCoder Grand Contest 046</a>
        </td>
        <td class="text-center">02:30</td>
        <td class="text-center">1200 ~ </td>
      </tr>
    `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contestArray = scraping.parseUpcomingContest(upcomingContestHtml) as any;
    expect(contestArray).toBeDefined();
    expect(contestArray).not.toBeNull();
    const contest = contestArray[0];
    expect(contest).toBeDefined();
    expect(contest.title).toBe("AtCoder Grand Contest 046");
    expect(contest.url).toBe("/contests/agc046");
    expect(contest.color).toBe("red");
    expect(contest.begin.getTime()).toBe(new Date("2020-06-20 21:00:00+0900").getTime());
    expect(contest.end.getTime()).toBe(new Date("2020-06-20 23:30:00+0900").getTime());
    expect(contest.duration.hours).toBe(2);
    expect(contest.duration.minutes).toBe(30);
    expect(contest.isRated).toBeTruthy();
    expect(contest.targetRate.max).toBeUndefined();
    expect(contest.targetRate.min).toBe(1200);
  });

  it("should return contest array which has only one contest which has data #3", () => {
    const upcomingContestHtml = getUpcomingContestHtml(`
      <tr>
        <td class="text-center">
          <a href="https://www.timeanddate.com/worldclock/fixedtime.html?iso=20200430T1000&p1=248" target="_blank">
            <time class="fixtime fixtime-full">2020-04-30 10:00:00+0900</time>
          </a>
        </td>
        <td>
          <span class>◉</span>
          <a href="/contests/asprocon6">第6回 Asprova プログラミングコンテスト</a>
        </td>
        <td class="text-center">168:00</td>
        <td class="text-center">-</td>
      </tr>
    `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contestArray = scraping.parseUpcomingContest(upcomingContestHtml) as any;
    expect(contestArray).toBeDefined();
    expect(contestArray).not.toBeNull();
    const contest = contestArray[0];
    expect(contest).toBeDefined();
    expect(contest.title).toBe("第6回 Asprova プログラミングコンテスト");
    expect(contest.url).toBe("/contests/asprocon6");
    expect(contest.color).toBe("black");
    expect(contest.begin.getTime()).toBe(new Date("2020-04-30 10:00:00+0900").getTime());
    expect(contest.end.getTime()).toBe(new Date("2020-05-07 10:00:00+0900").getTime());
    expect(contest.duration.hours).toBe(168);
    expect(contest.duration.minutes).toBe(0);
    expect(contest.isRated).toBeFalsy();
    expect(contest.targetRate.max).toBeUndefined();
    expect(contest.targetRate.min).toBeUndefined();
  });

  it("should return contest array which has only one contest which has data #4", () => {
    const upcomingContestHtml = getUpcomingContestHtml(`
      <tr>
        <td class="text-center">
          <a href="https://www.timeanddate.com/worldclock/fixedtime.html?iso=20200530T2100&p1=248" target="_blank">
            <time class="fixtime fixtime-full">2020-05-30 21:00:00+0900</time>
          </a>
        </td>
        <td>
          <span class="user-red">◉</span>
          <a href="/contests/agc044">AtCoder Grand Contest 044</a>
        </td>
        <td class="text-center">02:30</td>
        <td class="text-center">All</td>
      </tr>
    `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contestArray = scraping.parseUpcomingContest(upcomingContestHtml) as any;
    expect(contestArray).toBeDefined();
    expect(contestArray).not.toBeNull();
    const contest = contestArray[0];
    expect(contest).toBeDefined();
    expect(contest.title).toBe("AtCoder Grand Contest 044");
    expect(contest.url).toBe("/contests/agc044");
    expect(contest.color).toBe("red");
    expect(contest.begin.getTime()).toBe(new Date("2020-05-30 21:00:00+0900").getTime());
    expect(contest.end.getTime()).toBe(new Date("2020-05-30 23:30:00+0900").getTime());
    expect(contest.duration.hours).toBe(2);
    expect(contest.duration.minutes).toBe(30);
    expect(contest.isRated).toBeTruthy();
    expect(contest.targetRate.max).toBeUndefined();
    expect(contest.targetRate.min).toBeUndefined();
  });
});
