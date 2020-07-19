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

/* eslint-disable */
export function parseUpcomingContest(html: string) {}
