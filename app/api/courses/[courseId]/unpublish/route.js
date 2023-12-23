import { db } from "@/services"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req, { params }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })

    if (!course) {
      return new NextResponse("Not found", { status: 404 })
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    })

    return NextResponse.json(unpublishedCourse)
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}