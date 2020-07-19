import axios from "axios";

export async function fetchPage(): Promise<string | null> {
  const url = "https://atcoder.jp/contests/?lang=ja";
  try {
    const { data } = await axios.get<string>(url);
    return data;
  } catch (error) {
    return null;
  }
}

type Duration = {
  hours: number;
  minutes: number;
};
type TargetRate = {
  max: number;
  min: number;
};
export type Contest = {
  title: string;
  url: string;
  color: "black" | "green" | "blue" | "orange" | "red";
  begin: Date;
  end: Date;
  duration: Duration;
  isRated: boolean;
  targetRate: TargetRate;
};

/* eslint-disable */
export function parseUpcomingContest(html: string): Contest | null {}
