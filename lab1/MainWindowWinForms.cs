using System.IO;
using System.Text;

namespace SurveyApp;

public class MainWindowWinForms : Form
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

    private Label _progressLabel = null!;
    private ProgressBar _progressBar = null!;
    private Label _questionLabel = null!;
    private TextBox _answerBox = null!;
    private Button _prevButton = null!;
    private Button _nextButton = null!;
    private Label _statusLabel = null!;
    private Panel _card = null!;

    public MainWindowWinForms()
    {
        _answers = new string[_questions.Length];
        InitializeForm();
        ShowQuestion(0);
    }

    private void InitializeForm()
    {
        Text = "Форма опитування";
        Size = new Size(820, 580);
        MinimumSize = new Size(600, 480);
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(245, 247, 250);
        Font = new Font("Segoe UI", 10f);

        var headerLabel = new Label
        {
            Text = "Опитування",
            Font = new Font("Segoe UI", 20f, FontStyle.Bold),
            ForeColor = Color.FromArgb(30, 30, 30),
            AutoSize = true,
            Location = new Point(40, 28)
        };

        var subLabel = new Label
        {
            Text = "Будь ласка, дайте відповіді на запитання нижче",
            Font = new Font("Segoe UI", 10f),
            ForeColor = Color.FromArgb(100, 100, 100),
            AutoSize = true,
            Location = new Point(40, 68)
        };

        _progressLabel = new Label
        {
            Font = new Font("Segoe UI", 9f),
            ForeColor = Color.FromArgb(100, 100, 100),
            AutoSize = true,
            Anchor = AnchorStyles.Top | AnchorStyles.Right
        };

        _progressBar = new ProgressBar
        {
            Minimum = 0,
            Maximum = _questions.Length,
            Height = 8,
            Style = ProgressBarStyle.Continuous,
            Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
        };

        _card = new Panel
        {
            BackColor = Color.White,
            Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Bottom,
            Padding = new Padding(20)
        };

        _questionLabel = new Label
        {
            Font = new Font("Segoe UI", 11f, FontStyle.Bold),
            ForeColor = Color.FromArgb(30, 30, 30),
            AutoSize = false,
            Dock = DockStyle.Top,
            Height = 50
        };

        _answerBox = new TextBox
        {
            Multiline = true,
            ScrollBars = ScrollBars.Vertical,
            Font = new Font("Segoe UI", 10f),
            BorderStyle = BorderStyle.FixedSingle,
            Dock = DockStyle.Fill,
            BackColor = Color.White
        };

        _card.Controls.Add(_answerBox);
        _card.Controls.Add(_questionLabel);

        _prevButton = new Button
        {
            Text = "← Назад",
            Height = 44,
            Font = new Font("Segoe UI", 10f),
            BackColor = Color.FromArgb(108, 117, 125),
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat,
            Anchor = AnchorStyles.Bottom | AnchorStyles.Left,
            Cursor = Cursors.Hand
        };
        _prevButton.FlatAppearance.BorderSize = 0;
        _prevButton.Click += PrevButton_Click;

        _nextButton = new Button
        {
            Text = "Далі →",
            Height = 44,
            Font = new Font("Segoe UI", 10f),
            BackColor = Color.FromArgb(13, 110, 253),
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat,
            Anchor = AnchorStyles.Bottom | AnchorStyles.Right,
            Cursor = Cursors.Hand
        };
        _nextButton.FlatAppearance.BorderSize = 0;
        _nextButton.Click += NextButton_Click;

        _statusLabel = new Label
        {
            Text = "",
            ForeColor = Color.FromArgb(25, 135, 84),
            Font = new Font("Segoe UI", 9f),
            AutoSize = true,
            Anchor = AnchorStyles.Bottom | AnchorStyles.Left,
            Visible = false
        };

        Controls.AddRange(new Control[]
        {
            headerLabel, subLabel, _progressLabel, _progressBar,
            _card, _prevButton, _nextButton, _statusLabel
        });

        Resize += (s, e) => LayoutControls();
        Load += (s, e) => LayoutControls();
    }

    private void LayoutControls()
    {
        int w = ClientSize.Width;
        int h = ClientSize.Height;
        const int margin = 40;
        const int btnH = 44;
        int btnY = h - margin - btnH;
        int btnW = (w - margin * 2 - 16) / 2;

        _progressLabel.Location = new Point(w - margin - _progressLabel.PreferredWidth, 96);
        _progressBar.Location = new Point(margin, 118);
        _progressBar.Width = w - margin * 2;

        _card.Location = new Point(margin, 140);
        _card.Size = new Size(w - margin * 2, btnY - 152);

        _prevButton.Location = new Point(margin, btnY);
        _prevButton.Width = btnW;

        _nextButton.Width = btnW;
        _nextButton.Location = new Point(margin + btnW + 16, btnY);

        _statusLabel.Location = new Point(margin, btnY - 26);
    }

    private void ShowQuestion(int index)
    {
        _questionLabel.Text = _questions[index];
        _answerBox.Text = _answers[index] ?? string.Empty;
        _answerBox.Focus();

        _progressLabel.Text = $"Питання {index + 1} з {_questions.Length}";
        _progressBar.Value = index + 1;

        _prevButton.Enabled = index > 0;
        _nextButton.Text = index == _questions.Length - 1 ? "Завершити та зберегти" : "Далі →";

        _statusLabel.Visible = false;
    }

    private void PrevButton_Click(object? sender, EventArgs e)
    {
        SaveCurrentAnswer();
        if (_current > 0)
        {
            _current--;
            ShowQuestion(_current);
        }
    }

    private void NextButton_Click(object? sender, EventArgs e)
    {
        SaveCurrentAnswer();

        if (string.IsNullOrWhiteSpace(_answers[_current]))
        {
            MessageBox.Show("Будь ласка, дайте відповідь перед тим, як продовжити.",
                "Відповідь відсутня", MessageBoxButtons.OK, MessageBoxIcon.Warning);
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
        _answers[_current] = _answerBox.Text.Trim();
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

        _statusLabel.Text = $"Збережено: {path}";
        _statusLabel.Visible = true;

        MessageBox.Show($"Дякуємо за участь в опитуванні!\n\nРезультати збережено:\n{path}",
            "Опитування завершено", MessageBoxButtons.OK, MessageBoxIcon.Information);
    }
}
