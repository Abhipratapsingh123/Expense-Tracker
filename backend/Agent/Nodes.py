from langchain_core.messages import SystemMessage
# from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from Agent.prompt import SYSTEM_PROMPT

load_dotenv() 



llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
)


def create_agent_node(tools):

    llm_with_tools = llm.bind_tools(tools)

    async def agent_node(state):

        messages = state["messages"]

        response = await llm_with_tools.ainvoke(
            [SystemMessage(content=SYSTEM_PROMPT)]
            + messages
        )

        return {
            "messages": [response]
        }

    return agent_node