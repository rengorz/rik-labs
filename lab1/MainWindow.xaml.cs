using System.IO;
using System.Text;
using System.Windows;
using System.Windows.Controls;

namespace SurveyApp;

public partial class MainWindow : Window
{
    private readonly string[] _questions =
    [
        "Як вас звати та яка ваша спеціальність?",
        "Яку мову програмування ви вважаєте найкращою та чому?",
        "Опишіть ваш досвід у розробці програмного забезпечення.",
        "Які інструменти розробника ви використовуєте найчастіше?",
        "Яка ваша мета в IT-сфері на найближчі 3 роки?"
    ];

    private readonly string[] _answers;
    private int _current = 0;

    public MainWindow()
    {
        InitializeComponent();
        _answers = new string[_questions.Length];
        ShowQuestion(_current);
    }

    private void ShowQuestion(int index)
    {
        QuestionText.Text = _questions[index];
        AnswerBox.Text = _answers[index] ?? string.Empty;
        AnswerBox.Focus();

        ProgressLabel.Text = $"Питання {index + 1} з {_questions.Length}";

        double fraction = (double)(index + 1) / _questions.Length;
        ProgressBar.Width = fraction * (ActualWidth - 64);

        PrevButton.IsEnabled = index > 0;

        bool isLast = index == _questions.Length - 1;
        NextButton.Content = isLast ? "Завершити та зберегти" : "Далі →";

        StatusLabel.Visibility = Visibility.Collapsed;
    }

    private void PrevButton_Click(object sender, RoutedEventArgs e)
    {
        SaveCurrentAnswer();
        if (_current > 0)
        {
            _current--;
            ShowQuestion(_current);
        }
    }

    private void NextButton_Click(object sender, RoutedEventArgs e)
    {
        SaveCurrentAnswer();

        if (string.IsNullOrWhiteSpace(_answers[_current]))
        {
            MessageBox.Show("Будь ласка, дайте відповідь перед тим, як продовжити.",
                "Відповідь відсутня", MessageBoxButton.OK, MessageBoxImage.Warning);
            return;
        }

        if (_current < _questions.Length - 1)
        {
            _current++;
            ShowQuestion(_current);
        }
        else
        {
            SaveToFile();
        }
    }

    private void SaveCurrentAnswer()
    {
        _answers[_current] = AnswerBox.Text.Trim();
    }

    private void SaveToFile()
    {
        string desktop = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
        string timestamp = DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss");
        string path = Path.Combine(desktop, $"survey_{timestamp}.txt");

        var sb = new StringBuilder();
        sb.AppendLine("=== РЕЗУЛЬТАТИ ОПИТУВАННЯ ===");
        sb.AppendLine($"Дата: {DateTime.Now:dd.MM.yyyy HH:mm}");
        sb.AppendLine(new string('=', 40));
        sb.AppendLine();

        for (int i = 0; i < _questions.Length; i++)
        {
            sb.AppendLine($"Питання {i + 1}: {_questions[i]}");
            sb.AppendLine($"Відповідь: {_answers[i]}");
            sb.AppendLine();
        }

        File.WriteAllText(path, sb.ToString(), Encoding.UTF8);

        StatusLabel.Text = $"Збережено: {path}";
        StatusLabel.Visibility = Visibility.Visible;

        MessageBox.Show($"Дякуємо за участь в опитуванні!\n\nРезультати збережено:\n{path}",
            "Опитування завершено", MessageBoxButton.OK, MessageBoxImage.Information);
    }

    protected override void OnRenderSizeChanged(SizeChangedInfo sizeInfo)
    {
        base.OnRenderSizeChanged(sizeInfo);
        double fraction = (double)(_current + 1) / _questions.Length;
        ProgressBar.Width = Math.Max(0, fraction * (ActualWidth - 64));
    }
}
