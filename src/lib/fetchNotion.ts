import "server-only";

import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const fetchDuplicateAccounts = async (account: string) => {
  const databaseId = process.env.DUPLICATE_DATABASE || "DEFAULT_DATABASE_ID";
  const notionResponse = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "account",
      rich_text: {
        equals: account,
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return notionResponse.results.map((result: any) => {
    const id = result?.id ?? "";
    const createdTime = result?.created_time ?? "";
    const account = result?.properties["account"]?.formula?.string ?? "";

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
  }

  return;
};
