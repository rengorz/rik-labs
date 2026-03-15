package com.surveyapp

import android.content.Context
import java.io.File
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

object FileSaver {

    fun save(context: Context, questions: List<String>, answers: List<String>): String {
        val timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"))
        val file = File(context.getExternalFilesDir(null), "survey_$timestamp.txt")

        val lines = mutableListOf(
            "=== РЕЗУЛЬТАТИ ОПИТУВАННЯ ===",
            "Дата: ${LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"))}",
            "=".repeat(40),
            ""
        )

        questions.forEachIndexed { i, question ->
            lines.add("Питання ${i + 1}: $question")
            lines.add("Відповідь: ${answers[i]}")
            lines.add("")
        }

        file.writeText(lines.joinToString("\n"), Charsets.UTF_8)
        return file.absolutePath
    }
}
