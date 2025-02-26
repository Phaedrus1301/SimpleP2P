import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import db from "../../../lib/db";
import jwt from "jsonwebtoken"

export async function POST(req: NextApiRequest) {
  
  const { name, email, mobile } = req.body;

  if(!name || !email || !mobile) {
    return NextResponse.json({ message: "Name, email or mobile is required!"});
  }

  try {
    let user: any = null;

    if(email) {
      user = await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    } else if(mobile) {
      user = await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE mobile = ? LIMIT 1`, [mobile], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }

    if(user) {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile
        },
        'NotLegitButIneedthisToRun',
        { expiresIn: '1h' }
      );
      return NextResponse.json({ message: "user authenticated", user, token });
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
    return NextResponse.json({ message: "user authenticated", newUser, token });

  } catch (err) {
    console.error(err);
  }
}
