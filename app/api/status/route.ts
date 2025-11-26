import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for resurrection sessions
// In production, use Redis or a database
const sessions = new Map<string, any>();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    session,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, step, status, details } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    let session = sessions.get(sessionId);

    if (!session) {
      // Create new session
      session = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        steps: [],
        status: 'running',
      };
    }

    // Update session
    if (step) {
      const existingStepIndex = session.steps.findIndex((s: any) => s.id === step.id);
      
      if (existingStepIndex >= 0) {
        session.steps[existingStepIndex] = {
          ...session.steps[existingStepIndex],
          ...step,
          status,
          details,
          updatedAt: new Date().toISOString(),
        };
      } else {
        session.steps.push({
          ...step,
          status,
          details,
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (status) {
      session.status = status;
    }

    session.updatedAt = new Date().toISOString();

    sessions.set(sessionId, session);

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error: any) {
    console.error('Status update error:', error);

    return NextResponse.json(
      {
        error: 'Failed to update status',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
