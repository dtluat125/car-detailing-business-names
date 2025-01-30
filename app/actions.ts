/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import OpenAI from "openai";
import { z } from "zod";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI(configuration);

// Define TypeScript & Validation Schemas
const MetaDataSchema = z.object({
  title: z.string().min(10, "Title too short"),
  description: z.string().min(50, "Description too short"),
});

const FAQSchema = z.array(
  z.object({
    question: z.string(),
    answer: z.string(),
  })
);

const Categories = [
  "Luxury Car Detailing",
  "Eco-Friendly Car Cleaning",
  "Mobile Car Wash",
  "Classic & Vintage Car Detailing",
  "Fast & Express Auto Spa",
] as const;

export type BusinessCategory = (typeof Categories)[number];

// Define response schema for validation
const BusinessNameSchema = z.object({
  name: z.string().min(3),
  tagline: z.string().min(5),
  description: z.string().min(10),
  bestFor: z.array(z.string()),
});

// Schema for structured business names by category
const BusinessNamesSchema = z.record(
  z.enum(Categories),
  z.array(BusinessNameSchema)
);

// Generic AI Fetcher with Fallbacks
async function fetchAIContent(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    });

    return response?.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("OpenAI Error:", error);
    return "";
  }
}

// AI-Powered Metadata Generation (Next.js Metadata API)
export const generateMetaData = async (): Promise<{
  title: string;
  description: string;
}> => {
  const rawResponse = await fetchAIContent(`
      You are an expert in SEO and high-converting copywriting. 
      Generate a compelling and optimized meta title and meta description for a web page about car detailing business name ideas.

      **Meta Title Requirements:**
      - Must be under 60 characters.
      - Use strong keywords such as "Best Car Detailing Business Names," "Creative Car Wash Name Ideas," or "Unique Auto Spa Branding."
      - Evoke curiosity or a sense of exclusivity.
      - Avoid generic words like "Welcome" or "Homepage."
      - Examples: "Best Car Detailing Business Names | Get Inspired" or "Luxury & Mobile Car Wash Name Ideas."

      **Meta Description Requirements:**
      - Must be under 160 characters.
      - Provide a concise and engaging summary of the page.
      - Include keywords like "Luxury Car Detailing," "Mobile Car Wash," "Eco-Friendly Auto Spa," "Business Name Generator."
      - Inspire action: "Discover creative car detailing business names and branding ideas. Get unique, catchy, and memorable names for your car wash or detailing service."

      **Output Format:**
      Title: <Your generated title here>
      Description: <Your generated meta description here>

      **Important Notes:**
      - Do not include explanations, introductions, or extra text.
      - Ensure the result is formatted exactly as required.
      - Do not use placeholders like "<insert title here>"—provide final, polished content.
    `);

  const titleMatch = rawResponse.match(/Title: (.+)/)?.[1];
  const descriptionMatch = rawResponse.match(/Description: (.+)/)?.[1];

  const metadata = {
    title: titleMatch || "Best Car Detailing Business Name Ideas | Zarla",
    description:
      descriptionMatch ||
      "Explore AI-generated business name ideas for car detailing services. Get unique names for luxury, eco-friendly, mobile, and vintage car detailing companies.",
  };

  return MetaDataSchema.parse(metadata);
};

// AI-Powered Business Name Generation (Manual Extraction)
// Generate Business Names with Context, Taglines, and Best Fit Category
export const generateBusinessNames = async (): Promise<
  Record<
    BusinessCategory,
    {
      name: string;
      tagline: string;
      description: string;
      bestFor: string[];
    }[]
  >
