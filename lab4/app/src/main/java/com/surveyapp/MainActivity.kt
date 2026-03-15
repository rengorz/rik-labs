package com.surveyapp

import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.surveyapp.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val vm: SurveyViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.progressBar.max = vm.total

        binding.btnPrev.setOnClickListener {
            vm.saveAnswer(binding.etAnswer.text.toString())
            vm.goPrev()
            render()
        }

        binding.btnNext.setOnClickListener {
            vm.saveAnswer(binding.etAnswer.text.toString())

            if (vm.answers[vm.current].isEmpty()) {
                AlertDialog.Builder(this)
                    .setTitle(getString(R.string.dialog_title))
                    .setMessage(getString(R.string.warning_empty))
                    .setPositiveButton("OK", null)
                    .show()
                return@setOnClickListener
            }

            if (!vm.isLast) {
                vm.goNext()
                render()
            } else {
                val path = FileSaver.save(this, vm.questions, vm.answers)
                binding.tvStatus.text = "Збережено: $path"
                binding.tvStatus.visibility = View.VISIBLE
                AlertDialog.Builder(this)
                    .setTitle(getString(R.string.done_title))
                    .setMessage(getString(R.string.done_message, path))
                    .setPositiveButton("OK", null)
                    .show()
            }
        }

        render()
    }

    private fun render() {
        binding.tvQuestion.text = vm.currentQuestion
        binding.etAnswer.setText(vm.currentAnswer)
        binding.etAnswer.requestFocus()

        binding.tvProgress.text = "Питання ${vm.current + 1} з ${vm.total}"
        binding.progressBar.progress = vm.current + 1

        binding.btnPrev.isEnabled = !vm.isFirst
        binding.btnNext.text = if (vm.isLast) getString(R.string.btn_finish)
                               else getString(R.string.btn_next)

        binding.tvStatus.visibility = View.INVISIBLE
    }
}
