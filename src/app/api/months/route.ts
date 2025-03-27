import { NextRequest, NextResponse } from 'next/server';
import { addMonths, format, parse, startOfMonth } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lon = searchParams.get('lon');
  const lat = searchParams.get('lat');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  // Validate required parameters
  if (!lon || !lat || !from || !to) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  // Validate date format
  const dateFormat = 'yyyy-MM';
  try {
    parse(from, dateFormat, new Date());
    parse(to, dateFormat, new Date());
  } catch {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM' },
      { status: 400 }
    );
  }

  // Generate month starts
  const monthStarts: string[] = [];
  let currentDate = parse(from, dateFormat, new Date());

  while (format(currentDate, dateFormat) <= to) {
    // Get the start of the month in local time
    const monthStart = startOfMonth(currentDate);
    // Convert to UTC ISO string
    monthStarts.push(monthStart.toISOString());
    // Move to next month
    currentDate = addMonths(currentDate, 1);
  }

  return NextResponse.json({ monthStarts });
}
