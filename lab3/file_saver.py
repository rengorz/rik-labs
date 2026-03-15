from datetime import datetime
from pathlib import Path


def save_results(questions: list[str], answers: list[str], file_path: str) -> None:
    lines = [
        "=== РЕЗУЛЬТАТИ ОПИТУВАННЯ ===",
        f"Дата: {datetime.now().strftime('%d.%m.%Y %H:%M')}",
        "=" * 40,
        "",
    ]
    for i, (question, answer) in enumerate(zip(questions, answers)):
        lines.append(f"Питання {i + 1}: {question}")
        lines.append(f"Відповідь: {answer}")
        lines.append("")

    Path(file_path).write_text("\n".join(lines), encoding="utf-8")
