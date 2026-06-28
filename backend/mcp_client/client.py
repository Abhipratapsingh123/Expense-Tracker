import os

from dotenv import load_dotenv
from langchain_mcp_adapters.client import MultiServerMCPClient

load_dotenv()


async def get_tools():

    client = MultiServerMCPClient(
        {
            "expense_tracker": {
                "url": os.getenv("MCP_SERVER_URL"),
                "transport": "streamable_http",
            }
        }
    )

    return await client.get_tools()