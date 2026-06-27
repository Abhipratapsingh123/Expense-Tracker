from langgraph.graph import StateGraph

from langgraph.graph import START, END

from langgraph.prebuilt import ToolNode

from langgraph.prebuilt import tools_condition

from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

from Agent.state import AgentState

from Agent.nodes import create_agent_node


def build_graph(tools):

    memory = AsyncSqliteSaver.from_conn_string(

        "langgraph.db"

    )

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