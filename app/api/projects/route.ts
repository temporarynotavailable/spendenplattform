import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newProject = await prisma.project.create({
    data: {
      title: body.title,
      description: body.description,
      image: body.image,
      goal: Number(body.goal),
      raised: 0,
      daysLeft: Number(body.daysLeft),
    },
  });
  return NextResponse.json(newProject);
}