package com.surveyapp

import androidx.lifecycle.ViewModel

class SurveyViewModel : ViewModel() {

    val questions = listOf(
        "Як вас звати та яка ваша спеціальність?",
        "Яку мову програмування ви вважаєте найкращою та чому?",
        "Опишіть ваш досвід у розробці програмного забезпечення.",
        "Які інструменти розробника ви використовуєте найчастіше?",
        "Яка ваша мета в IT-сфері на найближчі 3 роки?"
    )

    val answers = MutableList(questions.size) { "" }
    var current = 0

    val isFirst get() = current == 0
    val isLast get() = current == questions.size - 1
    val currentQuestion get() = questions[current]
    val currentAnswer get() = answers[current]
    val total get() = questions.size

    fun saveAnswer(text: String) {
        answers[current] = text.trim()
    }

    fun goNext() { current++ }
    fun goPrev() { current-- }
}
