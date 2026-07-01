from fastmcp import FastMCP
import os
import json
import traceback
import asyncio
import asyncpg
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(__file__)
CATEGORIES_PATH = os.path.join(BASE_DIR, "categories.json")

DATABASE_URL = os.getenv("DATABASE_URL")

mcp = FastMCP("ExpenseTracker")


async def init_db():
    """Create the expenses table if it does not exist."""

    conn = await asyncpg.connect(DATABASE_URL)

    try:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                date TEXT NOT NULL,
                amount NUMERIC(10,2) NOT NULL,
                category TEXT NOT NULL,
                subcategory TEXT DEFAULT '',
                note TEXT DEFAULT ''
            )
        """)

        print("Database initialized successfully")

    finally:
        await conn.close()


@mcp.tool()
async def add_expense(
    date: str,
    amount: float,
    category: str,
    subcategory: str = "",
    note: str = ""
):
    """
    Add a new expense to the expense tracker.
    Use the closest matching category from the available categories.
    Use subcategory for more specific details and note for any extra information.
    """

    try:

        conn = await asyncpg.connect(DATABASE_URL)

        try:

            row = await conn.fetchrow(
                """
                INSERT INTO expenses
                (date, amount, category, subcategory, note)
                VALUES ($1,$2,$3,$4,$5)
                RETURNING id
                """,
                date,
                amount,
                category,
                subcategory,
                note
            )

            print(f"Expense saved successfully. ID = {row['id']}")

            return {
                "status": "success",
                "id": row["id"],
                "message": "Expense added successfully"
            }

        finally:
            await conn.close()

    except Exception:
        traceback.print_exc()

        return {
            "status": "error",
            "message": "Failed to add expense."
        }


@mcp.tool()
async def list_expenses(
    start_date: str,
    end_date: str
):
    """
    Retrieve all expenses between the given start and end dates.
    Returns expense ID, date, amount, category, subcategory, and note.
    If database is empty, then say that no expenses exist.
    """

    try:

        conn = await asyncpg.connect(DATABASE_URL)

        try:

            rows = await conn.fetch(
                """
                SELECT
                    id,
                    date,
                    amount,
                    category,
                    subcategory,
                    note
                FROM expenses
                WHERE date BETWEEN $1 AND $2
                ORDER BY date DESC, id DESC
                """,
                start_date,
                end_date
            )

            return [dict(row) for row in rows]

        finally:
            await conn.close()

    except Exception:
        traceback.print_exc()

        return {
            "status": "error",
            "message": "Failed to list expenses."
        }


@mcp.tool()
async def summarize(
    start_date: str,
    end_date: str,
    category: str | None = None
):
    """
    Summarize expenses within a date range.
    Optionally filter by category to get total spending and expense count.
    If databsase is empty, then say that no expenses exist.
    """

    try:

        conn = await asyncpg.connect(DATABASE_URL)

        try:

            if category:

                rows = await conn.fetch(
                    """
                    SELECT
                        category,
                        SUM(amount) AS total_amount,
                        COUNT(*) AS count
                    FROM expenses
                    WHERE date BETWEEN $1 AND $2
                    AND category = $3
                    GROUP BY category
                    ORDER BY total_amount DESC
                    """,
                    start_date,
                    end_date,
                    category
                )

            else:

                rows = await conn.fetch(
                    """
                    SELECT
                        category,
                        SUM(amount) AS total_amount,
                        COUNT(*) AS count
                    FROM expenses
                    WHERE date BETWEEN $1 AND $2
                    GROUP BY category
                    ORDER BY total_amount DESC
                    """,
                    start_date,
                    end_date
                )

            return [dict(row) for row in rows]

        finally:
            await conn.close()

    except Exception:
        traceback.print_exc()

        return {
            "status": "error",
            "message": "Failed to summarize expenses."
        }


@mcp.tool()
async def delete_expense(expense_id: int):
    """
    Delete an expense using its expense ID.
    Use list_expenses first if the expense ID is unknown.
    If the database is empty, then say that no expenses exist.
    """

    try:

        conn = await asyncpg.connect(DATABASE_URL)

        try:

            result = await conn.execute(
                """
                DELETE FROM expenses
                WHERE id = $1
                """,
                expense_id
            )

            deleted = int(result.split()[-1])

            if deleted == 0:
                return {
                    "status": "error",
                    "message": "Expense not found"
                }

            return {
                "status": "success",
                "message": "Expense deleted successfully"
            }

        finally:
            await conn.close()

    except Exception:
        traceback.print_exc()

        return {
            "status": "error",
            "message": "Failed to delete expense."
        }


@mcp.resource(
    "expense:///categories",
    mime_type="application/json"
)
def categories():
    """
    Provides the available expense categories.
    Use these categories when adding expenses instead of creating new ones.
    """

    default_categories = {
        "categories": [
            "Food & Dining",
            "Transportation",
            "Shopping",
            "Entertainment",
            "Bills & Utilities",
            "Healthcare",
            "Travel",
            "Education",
            "Business",
            "Other"
        ]
    }

    try:

        with open(CATEGORIES_PATH, "r", encoding="utf-8") as f:
            return f.read()

    except FileNotFoundError:

        return json.dumps(default_categories, indent=4)

    except Exception:

        traceback.print_exc()

        return json.dumps(
            {
                "error": "Unable to load categories"
            },
            indent=4
        )


if __name__ == "__main__":

    asyncio.run(init_db())

    mcp.run(
        transport="http",
        host="0.0.0.0",
        port=8000
    )