from fastmcp import FastMCP
import os
import json
import sqlite3
# import tempfile
import traceback
import aiosqlite



BASE_DIR = os.path.dirname(__file__)

# Database stored in system temp directory
DB_PATH = os.path.join(BASE_DIR, "expenses.db")
CATEGORIES_PATH = os.path.join(BASE_DIR, "categories.json")

mcp = FastMCP("ExpenseTracker")


def init_db():
    try:
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

        with sqlite3.connect(DB_PATH) as conn:

            conn.execute("PRAGMA journal_mode=WAL")

            conn.execute("""
                CREATE TABLE IF NOT EXISTS expenses(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT NOT NULL,
                    amount REAL NOT NULL,
                    category TEXT NOT NULL,
                    subcategory TEXT DEFAULT '',
                    note TEXT DEFAULT ''
                )
            """)

            conn.commit()

        print("Database initialized successfully")

    except Exception:
        traceback.print_exc()
        raise


init_db()


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

    print("Tool called!")
    print(date, amount, category, subcategory, note)

    try:

        async with aiosqlite.connect(DB_PATH) as conn:

            cur = await conn.execute(
                """
                INSERT INTO expenses
                (date, amount, category, subcategory, note)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    date,
                    amount,
                    category,
                    subcategory,
                    note
                )
            )

            await conn.commit()

            print(f"Expense saved successfully. ID = {cur.lastrowid}")
            print(f"Database Location: {DB_PATH}")

            return {
                "status": "success",
                "id": cur.lastrowid,
                "message": "Expense added successfully"
            }

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
"""

    try:

        async with aiosqlite.connect(DB_PATH) as conn:

            cur = await conn.execute(
                """
                SELECT
                    id,
                    date,
                    amount,
                    category,
                    subcategory,
                    note
                FROM expenses
                WHERE date BETWEEN ? AND ?
                ORDER BY date DESC, id DESC
                """,
                (
                    start_date,
                    end_date
                )
            )

            rows = await cur.fetchall()

            columns = [d[0] for d in cur.description]

            await cur.close()

            return [
                dict(zip(columns, row))
                for row in rows
            ]

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
"""

    try:

        async with aiosqlite.connect(DB_PATH) as conn:

            query = """
                SELECT
                    category,
                    SUM(amount) AS total_amount,
                    COUNT(*) AS count
                FROM expenses
                WHERE date BETWEEN ? AND ?
            """

            params = [start_date, end_date]

            if category:
                query += " AND category = ?"
                params.append(category)

            query += """
                GROUP BY category
                ORDER BY total_amount DESC
            """

            cur = await conn.execute(query, params)

            rows = await cur.fetchall()

            columns = [d[0] for d in cur.description]

            await cur.close()

            return [
                dict(zip(columns, row))
                for row in rows
            ]

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
"""

    try:

        async with aiosqlite.connect(DB_PATH) as conn:

            cur = await conn.execute(
                "DELETE FROM expenses WHERE id=?",
                (expense_id,)
            )

            await conn.commit()

            print(f"Deleted expense ID: {expense_id}")

            if cur.rowcount == 0:
                return {
                    "status": "error",
                    "message": "Expense not found"
                }

            return {
                "status": "success",
                "message": "Expense deleted successfully"
            }

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

    mcp.run(
        transport="http",
        host="0.0.0.0",
        port=8000
    )