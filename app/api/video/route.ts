import { connectToDatabase } from "@/lib/db";
import Video, {IVideo} from "@/models/Video";
import {NextResponse, NextRequest} from "next/server";
import { authOptions } from "@/lib/auth";
import {getServerSession} from "next-auth";


export async function GET(){
    try{
      await connectToDatabase();
      const videos = await Video.find({}).sort({createdAt: -1}).lean()

      if(!videos || videos.length == 0){
        return NextResponse.json([], {status: 200})
      }

      return NextResponse.json(videos)
    } catch(error){
      NextResponse.json(
        {error: "failed to fetch videos"},
        {status: 500}
      )
    }
}

export async function POST(request: NextRequest){
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            NextResponse.json(
            {error: "Unauthorized"},
            {status: 401}
          );
        }

    await connectToDatabase()

    const body: IVideo = await request.json()
    if(
        !body.title ||
        !body.description ||
        !body.videoUrl ||
        !body.thumbnailUrl
    ) {
        return NextResponse.json(
            {error: "Missing required Data"},
            {status: 400}
        );
    }

    const videoData = {
        ...body,
        controles: body?.controls ?? true,
        transformation:{
            height: 1920,
            width: 1080,
            quality: body.transformation?.quality ?? 100 
        } ,
      };
      const newVideo = await Video.create(videoData)
    } catch(error){

    }
}