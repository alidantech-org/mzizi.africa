import 'package:flutter_test/flutter_test.dart';
import 'package:mzizi_app/presentation/explore/explore_catalog.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/saved/saved_store.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'support/copy.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('tr', () {
    test(
      'returns the word of the installed copy and falls back to the key',
      () {
        installCopy('sw');
        expect(tr('sw', 'home'), 'Mwanzo');
        installCopy('en');
        expect(tr('en', 'home'), 'Home');
        expect(tr('en', 'no-such-key'), 'no-such-key');
      },
    );

    test('has every English word in Swahili', () {
      installCopy('en');
      final english = {
        for (final key in [
          'likeLeader',
          'savePlace',
          'saved',
          'mapTitle',
          'useLocation',
          'sources',
        ])
          key: tr('en', key),
      };
      installCopy('sw');
      for (final key in [
        'likeLeader',
        'savePlace',
        'saved',
        'mapTitle',
        'useLocation',
        'sources',
      ]) {
        expect(tr('sw', key), isNot(english[key]), reason: key);
      }
    });
  });

  test('every Explore card has Swahili for its title, text and tags', () {
    installCopy('sw');
    for (final e in exploreCatalog) {
      for (final text in [e.title, e.body, ...e.finds]) {
        expect(hasSwahili(text), isTrue, reason: text);
      }
    }
  });

  group('SavedNotifier', () {
    setUp(() => SharedPreferences.setMockInitialValues({}));

    const place = SavedItem(id: 'p1', title: 'Karura', subtitle: 'Ward');
    const spot = SavedItem(
      id: '-1.2676,36.8108',
      title: 'Karura',
      latitude: -1.2676,
      longitude: 36.8108,
    );

    test('toggles an item on and off', () {
      final notifier = SavedNotifier();
      expect(notifier.has(SavedKind.place, 'p1'), isFalse);
      notifier.toggle(SavedKind.place, place);
      expect(notifier.has(SavedKind.place, 'p1'), isTrue);
      expect(notifier.state.count, 1);
      notifier.toggle(SavedKind.place, place);
      expect(notifier.has(SavedKind.place, 'p1'), isFalse);
    });

    test('keeps the kinds apart and persists across instances', () async {
      final first = SavedNotifier();
      first.toggle(SavedKind.place, place);
      first.toggle(SavedKind.spot, spot);
      await Future<void>.delayed(const Duration(milliseconds: 50));
      final second = SavedNotifier();
      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(second.state.places.single.title, 'Karura');
      expect(second.state.spots.single.latitude, -1.2676);
      expect(second.state.leaders, isEmpty);
    });
  });
}
