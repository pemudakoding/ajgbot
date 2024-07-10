import {
    GenerateContentResult,
    GenerativeModel,
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory
} from "@google/generative-ai";

export default class Gemini {
    protected gemini: GoogleGenerativeAI
    protected prompts: any[] | string
    protected model: GenerativeModel

    constructor(gemini: GoogleGenerativeAI) {
        this.gemini = gemini
    }

    public static make(): Gemini {
        return new Gemini(new GoogleGenerativeAI(process.env.GEMINI_API_KEY!))
    }

    public setModel(model: "gemini-pro-vision" | "gemini-pro" | "gemini-1.5-flash"): this {
        this.model = this
            .gemini
            .getGenerativeModel({
                model: model,
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                ],
            })

        return this
    }

    public setPrompts(prompts: any[] | string): this {
        this.prompts = prompts

        return this
    }

    public async generate(): Promise<GenerateContentResult> {
        return await this.model.generateContent(this.prompts)
    }
}