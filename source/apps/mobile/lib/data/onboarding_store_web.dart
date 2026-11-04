import 'package:web/web.dart' as web;

const _key = 'mzizi.onboarding.complete.v1';

Future<bool> isOnboardingComplete() async =>
    web.window.localStorage.getItem(_key) == 'true';

Future<void> markOnboardingComplete() async =>
    web.window.localStorage.setItem(_key, 'true');
