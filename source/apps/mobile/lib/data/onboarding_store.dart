import 'onboarding_store_native.dart'
    if (dart.library.js_interop) 'onboarding_store_web.dart'
    as platform_store;

class OnboardingStore {
  const OnboardingStore();

  Future<bool> get isComplete => platform_store.isOnboardingComplete();

  Future<void> complete() => platform_store.markOnboardingComplete();
}
