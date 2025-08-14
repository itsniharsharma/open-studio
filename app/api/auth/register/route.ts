import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest){
    try {
      const {email, password} = await request.json()
      if(!email || !password){
        return NextResponse.json(
            {error: "Email and password required"},
            {status: 400}
        );
      }

      await connectToDatabase()
      const existingUser = await User.findOne({email})
      if(existingUser){
         return NextResponse.json(
            {error: "User already registered"},
            {status: 400}
        );
      }


      await User.create({
        email,
        password
      })
      
       return NextResponse.json(
            {message: "User registered"},
            {status: 400}
        );

    } catch (error){
        console.log("Reg error", error)
        return NextResponse.json(
            {error: "Failed to register"},
            {status: 400}
        );
    }
}