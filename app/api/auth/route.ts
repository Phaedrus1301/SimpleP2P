import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db";
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  
  const { name, email, mobile } = await req.json();

  if(!name || !email || !mobile) {
    return NextResponse.json({ message: "Name, email or mobile is required!"});
  }

  try {
    let existingUser: any = null;

    if(email) {
      existingUser = await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    } else if(mobile) {
      existingUser = await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE mobile = ? LIMIT 1`, [mobile], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }

    if(existingUser) {
      const token = jwt.sign(
        {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          mobile: existingUser.mobile
        },
        'NotLegitButIneedthisToRun',
        { expiresIn: '1h' }
      );
      return NextResponse.json({ message: "user authenticated", existingUser: { id: existingUser.id, name: existingUser.name, email: existingUser.email, mobile: existingUser.mobile }, token });
    }

    const newUser: any = await new Promise((resolve, reject) => {
      const register = db.prepare(`INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)`);
      register.run(name, email, mobile, function(this: any, err: Error) {
        if(err) reject(err);
        else resolve({ id: this.lastID, name, email, mobile});
      });
    });

    const token = jwt.sign(
      {
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile
      },
      'NotLegitButIneedthisToRun',
      { expiresIn: '1h' }
    );
    return NextResponse.json({ message: "user authenticated", newUser: { id: newUser.id, name: newUser.name, email: newUser.email, mobile: newUser.mobile }, token });

  } catch (err) {
    console.error(err);
  }
}
