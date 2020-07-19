import axios from "axios";
import { JSDOM } from "jsdom";

export async function fetchPage(): Promise<string | null> {
  const url = "https://atcoder.jp/contests/?lang=ja";
  try {
    const { data } = await axios.get<string>(url);
    return data;
  } catch (error) {
    return null;
  }
}

type DiffColor = "black" | "green" | "blue" | "orange" | "red";
type Duration = {
  hours: number;
  minutes: number;
};
type TargetRate = {
  max?: number;
  min?: number;
};
export type Contest = {
  title: string;
  url: string;
  color: DiffColor;
  begin: Date;
  end: Date;
  duration: Duration;
  isRated: boolean;
  targetRate: TargetRate;
};

export function parseUpcomingContest(html: string): Contest[] | null {
  const { document } = new JSDOM(html).window;
  const contestRowElements = document
    ?.querySelector("#contest-table-upcoming")
    ?.querySelector("tbody")
    ?.querySelectorAll("tr");
  if (contestRowElements == null) return null;
  return Array.from(contestRowElements).flatMap((rowElement) => {
    const [
      dateColumn,
      diffAndTitleColumn,
      durationColumn,
      targetRateColumn,
    ] = rowElement.getElementsByTagName("td");

    const rawTextBeginDate = dateColumn.querySelector("time.fixtime.fixtime-full")?.textContent;
    if (rawTextBeginDate == null) return [];
    const beginDate = new Date(rawTextBeginDate);

    const rawTextDuration = durationColumn?.textContent;
    if (rawTextDuration == null) return [];
    const [durationHours, durationMinutes] = rawTextDuration
      .split(":")
      .map((rawText) => parseInt(rawText));
    if (durationHours == null || durationMinutes == null) return [];

    const endDate = new Date(beginDate);
    endDate.setHours(endDate.getHours() + durationHours);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);

    const titleElement = diffAndTitleColumn?.querySelector("a");
    const title = titleElement?.textContent;
    const url = titleElement?.getAttribute("href");
    if (title == null || url == null) return [];

    const diffElementClass = diffAndTitleColumn?.querySelector("span")?.getAttribute("class");
    if (diffElementClass == null) return [];
    const color = (diffElementClass === "" ? "black" : diffElementClass.slice(5)) as DiffColor;

    const rawTextTargetRate = targetRateColumn?.textContent;
    if (rawTextTargetRate == null) return [];

    let isRated: boolean;
    let targetRate: TargetRate;
    switch (rawTextTargetRate) {
      case "-": {
        isRated = false;
        targetRate = {};
        break;
      }
      case "All": {
        isRated = true;
        targetRate = {};
        break;
      }
      default: {
        isRated = true;
        const [min, max] = rawTextTargetRate.split("~").map((text) => {
          const rate = parseInt(text);
          return rate ? rate : undefined;
        });
        targetRate = { min, max };
        break;
      }
    }
    const contest: Contest = {
      title,
      url,
      color,
      begin: beginDate,
      end: endDate,
      duration: {
        hours: durationHours,
        minutes: durationMinutes,
      },
      isRated,
      targetRate,
    };
    return [contest];
  });
}
