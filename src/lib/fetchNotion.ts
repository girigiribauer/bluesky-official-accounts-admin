import "server-only";

import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const fetchDuplicateAccounts = async (
  databaseID: string,
  account: string
) => {
  const notionResponse = await notion.databases.query({
    database_id: databaseID,
    filter: {
      property: "Bluesky",
      rich_text: {
        equals: account,
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return notionResponse.results.map((result: any) => {
    const id = result?.id ?? "";
    const createdTime = result?.created_time ?? "";
    const account = result?.properties["Bluesky"]?.formula?.string ?? "";

    return { id, createdTime, account };
  });
};

export const checkDuplicatedAccounts = async (pageIDs: string[]) => {
  for (const pageID of pageIDs) {
    await notion.pages.update({
      page_id: pageID,
      properties: {
        duplicated: {
          checkbox: true,
        },
      },
    });
    await new Promise((r) => setTimeout(r, 500));
  }

  return;
};
