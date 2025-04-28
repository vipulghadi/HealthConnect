import { GoogleGenerativeAI } from "@google/generative-ai";

// Corrected JSON extractor
function extractJSON(text) {
  try {
    if (text.startsWith("`")) {
      console.log("Extracting JSON from code block...");
      let start = text.indexOf("{");
      let end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        let jsonText = text.substring(start, end + 1);
        return JSON.parse(jsonText); // Parse into object
      }
    } else if (text.startsWith("{") && text.endsWith("}")) {
      console.log("Extracting JSON from plain text...");
      return JSON.parse(text); // Directly parse
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
  return null; // Return null if parsing fails
}

export default async function GeminiAPIResponse(age, bhatiyaTestResponse) {
  try {
    const apiKey = 'AIzaSyAqlFGIFRGLOfGzi72FARHOM_FXWO1rKKs'
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use a valid model

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    console.log("Calling Gemini API...");

    // Build your prompt properly
    const prompt = `
You are an IQ Test Evaluator.
Given the user's age and their Bhatiya Test responses, 
analyze and return their estimated IQ as a **JSON** object.
Strictly respond only in JSON format like: 
{
  "iq": <number>
}

Here is the data:
Age: ${age}
Bhatiya Test Responses: ${bhatiyaTestResponse}
`;

    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();
    const extractedJSON = extractJSON(responseText);

    if (!extractedJSON) {
      throw new Error("Failed to extract valid JSON from response.");
    }

    return extractedJSON;
  } catch (error) {
    console.error("Error during Gemini API call:", error);
    throw new Error("An error occurred while generating the IQ response.");
  }
}