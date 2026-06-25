from langgraph.graph import StateGraph
from langgraph.graph import START, END

from langgraph.prebuilt import ToolNode
from langgraph.prebuilt import tools_condition

from Agent.state import AgentState
from Agent.Nodes import create_agent_node


def build_graph(tools):

    graph_builder = StateGraph(AgentState)

    tool_node = ToolNode(tools)

    graph_builder.add_node(
        "agent",
        create_agent_node(tools)
    )

    graph_builder.add_node(
        "tools",
        tool_node
    )

    #Edges
    graph_builder.add_edge(
        START,
        "agent"
    )

    graph_builder.add_conditional_edges(
        "agent",
        tools_condition
    )

    graph_builder.add_edge(
        "tools",
        "agent"
    )

    graph_builder.add_edge(
        "agent",
        END
    )

    return graph_builder.compile()