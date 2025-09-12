export const getAIResponse = async (prompt: string): Promise<string> => {
  try {
    // This tells the app to call our own secure function
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
};