> => {
  const fallbackResponse = `
 Luxury Car Detailing:  
Name: Pinnacle Shine  
Tagline: "Elevate Your Elegance."  
Description: Experience top-tier detailing services that enhance and protect your luxurious investment.  
Best For: Luxury Car Owners, Car Collectors  

Name: Regal Reflections  
Tagline: "Where Luxury Meets Perfection."  
Description: Transform your high-end vehicle with meticulous care and exclusive detailing solutions.  
Best For: Luxury Car Owners, Car Enthusiasts  

Name: Opulent Shine  
Tagline: "Detailing Beyond Compare."  
Description: Providing premium detailing services that ensure your luxury vehicle gleams inside and out.  
Best For: Luxury Car Owners, Executive Cars  

Name: Elite Detail Masters  
Tagline: "Craftsmanship in Every Stroke."  
Description: Our expert team brings unparalleled detailing skills to your prized luxury cars.  
Best For: Luxury Car Owners, Show Car Detailing  

Name: Supreme Luxe Detailing  
Tagline: "The Art of Automotive Luxury."  
Description: Dedicated to delivering high-caliber detailing for your top-tier automobiles.  
Best For: Luxury Car Owners, Car Collectors  

Eco-Friendly Car Cleaning:  
Name: Green Clean Auto  
Tagline: "Drive Clean, Live Green."  
Description: Eco-conscious car cleaning using sustainable products for a brighter, greener future.  
Best For: Environmentally-Conscious Drivers, Families  

Name: EcoShine Car Care  
Tagline: "A Cleaner World, One Car at a Time."  
Description: Committed to providing thorough car cleaning with minimal environmental impact.  
Best For: Eco-Friendly Consumers, Family Vehicles  

Name: Pure Planet Detailing  
Tagline: "Detailing Without Compromise."  
Description: Utilizing biodegradable products to refresh your vehicle while protecting the planet.  
Best For: Eco-Friendly Consumers, Green Enthusiasts  

Name: Nature's Touch Car Wash  
Tagline: "Sustainable Shine."  
Description: Harnessing the power of nature to achieve sparkling clean cars with eco-friendly methods.  
Best For: Environmentally-Conscious Drivers, Urban Commuters  

Name: EcoSmart Auto Clean  
Tagline: "Smart Caring for Your Car."  
Description: Combining technology with eco-friendly practices for a modern approach to car cleaning.  
Best For: Environmentally-Conscious Drivers, Technology Enthusiasts  

Mobile Car Wash:  
Name: On-Demand Shine  
Tagline: "We Come to You!"  
Description: Bringing the car wash experience directly to your doorstep for ultimate convenience.  
Best For: Busy Professionals, Families  

Name: Mobile Detail Express  
Tagline: "Detailing Anyplace, Anytime."  
Description: Fast and efficient mobile car wash services designed to fit your busy lifestyle.  
Best For: Busy Professionals, Parents  

Name: Car Wash Anywhere  
Tagline: "Quality Care on the Go."  
Description: Expert mobile car wash and detailing services that arrive wherever you are.  
Best For: Busy Professionals, Urban Dwellers  

Name: The Car Spa Mobile  
Tagline: "Luxury Service at Your Convenience."  
Description: Treat your vehicle to a spa day with our mobile detailing and washing services.  
Best For: Luxury Vehicle Owners, Families  

Name: Roadside Reflections  
Tagline: "Your Car’s Best Friend on the Move."  
Description: Wherever you are, enjoy top-quality car cleaning with our convenient mobile service.  
Best For: Commuters, Busy Professionals  

Classic & Vintage Car Detailing:  
Name: Timeless Detailers  
Tagline: "Preserving History, One Car at a Time."  
Description: Specialized detailing and restoration services for classic and vintage automobiles.  
Best For: Classic Car Enthusiasts, Collectors  

Name: Retro Shine Restoration  
Tagline: "Revive Your Classic."  
Description: Dedicated to breathing new life into vintage vehicles with expert detailing.  
Best For: Classic Car Owners, Vintage Car Collectors  

Name: Heritage Detail Service  
Tagline: "Cherishing the Classics."  
Description: Exceptional care and detailing services crafted specifically for timeless vehicles.  
Best For: Classic Car Enthusiasts, Show Car Owners  

Name: Vintage Vehicle Varnish  
Tagline: "Bring Back the Glory."  
Description: Expert detailing services focused on preserving the beauty of vintage cars.  
Best For: Classic Car Owners, Collectors  

Name: Nostalgic Shine Detailing  
Tagline: "Revitalize Your Automotive Heritage."  
Description: Passionate about restoring and detailing classic cars to their former splendor.  
Best For: Classic Car Enthusiasts, Collectors  

Fast & Express Auto Spa:  
Name: Speedy Shine Spa  
Tagline: "Fast, Fabulous, Flawless."  
Description: Quick auto spa services that don’t compromise on quality or care for your vehicle.  
Best For: Busy Professionals, Families  

Name: Express Auto Detailing  
Tagline: "Quality Service in Record Time!"  
Description: Rapid, high-quality detailing services tailored for your fast-paced lifestyle.  
Best For: Busy Urbanites, Fleet Services  

Name: Fast Track Car Care  
Tagline: "Fast Cleaning, Total Satisfaction."  
Description: Quick and efficient service without sacrificing the excellence your car deserves.  
Best For: Busy Professionals, Car Enthusiasts  

Name: Turbo Clean Auto Spa  
Tagline: "Speed Meets Sparkle!"  
Description: Delivering exceptional car care and detailing in half the time, guaranteed.  
Best For: Time-Conscious Drivers, Families  

Name: Rapid Reflections  
Tagline: "Detailing Done Right, Faster."  
Description: Your go-to express auto spa for fast, reliable car detailing services.  
Best For: Busy Commuters, Families
    `;

  const rawResponse =
    (await fetchAIContent(`
      You are a branding and marketing expert specializing in car detailing businesses. 
      Generate **five** unique, high-quality business name ideas per category below. 
      Each business name should be **brandable, memorable, and optimized for SEO**.

      **Guidelines for Each Entry:**
      - **Name:** Must be catchy, unique, and resonate with the category.
      - **Tagline:** Should be short, compelling, and evoke trust or quality.
      - **Description:** A one-liner explaining the business concept in an engaging way.
      - **Best For:** A comma-separated list of the most relevant audiences.

      **Category List:**
      - Luxury Car Detailing
      - Eco-Friendly Car Cleaning
      - Mobile Car Wash
      - Classic & Vintage Car Detailing
      - Fast & Express Auto Spa

      **Output Format (Strictly Follow This):**
      <Category Name>:
      Name: <Business Name 1>
      Tagline: <Tagline>
      Description: <Short Business Description>
      Best For: <Comma-separated target audience>

      Name: <Business Name 2>
      Tagline: <Tagline>
      Description: <Short Business Description>
      Best For: <Comma-separated target audience>

      (Repeat for 5 names per category)

      **Important Notes:**
      - Do not add extra explanations, bullet points, or separators.
      - Do not include generic or low-effort names like "Best Car Detailing."
      - Taglines should be unique and aligned with the business value.
      - Ensure each business name is **distinct** and does not repeat across categories.

      `)) || fallbackResponse;

  // Ensure AI response is clean
  const cleanedResponse = rawResponse
    .trim()
    .replace(/\r/g, "") // Remove carriage returns for consistency
    .replace(/\n{3,}/g, "\n"); // Remove excessive newlines

  console.log("🔍 Cleaned AI Response:\n", cleanedResponse);

  const extractedNames: Record<
    BusinessCategory,
    {
      name: string;
      tagline: string;
      description: string;
      bestFor: string[];
    }[]
  > = {} as any;

  // ✅ Normalize line endings
  const normalizedResponse = cleanedResponse
    .replace(/\r\n/g, "\n")
    .replace(/ +:/g, ":");

  console.log("🔍 Normalized AI Response:\n", normalizedResponse);

  // ✅ Debug: Print all detected categories
  console.log(
    "🔍 Categories in Response:",
    normalizedResponse.match(/^.+(?=:\n)/gm)
  );

  Categories.forEach((category) => {
    const normalizedCategory = category.trim();

    // ✅ Step 1: Extract full block of category data
    // TODO: Finish regex to extract category content
    const categoryMatch = normalizedResponse.match(
      new RegExp(
        `${normalizedCategory}:\\s*\\n((?:\\s*Name:.+\\n\\s*Tagline:.+\\n\\s*Description:.+\\n\\s*Best For:.+\\n?)+)`
      )
    );

    console.log(`🔍 Category Match for "${category}":`, categoryMatch);

    if (!categoryMatch || !categoryMatch[1]) {
      console.warn(`⚠️ No match found for category: ${category}`);
      extractedNames[category] = [
        {
          name: `${category} Pros`,
          tagline: "Shining your ride!",
          description: "Premium auto detailing services.",
          bestFor: [category],
        },
      ];
      return;
    }

    const categoryContent = categoryMatch[1].trim();
    console.log(`✅ Extracted AI Content for "${category}":`, categoryContent);

    // ✅ Step 2: Extract individual business name blocks
    const nameBlocks =
      categoryContent.match(
        /Name:\s*(.+)\n\s*Tagline:\s*(.+)\n\s*Description:\s*(.+)\n\s*Best For:\s*(.+)/g
      ) || [];

    console.log(`🔍 Extracted Business Entries for "${category}":`, nameBlocks);

    // ✅ Step 3: Convert extracted data into structured format
    extractedNames[category] = nameBlocks.map((block) => {
      const name =
        block.match(/Name:\s*(.+)/)?.[1]?.trim() || "Unnamed Business";
      const tagline =
        block.match(/Tagline:\s*(.+)/)?.[1]?.trim() || "Your car, your shine!";
      const description =
        block.match(/Description:\s*(.+)/)?.[1]?.trim() ||
        "A premium car detailing service.";
      const bestForRaw = block.match(/Best For:\s*(.+)/)?.[1];
      const bestFor = bestForRaw
        ? bestForRaw.split(",").map((x) => x.trim())
        : ["General Detailing"];

      return { name, tagline, description, bestFor };
    });

    console.log(
      `✅ Successfully Extracted ${extractedNames[category].length} Names for "${category}"`
    );
  });

  console.log("✅ Final Extracted Names:\n", extractedNames);

  // Validate structure & apply fallback values
  const validatedData = BusinessNamesSchema.safeParse(extractedNames);
  if (!validatedData.success) {
    console.error("❌ Validation Failed:", validatedData.error.format());
  }

  return validatedData.success
    ? (validatedData.data as unknown as Record<
        BusinessCategory,
        {
          name: string;
          tagline: string;
          description: string;
          bestFor: string[];
        }[]
      >)
    : Categories.reduce(
        (acc, cat) => ({
          ...acc,
          [cat]: [
            {
              name: `${cat} Pros`,
              tagline: "Shining your ride!",
              description: "Premium auto detailing services.",
              bestFor: [cat],
            },
          ],
        }),
        {} as Record<
          BusinessCategory,
          {
            name: string;
            tagline: string;
            description: string;
            bestFor: string[];
          }[]
        >
      );
};

