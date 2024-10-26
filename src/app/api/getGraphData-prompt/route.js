import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json(); // Input message data

    // Python backend endpoint URL
    const pythonEndpointUrl = 'https://your-python-api-endpoint-url'; // Replace with actual Python endpoint URL.

    // Send POST request to the Python endpoint
    const response = await fetch(pythonEndpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }), // Send message in JSON format
    });

    if (!response.ok) {
      throw new Error(`Error fetching data from Python endpoint: ${response.statusText}`);
    }

    // Directly read the JSON response
    const data = await response.json();

    // Return JSON data to the frontend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in getGraphData-prompt API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
