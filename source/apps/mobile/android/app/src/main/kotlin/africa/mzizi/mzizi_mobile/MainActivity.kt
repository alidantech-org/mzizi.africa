package africa.mzizi.mzizi_mobile

import android.content.Context
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private val onboardingChannel = "africa.mzizi/onboarding"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, onboardingChannel)
            .setMethodCallHandler { call, result ->
                val preferences = getSharedPreferences("mzizi_mobile", Context.MODE_PRIVATE)
                when (call.method) {
                    "isComplete" -> result.success(preferences.getBoolean("onboarding_complete_v1", false))
                    "markComplete" -> {
                        preferences.edit().putBoolean("onboarding_complete_v1", true).apply()
                        result.success(null)
                    }
                    else -> result.notImplemented()
                }
            }
    }
}
