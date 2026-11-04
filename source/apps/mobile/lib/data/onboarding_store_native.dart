import 'package:flutter/services.dart';

const _channel = MethodChannel('africa.mzizi/onboarding');

Future<bool> isOnboardingComplete() async =>
    await _channel.invokeMethod<bool>('isComplete') ?? false;

Future<void> markOnboardingComplete() =>
    _channel.invokeMethod<void>('markComplete');
