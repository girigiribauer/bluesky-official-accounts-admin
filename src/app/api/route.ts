import { type NextRequest } from "next/server";
import {
  checkDuplicatedAccounts,
  fetchDuplicateAccounts,
} from "../../../src/lib/fetchNotion";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const account = searchParams.get("check");
  if (!account) {
    return new Response("検索対象のアカウントが見つかりませんでした");
  }

  const result = await fetchDuplicateAccounts(account);

  if (result.length == 1) {
    return new Response(`${account} に重複はありませんでした`);
  }

  await checkDuplicatedAccounts(result.map((a) => a.id));
  return new Response(
    `${account} の検索結果（Notion側にチェックが付きます）\n\n${JSON.stringify(
      result,
      null,
      "  "
    )}`
  );
}
