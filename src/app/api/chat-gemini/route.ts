import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const prompt = `
      You are an AI assistant specialized in CRM data analysis and customer insights. You have access to customer and order data from a CRM platform.
      ## Context:
     You are working with CRM data that includes customer information, order history, transactions, and related business metrics. The data is provided in JSON format but presented as a string.
  
      ## Data Structure:
    The following CRM data contains customer records and their associated orders:
    \`\`\`json
    ${description || "No CRM data provided"}
    \`\`\`
  
     ## User Query:
     ${message}
    ## Instructions:
    1. **Data Analysis**: Carefully parse and analyze the provided CRM data
    2. **Pattern Recognition**: Identify trends, patterns, and insights within the customer and order data
    3. **Contextual Response**: Address the user's specific question or request based on the data
    4. **Actionable Insights**: Provide practical recommendations when applicable
    5. **Data Validation**: Flag any data inconsistencies or missing information if relevant
    ## Response Format:
    Please provide your response with:
    - **Summary**: Brief overview of findings
    - **Key Insights**: Main data points and patterns identified
    - **Recommendations**: Actionable suggestions based on the analysis
    - **Data Notes**: Any observations about data quality or limitations
     ## Expected Output:
    Deliver a comprehensive, data-driven response that directly addresses the user's query while leveraging the CRM data effectively. If the query involves technical issues or code problems, provide specific solutions and debugging suggestions.
  
   Focus on being precise, analytical, and helpful in your response .
   GIVE THE RESPONCE IN THE simple FORMAT and  plain  dont bold anyting up dont use * and all AND KEEP IT SIMPLE, short precise and crisp`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    return NextResponse.json({
      response: generatedText,
      description,
      message
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
