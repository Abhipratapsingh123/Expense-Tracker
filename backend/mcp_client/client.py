from langchain_mcp_adapters.client import MultiServerMCPClient


async def get_tools():

    client = MultiServerMCPClient(
        {
            "expense_tracker": {
                "url": "http://localhost:8000/mcp",
                "transport": "streamable_http"
            }
        }
    )

    tools = await client.get_tools()

    return tools