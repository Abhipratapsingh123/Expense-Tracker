from contextlib import asynccontextmanager
import uuid
from langchain_core.messages import HumanMessage, AIMessage


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from mcp_client.client import get_tools
from Agent.graph import build_graph

from App.schemas import ChatRequest

graph = None


@asynccontextmanager
async def lifespan(app: FastAPI):

    global graph

    print("Loading MCP tools...")

    tools = await get_tools()

    graph = build_graph(tools)

    print("LangGraph Ready")

    yield


app = FastAPI(lifespan=lifespan) 


# React -> FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return {
        "message": "Expense Tracker Backend Running"
    }


@app.post("/new-chat")
async def new_chat():

    return {
        "thread_id": str(uuid.uuid4())
    }


@app.post("/chat")
async def chat(request: ChatRequest):

    result = await graph.ainvoke(

        {
            "messages": [
                HumanMessage(content=request.message)
            ],
            "user_id": request.user_id
        },

        config={
            "configurable": {
                "thread_id": request.thread_id
            }
        }

    )

    return {
        "thread_id": request.thread_id,
        "response": result["messages"][-1].content
    }


@app.get("/history/{thread_id}")
async def get_history(thread_id: str):

    state = await graph.aget_state(
        config={
            "configurable": {
                "thread_id": thread_id
            }
        }
    )

    if not state.values:
        return {"messages": []}

    messages = []

    for msg in state.values["messages"]:

        if isinstance(msg, HumanMessage):
            role = "user"
        elif isinstance(msg, AIMessage):
            role = "assistant"
        else:
            continue

        messages.append(
            {
                "role": role,
                "content": msg.content
            }
        )

    return {"messages": messages}