// AI-Powered FAQ Generation (Manual Extraction)
export const generateFAQs = async (): Promise<
  { question: string; answer: string }[]
> => {
  const rawResponse = await fetchAIContent(`
      You are an expert in business branding and marketing. 
      Generate **three** frequently asked questions (FAQs) with clear and helpful answers about naming a car detailing business.

      **FAQ Guidelines:**
      - Questions should reflect what real business owners or startups might ask.
      - Answers must be **concise, authoritative, and SEO-friendly**.
      - Avoid generic, filler, or overly basic questions.

      **Examples of Good Questions:**
      - "How do I create a unique and brandable name for my car detailing business?"
      - "What words or themes work best for luxury, eco-friendly, or mobile car detailing brands?"
      - "How important is SEO in choosing a business name for a car wash or detailing service?"

      **Output Format (Strictly Follow This):**
      - Question: <Insert FAQ question here>
      - Answer: <Insert well-written FAQ answer here>

      - Question: <Insert FAQ question here>
      - Answer: <Insert well-written FAQ answer here>

      - Question: <Insert FAQ question here>
      - Answer: <Insert well-written FAQ answer here>

      **Important Notes:**
      - Do **not** include explanations, introductions, or additional text.
      - Keep answers under **3 sentences** and actionable.
      - Ensure questions **do not overlap** in topic.
    `);

  console.log("🔍 Raw AI Response:\n", rawResponse);

  const faqEntries = rawResponse.split("- Question: ").slice(1);
  const faqs = faqEntries.map((entry) => {
    const [question, answer] = entry.split("- Answer: ");
    return {
      question:
        question?.trim() ||
        "What is the best name for a car detailing business?",
      answer:
        answer?.trim() ||
        "It depends on your branding, but it should be memorable and unique.",
    };
  });

  const validatedData = FAQSchema.safeParse(faqs);
  return validatedData.success
    ? validatedData.data
    : [
        {
          question: "How to choose a good business name?",
          answer: "Pick something relevant, unique, and easy to remember.",
        },
      ];
};
