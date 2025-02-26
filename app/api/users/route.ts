import { NextApiRequest } from "next";
import db from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const url: any = new URL(req.url!);
  const userId = url.searchParams.get('userId');

  let userList = await new Promise((resolve, reject) => {
    db.all(`SELECT * FROM users WHERE id != ?`, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  return NextResponse.json({ userList });
}

//amil@new new 2233