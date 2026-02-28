const { GoogleGenAI } = require("@google/genai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// @desc       Generate interview questions and answers using Gemini
// @route      POST /api/ai/generate-questions
// @access     Private
const generateInterviewQuestions = async (req, res) => {
   try {
      const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

      if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
         return res.status(400).json({ message: "Missing required fields."});
      }

      const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

      const response = await ai.models.generateContent({
         model: "gemini-2.5-flash-lite",
         contents: prompt,
      });

      // Safety Check
      if (!response || !response.text) {
         throw new Error("Empty AI response")
      }

      let rawText = response.text.trim();

      // Remove code fences if present 
      rawText = rawText
       .replace(/```json/i, "")
       .replace(/```/g, "")
       .trim();

      // Extract JSON only (imp.)
      const jsonStart = rawText.indexOf("[");
      const jsonEnd = rawText.lastIndexOf("]");

      if (jsonStart === -1 || jsonEnd === -1) {
         throw new Error("AI response is not valid JSON");
      }

      const jsonString = rawText.slice(jsonStart, jsonEnd + 1);
       
      // Now safe to parse.
      const data = JSON.parse(jsonString);
      
      // Final validation
      if (!Array.isArray(data)) {
         throw new Error("Expected an array of questions");
      }

      res.status(200).json({
         success: true,
         questions: data,
      });
   } catch (error) {
      console.error("AI Error:", error.message);

      res.status(500).json({
         message: "Failed to generate questions",
         error: error.message,
      });
   }
};

// @desc        Generate explains a interview question
// @route       POST /api/ai/generate-explanation
// @access      Private
const generateConceptExplanation = async (req, res) => {
   try {
      const { question } = req.body;

      if (!question) {
         return res.status(400).json({ message: "Missing required fields." });
      }

      const prompt = conceptExplainPrompt(question);

      const response = await ai.models.generateContent({
         model: "gemini-2.5-flash-lite",
         contents: prompt,
      });

      let rawText = response.text;

      // Clean it: Remove ```JSON and ``` from beginning and end
      const cleanedText = rawText
       .replace(/^```json\s*/, "")   // remove starting ```json
       .replace(/```$/, "")         //  remove ending ```json
       .trim();                    //   remove extra space
       
       // Now safe to parse
       const data = JSON.parse(cleanedText);

      res.status(200).json({
         success: true,
         questions: data,
      });
   } catch (error) {
      console.error("AI Error:", error.message);

      res.status(500).json({
         message: "Failed to generate questions.",
         error: error.message,
      });
   }
};


module.exports =  { generateInterviewQuestions, generateConceptExplanation };