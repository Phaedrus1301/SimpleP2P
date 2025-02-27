import db from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url: any = new URL(req.url!);
  const userId = url.searchParams.get('userId');

  let userList = await new Promise((resolve, reject) => {
    db.all(`SELECT * FROM users WHERE id != ?`, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  return NextResponse.json(Array.isArray(userList) ? userList : [userList]);
}

//amil@new new 2233
//email@new dev 3344
//three@email third 2233