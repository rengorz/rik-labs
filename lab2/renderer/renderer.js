'use strict';

const QUESTIONS = [
  'Як вас звати та яка ваша спеціальність?',
  'Яку мову програмування ви вважаєте найкращою та чому?',
  'Опишіть ваш досвід у розробці програмного забезпечення.',
  'Які інструменти розробника ви використовуєте найчастіше?',
  'Яка ваша мета в IT-сфері на найближчі 3 роки?',
];

const answers = new Array(QUESTIONS.length).fill('');
let current = 0;

const questionText  = document.getElementById('questionText');
const answerBox     = document.getElementById('answerBox');
const progressLabel = document.getElementById('progressLabel');
const progressFill  = document.getElementById('progressFill');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const statusMsg     = document.getElementById('statusMsg');

function render() {
  questionText.textContent = QUESTIONS[current];
  answerBox.value = answers[current];
  answerBox.focus();

  progressLabel.textContent = `Питання ${current + 1} з ${QUESTIONS.length}`;
  progressFill.style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;

  prevBtn.disabled = current === 0;
  nextBtn.textContent = current === QUESTIONS.length - 1 ? 'Завершити та зберегти' : 'Далі →';
  statusMsg.textContent = '';
}

function saveCurrentAnswer() {
  answers[current] = answerBox.value.trim();
}

prevBtn.addEventListener('click', () => {
  saveCurrentAnswer();
  current--;
  render();
});

nextBtn.addEventListener('click', async () => {
  saveCurrentAnswer();

  if (!answers[current]) {
    answerBox.style.borderColor = '#ef4444';
    setTimeout(() => (answerBox.style.borderColor = ''), 1200);
    return;
  }

  if (current < QUESTIONS.length - 1) {
    current++;
    render();
    return;
  }

  nextBtn.disabled = true;
  nextBtn.textContent = 'Збереження...';

  const results = QUESTIONS.map((question, i) => ({ question, answer: answers[i] }));
  const { success, filePath } = await window.surveyAPI.saveResults(results);

  if (success) {
    statusMsg.textContent = `Збережено: ${filePath}`;
  } else {
    statusMsg.style.color = '#64748b';
    statusMsg.textContent = 'Збереження скасовано.';
  }

  nextBtn.disabled = false;
  nextBtn.textContent = 'Завершити та зберегти';
});

render();
