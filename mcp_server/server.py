from fastmcp import FastMCP
import os
import json
import sqlite3
import tempfile
import aiosqlite


BASE_DIR = os.path.dirname(__file__)

DB_PATH = os.path.join(tempfile.gettempdir(), "expenses.db")

CATEGORIES_PATH = os.path.join(BASE_DIR, "categories.json")

mcp = FastMCP("ExpenseTracker")


def init_db():
    try:
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

        with sqlite3.connect(DB_PATH) as conn:
            conn.execute("PRAGMA journal_mode=WAL")

            conn.execute("""
                CREATE TABLE IF NOT EXISTS expenses (
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

    except Exception as e:
        print(f"Database initialization error: {e}")
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
    """Add a new expense."""
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
                (date, amount, category, subcategory, note)
            )

            await conn.commit()

            return {
                "status": "success",
                "id": cur.lastrowid,
                "message": "Expense added successfully"
            }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@mcp.tool()
async def list_expenses(
    start_date: str,
    end_date: str
):
    """List expenses between two dates."""

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
                ORDER BY date DESC,id DESC
                """,
                (start_date, end_date)
            )

            rows = await cur.fetchall()

            columns = [d[0] for d in cur.description]

            return [
                dict(zip(columns, row))
                for row in rows
            ]

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@mcp.tool()
async def summarize(
    start_date: str,
    end_date: str,
    category: str | None = None
):
    """Summarize expenses."""

    try:
        async with aiosqlite.connect(DB_PATH) as conn:

            query = """
                SELECT
                    category,
                    SUM(amount) as total_amount,
                    COUNT(*) as count
                FROM expenses
                WHERE date BETWEEN ? AND ?
            """

            params = [start_date, end_date]

            if category:
                query += " AND category=?"
                params.append(category)

            query += """
                GROUP BY category
                ORDER BY total_amount DESC
            """

            cur = await conn.execute(query, params)

            rows = await cur.fetchall()

            columns = [d[0] for d in cur.description]

            return [
                dict(zip(columns, row))
                for row in rows
            ]

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@mcp.tool()
async def delete_expense(expense_id: int):
    """Delete an expense."""

    try:
        async with aiosqlite.connect(DB_PATH) as conn:

            cur = await conn.execute(
                "DELETE FROM expenses WHERE id=?",
                (expense_id,)
            )

            await conn.commit()

            if cur.rowcount == 0:
                return {
                    "status": "error",
                    "message": "Expense not found"
                }

            return {
                "status": "success",
                "message": "Expense deleted successfully"
            }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@mcp.resource(
    "expense:///categories",
    mime_type="application/json"
)
def categories():

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
        return json.dumps(default_categories, indent=2)



if __name__ == "__main__":
    mcp.run(
        transport="http",
        host="0.0.0.0",
        port=8000
    )