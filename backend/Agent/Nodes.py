from langchain_core.messages import SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from Agent.prompt import SYSTEM_PROMPT

load_dotenv() 


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash"
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