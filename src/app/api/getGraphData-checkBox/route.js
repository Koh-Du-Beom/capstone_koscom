import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { selectedStocks, selectedIndicators } = await request.json();

    // Python endpoint URL
    const pythonEndpointUrl = 'https://your-python-api-endpoint-url'; // Replace with actual Python endpoint URL.

    // Send POST request to Python endpoint
    const response = await fetch(pythonEndpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedStocks, selectedIndicators }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching data from Python endpoint: ${response.statusText}`);
    }

    // Parse the JSON response directly
    const data = await response.json();

    // Return parsed JSON data to the frontend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in getGraphData API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
