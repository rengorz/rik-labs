import sys
from PyQt6.QtWidgets import QApplication
from survey_window import SurveyWindow


def main():
    app = QApplication(sys.argv)
    app.setApplicationName("Форма опитування")
    window = SurveyWindow()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
