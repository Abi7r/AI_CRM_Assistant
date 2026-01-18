const Employee = require("../models/Employee");
const { Groq } = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_KEY });

exports.queryWithAi = async (req, res) => {
  try {
    const { question } = req.body;
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a database query  assistant for employee data management. convert natural language into mongodb query objects.
       Available fields:name,department,salary,joinDate,performanceScore,email,position.
       Respond ONLY with valid JSON in this format:

       {"query":{...},"sort":{...},"limit":number}
       or for aggregation(average,sum,count):
       {"aggregate:"fieldName","operation":"avg","department":"optional"}

       Examples:
       -"Show all IT employees"->{"query":{"department":"IT"}}
       -"Top 3 performers" ->{"query":{},"sort":{"perfomanceScore":-1},"limit":3}
       -"Average salary in sales"->{"aggregate":"salary","operation":"avg","department":"Sales"}
       -"Show developers" -> {"query":{"position":{"$regex":"Developer",$options:"i"}}}
       
       Return only JSON object, no markdown,no explanation
       `,
        },
        {
          role: "user",
          content: question,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_completion_tokens: 1000,
      top_p: 0.9,
      stream: false,
    });
    console.log("Chat completion:", chatCompletion);
    let genText = chatCompletion.choices[0].message.content;
    console.log("Generated text:", genText);
    genText = genText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const genRes = JSON.parse(genText);
    console.log("Generated result:", genRes);
    let queryResult;

    if (genRes.aggregate) {
      const match = genRes.department ? { department: genRes.department } : {};
      let aggPipeLine = [{ $match: match }];
      if (genRes.operation == "avg") {
        aggPipeLine.push({
          $group: {
            _id: null,
            average: { $avg: `$${genRes.aggregate}` },
            count: { $sum: 1 },
          },
        });
        const aggResult = await Employee.aggregate(aggPipeLine);
        queryResult = aggResult[0] || { average: 0, count: 0 };
      }
    } else {
      let dbQuery = Employee.find(genRes.query) || {};
      if (genRes.sort) {
        dbQuery = dbQuery.sort(genRes.sort);
      }
      if (genRes.limit) {
        dbQuery = dbQuery.limit(genRes.limit);
      }
      queryResult = await dbQuery;
    }
    console.log("Query result:", queryResult);
    res.status(200).json({
      success: true,
      result: queryResult,
      mongoQuery: genRes,
    });
  } catch (error) {
    console.log("Error in AI query:", error);
    res.status(500).json({
      message: "Error processing query",
      error: error.message,
    });
  }
};

exports.simpleQuery = async (req, res) => {
  try {
    const { department, limit } = req.query;

    let query = {};
    if (department) {
      query.department = department;
    }

    const employees = await Employee.find(query).limit(parseInt(limit) || 10);

    res.status(200).json({ data: employees });
  } catch (error) {
    console.log("Error in simple query:", error);
    res.status(500).json({ message: "Server error" });
  }
};
