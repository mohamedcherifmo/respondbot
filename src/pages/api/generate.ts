// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: any,
  res: any
) {

  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }
  try {
    const outputText = await createCompletion(prompt);
    res.status(200).json({
      outputText
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: "Something went wrong",
      } 
    });
    return;
  }


  res.status(200).json({ name: 'John Doe' })
}



async function createCompletion(prompt: any) {
  let body = JSON.stringify({
    "model": "gpt-4",
    "messages": [
      {
        "role": "system",
        "content": "You are a twitter user. You are writing a tweet."
      },
      {
        "role": "user",
        "content": prompt
      }
    ]
  });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: body,
  });

  const data = await response.json();
  if (data?.choices && data?.choices.length > 0) {
    let outputText = data?.choices[0].message?.content;

    return outputText;


  }
  return ""
}
