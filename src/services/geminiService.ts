console.log('[GeminiService] Module loaded');
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import mime from "mime-types";

interface GenerationRequest {
  clothingImageUrl: string;
  modelGender: string;
  background: string;
}

interface GenerationResponse {
  images: string[];
}

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: ["image", "text"],
  responseMimeType: "text/plain",
};

export async function generateImage(request: GenerationRequest): Promise<GenerationResponse> {
  console.log('[GeminiService] User initiated image generation');
  console.log('• Clothing image URL:', request.clothingImageUrl);
  console.log('• Model gender:', request.modelGender);
  console.log('• Background:', request.background);
    
    try {
      console.log('• Starting Gemini API session...');
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
      console.log('✓ Gemini session initialized');

      // Fetch images and prepare for Gemini
      const fetchImage = async (url: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return blob;
      };

      const clothingImage = await fetchImage(request.clothingImageUrl);

      const prompt = `Generate a fashion model image wearing the cloth:
      - The clothing from the image
      - A ${request.modelGender} model
      - Background: ${request.background}`;

      // Convert blob to base64 (browser compatible)
      const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result?.toString().split(',')[1] || '';
            resolve(base64data);
          };
          reader.readAsDataURL(blob);
        });
      };

      // Prepare image part for Gemini (just clothing)
      const imageParts = [{
        inlineData: {
          mimeType: clothingImage.type,
          data: await blobToBase64(clothingImage)
        }
      }];
    
    console.log('--- FULL PROMPT TO GEMINI ---');
    console.log(prompt);
    console.log('--- END PROMPT ---');
    
    console.log('• Calling Gemini API with prompt:', prompt);
    const processApiResponse = (result: {response: any}) => {
      const apiResponseTime = Date.now() - apiStartTime;
      console.log(`✓ Gemini API responded in ${apiResponseTime}ms`);
      if (apiResponseTime > 3000) {
        console.warn('⚠ API response took longer than 3 seconds');
      }
      
      console.log('• Processing API response:', {
        candidates: result.response.candidates?.length,
        text: result.response.text()
      });
      
      const outputImages: string[] = [];
      const candidates = result.response.candidates;
      
      console.debug('[GeminiService] Processing candidates:', candidates?.length);
      if (!candidates || !Array.isArray(candidates)) {
        throw new Error('Invalid response: candidates array missing');
      }

      for (let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
        if (!candidates[candidate_index]?.content?.parts) continue;
        
        for (let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
          const part = candidates[candidate_index].content.parts[part_index];
          if (!part?.inlineData?.data) continue;
          if (part.inlineData) {
            try {
              const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              outputImages.push(imageUrl);
              console.log(`✓ Generated image ${candidate_index}-${part_index}`);
            } catch (err) {
              console.error('[GeminiService] Failed to save image:', err);
              throw err;
            }
          }
        }
      }

      console.debug('[GeminiService] Generation completed. Output images:', outputImages);
      return {
        images: outputImages,
      };
    };

    const apiStartTime = Date.now();
    const timeout = 10000; // 10 seconds timeout
    let retries = 2;
    let lastError;
    
    while (retries > 0) {
      try {
        const result = await Promise.race<{response: any}>([
          chatSession.sendMessage([prompt, ...imageParts]),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('API timeout')), timeout)
          )
        ]);
        return processApiResponse(result);
      } catch (error) {
        lastError = error;
        retries--;
        console.warn(`⚠ API attempt failed (${retries} retries left):`, error);
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
        }
      }
    }
    console.error('❌ All Gemini API attempts failed');
    throw lastError;
  } catch (error) {
    console.error('[GeminiService] Error during image generation:', error);
    throw error;
  }
}
