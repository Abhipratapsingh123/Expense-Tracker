from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import MemorySaver

from Agent.state import AgentState
from Agent.Nodes import create_agent_node


def build_graph(tools):

    memory = MemorySaver()

    builder = StateGraph(AgentState)

    builder.add_node(
        "agent",
        create_agent_node(tools)
    )

    builder.add_node(
        "tools",
        ToolNode(tools)
    )

    builder.add_edge(
        START,
        "agent"
    )

    builder.add_conditional_edges(
        "agent",
        tools_condition
    )

    builder.add_edge(
        "tools",
        "agent"
    )

    builder.add_edge(
        "agent",
        END
    )

    return builder.compile(
        checkpointer=memory
    )