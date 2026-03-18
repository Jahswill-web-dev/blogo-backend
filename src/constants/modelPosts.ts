export interface Post {
    id: number;
    postType?: string;
    content: string;
    tags?: string[];
}

export const posts: Post[] = [
    {
        id: 1,
        content: `Every successful founder I know has one thing in common:

                    They didn't stop.

                    Not smarter. Not luckier. Not better connected.

                    They just kept going while everyone else gave up.

                    That's it. That's the whole secret.`,
    },
    {
        id: 2,
        content: `How to write a blog post that ranks:

1. Find a long-tail keyword people are already searching for. Use Google autocomplete, AnswerThePublic, or "People Also Ask." Look for questions with clear intent — not vanity terms.

2. Study the top 3 results. Then figure out what they're missing.Don't copy their structure. Find the gaps — outdated info, missing examples, no real-world experience. That's your edge.

3. Answer the question immediately. Then go deeper than anyone else. No fluff intros. Give the answer in the first 2-3 sentences. Then back it up with steps, examples, screenshots, or data.

4. Add an FAQ section pulled from "People Also Ask." This isn't optional. It's free real estate for featured snippets.

5. Nail the on-page basics. Keyword in the title, one H1, clean H2s, alt text on images, meta description that makes people click.

6. Link to it from 3-5 existing pages on your site. Internal links tell Google "this page matters." No internal links = invisible.

7. Come back in 90 days. Update it. Add new info, refresh screenshots, improve sections that aren't ranking. Google rewards freshness.

One post like this per week won't outperform $1,000/mo in ads next month.

But in 6 months? You'll have 24 assets working for you around the clock, with zero ad spend.

The compounding is the point.`,
    },
    {
        id:3,
        content:`The SEO tactic that takes minutes but most people never do:  

Internal linking.

Every new blog post should link to 3-5 existing posts. 

Every existing post should link to your new one. 

Google follows links.  Give it a map.
`,
    },
    {
        id:4,
        content:`How to write a tweet that gets engagement:

Hook (first line): Make them stop scrolling.
→ Use a number, a hot take, or a question

Body: Deliver value fast.
→ Bullet points or short lines
→ One idea per line
→ No filler words

Ending: Give them a reason to interact.
→ Ask a question
→ "Bookmark this"
→ "What would you add?"

The secret nobody tells you: the first line does 80% of the work.`,
    },
    {
        id:5,
        content:`How I find blog topics that actually drive traffic:

1. Open Google Search Console
2. Go to Performance → Queries
3. Filter by position 8-20 (you're close to page 1 but not there yet)
4. Sort by impressions (high impressions = people are searching for this)
5. Write a better, deeper post targeting those exact queries
6. Internal link from your existing pages

You already have the data. Most people never check.`
    }

    // Add the rest of your 40 posts here
];
