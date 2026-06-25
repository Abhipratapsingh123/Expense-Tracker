from contextlib import asynccontextmanager

from fastapi import FastAPI

from langchain_core.messages import HumanMessage

from mcp_client.client import get_tools
from Agent.graph import build_graph


graph = None


@asynccontextmanager
async def lifespan(app: FastAPI):

    global graph

    tools = await get_tools()

    graph = build_graph(tools)

    yield


app = FastAPI(
    lifespan=lifespan
)

@app.get("/")
async def home():
    return {
        "message": "Expense Tracker Backend Running"
    }



@app.post("/chat")
async def chat(message: str):

    result = await graph.ainvoke(
        {
            "messages": [
                HumanMessage(content=message)
            ]
        }
    )

    return {
        "response": result["messages"][-1].content
    }