import { loadPrompt } from "./promptLoader";
import { PromptTemplate } from "@langchain/core/prompts";
// import { PromptTemplate } from "langchain/prompts";

// Pain-Solution Prompt Template Builder
export async function buildPainSolutionPromptTemplate(inputVars: string[]) {
  // const base = await loadPrompt("educational/basePrompt.txt");
  // const problemawareness = await loadPrompt("/problem-awareness-post/base.txt");
  const painSolutionPost = await loadPrompt("/pain-solution-post/base.txt");
  // const painCategories = await loadPrompt("/categories/painCategories.txt");
  const template = `${painSolutionPost} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;

  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

//Pain categories prompt builder
export async function buildPainCategoriesPromptTemplate(inputVars: string[]) {
  const categoriesPrompt = await loadPrompt("/categories/painCategories.txt");
  const template = `${categoriesPrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;

  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });

}
export async function buildCategoriesPromptTemplate(inputVars: string[]) {
  const categoriesPrompt = await loadPrompt("/categories/categories.txt");
  const template = `${categoriesPrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;

  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });

}
export async function buildQuestionTypesPromptTemplate(inputVars: string[]) {
  const questionTypesPrompt = await loadPrompt("/questions-post/questionTypes.txt");
  const template = `${questionTypesPrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;

  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });

}

//SaaS Profile Prompt Template Builder
export async function buildSaasProfilePromptTemplate(inputVars: string[]) {
  const saasProfilePrompt = await loadPrompt("/saasProfile/base.txt");
  const template = `${saasProfilePrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;

  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });

}


//Subtopics Prompt Template Builder
export async function buildSubtopicsPromptTemplate(inputVars: string[]) {
  const subtopicsPrompt = await loadPrompt("/categories/subtopics.txt");
  const template = `${subtopicsPrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}


//build post skeleton prompt template
export async function buildSubtopicPostSkeletonPromptTemplate(inputVars: string[]) {
  const postSkeletonPrompt = await loadPrompt("/educational-post/post_skeleton.txt"); 
  const template = `${postSkeletonPrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

//build subtopic(educational) post prompt template
export async function buildSubtopicToneTemplate(inputVars: string[]) {
  const subtopicPostPrompt = await loadPrompt("/educational-post/tone.txt");
  const template = `${subtopicPostPrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}

//build subtopic rewrite post prompt template
export async function buildSubtopicPostRewriteTemplate(inputVars: string[]) {
  const postRewritePrompt = await loadPrompt("/educational-post/post_rewrite.txt");  
  const template = `${postRewritePrompt} \nFORMAT INSTRUCTIONS:\n{format_instructions}\n\nGenerate JSON now.`;
  return new PromptTemplate({
    template,
    inputVariables: inputVars.concat("format_instructions"),
  });
}