from datetime import datetime
from pathlib import Path

from PyQt6.QtCore import Qt
from PyQt6.QtGui import QColor, QPalette
from PyQt6.QtWidgets import (
    QFileDialog,
    QHBoxLayout,
    QLabel,
    QMainWindow,
    QMessageBox,
    QProgressBar,
    QPushButton,
    QSizePolicy,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)

from file_saver import save_results

QUESTIONS = [
    "Як вас звати та яка ваша спеціальність?",
    "Яку мову програмування ви вважаєте найкращою та чому?",
    "Опишіть ваш досвід у розробці програмного забезпечення.",
    "Які інструменти розробника ви використовуєте найчастіше?",
    "Яка ваша мета в IT-сфері на найближчі 3 роки?",
]


class SurveyWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self._answers = [""] * len(QUESTIONS)
        self._current = 0
        self._init_ui()
        self._render()

    def _init_ui(self):
        self.setWindowTitle("Форма опитування")
        self.setMinimumSize(620, 480)
        self.resize(680, 520)

        root = QWidget()
        self.setCentralWidget(root)
        root.setStyleSheet("background-color: #f8fafc;")

        outer = QVBoxLayout(root)
        outer.setContentsMargins(36, 32, 36, 28)
        outer.setSpacing(0)

        title = QLabel("Опитування")
        title.setStyleSheet("font-size: 24px; font-weight: 700; color: #1e293b;")
        outer.addWidget(title)

        subtitle = QLabel("Будь ласка, дайте відповіді на запитання нижче")
        subtitle.setStyleSheet("font-size: 13px; color: #64748b; margin-top: 4px;")
        outer.addWidget(subtitle)

        outer.addSpacing(20)

        progress_row = QHBoxLayout()
        progress_row.setContentsMargins(0, 0, 0, 0)
        self._progress_label = QLabel()
        self._progress_label.setStyleSheet("font-size: 12px; color: #64748b;")
        progress_row.addStretch()
        progress_row.addWidget(self._progress_label)
        outer.addLayout(progress_row)

        outer.addSpacing(6)

        self._progress_bar = QProgressBar()
        self._progress_bar.setTextVisible(False)
        self._progress_bar.setFixedHeight(6)
        self._progress_bar.setMaximum(len(QUESTIONS))
        self._progress_bar.setStyleSheet("""
            QProgressBar {
                background-color: #e2e8f0;
                border-radius: 3px;
                border: none;
            }
            QProgressBar::chunk {
                background-color: #2563eb;
                border-radius: 3px;
            }
        """)
        outer.addWidget(self._progress_bar)

        outer.addSpacing(20)

        card = QWidget()
        card.setStyleSheet("""
            QWidget {
                background-color: white;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
            }
        """)
        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(24, 24, 24, 24)
        card_layout.setSpacing(16)

        self._question_label = QLabel()
        self._question_label.setWordWrap(True)
        self._question_label.setStyleSheet("""
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            background: transparent;
            border: none;
        """)
        card_layout.addWidget(self._question_label)

        self._answer_box = QTextEdit()
        self._answer_box.setPlaceholderText("Введіть вашу відповідь...")
        self._answer_box.setFixedHeight(100)
        self._answer_box.setStyleSheet("""
            QTextEdit {
                font-size: 14px;
                color: #1e293b;
                background-color: white;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                padding: 8px 10px;
            }
            QTextEdit:focus {
                border: 1px solid #2563eb;
            }
        """)
        card_layout.addWidget(self._answer_box)

        outer.addWidget(card)
        outer.addSpacing(20)

        btn_row = QHBoxLayout()
        btn_row.setSpacing(12)

        self._prev_btn = QPushButton("← Назад")
        self._prev_btn.setFixedHeight(40)
        self._prev_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self._prev_btn.setStyleSheet(self._btn_style("#64748b", "#475569"))
        self._prev_btn.clicked.connect(self._on_prev)

        self._next_btn = QPushButton("Далі →")
        self._next_btn.setFixedHeight(40)
        self._next_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self._next_btn.setStyleSheet(self._btn_style("#2563eb", "#1d4ed8"))
        self._next_btn.clicked.connect(self._on_next)

        btn_row.addWidget(self._prev_btn)
        btn_row.addWidget(self._next_btn)
        outer.addLayout(btn_row)

        outer.addSpacing(12)

        self._status_label = QLabel()
        self._status_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self._status_label.setStyleSheet("font-size: 12px; color: #16a34a;")
        outer.addWidget(self._status_label)

    def _btn_style(self, bg: str, hover: str) -> str:
        return f"""
            QPushButton {{
                background-color: {bg};
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                padding: 0 20px;
            }}
            QPushButton:hover:enabled {{
                background-color: {hover};
            }}
            QPushButton:disabled {{
                background-color: #94a3b8;
            }}
        """

    def _render(self):
        self._question_label.setText(QUESTIONS[self._current])
        self._answer_box.setPlainText(self._answers[self._current])
        self._answer_box.setFocus()

        self._progress_label.setText(
            f"Питання {self._current + 1} з {len(QUESTIONS)}"
        )
        self._progress_bar.setValue(self._current + 1)

        self._prev_btn.setEnabled(self._current > 0)

        is_last = self._current == len(QUESTIONS) - 1
        self._next_btn.setText("Завершити та зберегти" if is_last else "Далі →")

        self._status_label.setText("")

    def _save_current_answer(self):
        self._answers[self._current] = self._answer_box.toPlainText().strip()

    def _on_prev(self):
        self._save_current_answer()
        self._current -= 1
        self._render()

    def _on_next(self):
        self._save_current_answer()

        if not self._answers[self._current]:
            QMessageBox.warning(
                self,
                "Відповідь відсутня",
                "Будь ласка, дайте відповідь перед тим, як продовжити.",
            )
            return

        if self._current < len(QUESTIONS) - 1:
            self._current += 1
            self._render()
        else:
            self._save_to_file()

    def _save_to_file(self):
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        default_path = str(Path.home() / "Desktop" / f"survey_{timestamp}.txt")

        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Зберегти результати опитування",
            default_path,
            "Текстові файли (*.txt)",
        )

        if not file_path:
            return

        save_results(QUESTIONS, self._answers, file_path)

        self._status_label.setText(f"Збережено: {file_path}")
        QMessageBox.information(
            self,
            "Опитування завершено",
            f"Дякуємо за участь в опитуванні!\n\nРезультати збережено:\n{file_path}",
        )
