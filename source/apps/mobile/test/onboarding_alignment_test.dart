import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mzizi_mobile/screens/onboarding_screen.dart';

void main() {
  testWidgets('all onboarding headings and descriptions are centered', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      MaterialApp(home: OnboardingScreen(onComplete: () {})),
    );

    void expectCentered(String title, String subtitle) {
      final titleFinder = find.text(title);
      final subtitleFinder = find.text(subtitle);
      expect(titleFinder, findsOneWidget);
      expect(subtitleFinder, findsOneWidget);
      expect(tester.widget<Text>(titleFinder).textAlign, TextAlign.center);
      expect(tester.widget<Text>(subtitleFinder).textAlign, TextAlign.center);
      expect(
        (tester.getCenter(titleFinder).dx - 195).abs(),
        lessThan(2),
      );
      expect(
        (tester.getCenter(subtitleFinder).dx - 195).abs(),
        lessThan(2),
      );
    }

    expectCentered(
      'Understand Kenya.\nBe part of it.',
      'Your guide to Kenya’s governance, public resources and more.',
    );
    expect(
      tester.widget<Text>(find.text('Mzizi.')).textAlign,
      TextAlign.center,
    );

    void expectCenteredFeatureLabels(List<String> labels) {
      for (final label in labels) {
        final finder = find.text(label);
        expect(finder, findsOneWidget);
        expect(tester.widget<Text>(finder).textAlign, TextAlign.center);
        expect(
          (tester.getCenter(finder).dx - 195).abs(),
          lessThan(2),
        );
      }
    }

    await tester.tap(find.text('Get Started'));
    await tester.pumpAndSettle();
    expectCentered(
      'Explore Kenya',
      'Discover counties, government institutions, and public spending.',
    );
    expectCenteredFeatureLabels([
      'Find information easily',
      'Promote transparency',
      'Be an informed citizen',
    ]);

    await tester.tap(find.text('Next'));
    await tester.pumpAndSettle();
    expectCentered(
      'Stay in the know',
      'Get updates on governance, projects and news across Kenya.',
    );
    expectCenteredFeatureLabels([
      'Personalised updates',
      'Save your interests',
      'Follow institutions',
    ]);
    expect(tester.takeException(), isNull);
  });
}
