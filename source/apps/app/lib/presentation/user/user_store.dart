import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// What the visitor chose on this device: whether onboarding is done, "my place" and the colour mode.
/// Kept on the device only. A plain notifier so the router can listen to it.
class UserStore extends ChangeNotifier {
  UserStore._();
  static final UserStore instance = UserStore._();

  bool onboarded = false;
  String? placeId;
  String? placeName;
  String? placeKind;

  /// The constituency (or county) the place sits in: the unit it is ranked as part of on the leaderboards.
  String? boardId;
  String? boardName;
  String boardKindCode = 'constituency';
  ThemeMode themeMode = ThemeMode.system;
  String language = 'en';
  SharedPreferences? _prefs;

  Future<void> load() async {
    final p = _prefs = await SharedPreferences.getInstance();
    onboarded = p.getBool('onboarded') ?? false;
    placeId = p.getString('placeId');
    placeName = p.getString('placeName');
    placeKind = p.getString('placeKind');
    boardId = p.getString('boardId');
    boardName = p.getString('boardName');
    boardKindCode = p.getString('boardKind') ?? 'constituency';
    if (placeId != null) _validatePlace(placeId!);
    final own = (placeKind ?? '').toLowerCase().split('.').last;
    final isBoardUnit = own == 'county' || own == 'constituency';
    if (placeId != null &&
        (boardId == null || (boardId == placeId && !isBoardUnit))) {
      _resolveBoard(
        placeId!,
        placeName ?? '',
        placeKind,
      ).then((_) => notifyListeners());
    }
    language = p.getString('language') ?? 'en';
    themeMode = switch (p.getString('themeMode')) {
      'light' => ThemeMode.light,
      'dark' => ThemeMode.dark,
      _ => ThemeMode.system,
    };
  }

  Future<void> setPlace(String id, String name, String? kind) async {
    placeId = id;
    placeName = name;
    placeKind = kind;
    await _prefs?.setString('placeId', id);
    await _prefs?.setString('placeName', name);
    if (kind != null) await _prefs?.setString('placeKind', kind);
    boardId = null;
    boardName = null;
    notifyListeners();
    await _resolveBoard(id, name, kind);
    notifyListeners();
  }

  /// Forgets a saved place the data no longer knows (the data set was rebuilt), so Home asks for one again.
  Future<void> _validatePlace(String id) async {
    final r = await LocalityFeature(
      MziziApi.connection,
    ).getLocality(featureId: id);
    if (r.dataOrNull == null && r.message.contains('No such place')) {
      await clearPlace();
    }
  }

  /// Finds the constituency or county that holds [id] (the place itself when it is one) so rankings can place it.
  Future<void> _resolveBoard(String id, String name, String? kind) async {
    final k = (kind ?? '').toLowerCase().split('.').last;
    String bid = id,
        bname = name,
        bkind = k == 'county' ? 'county' : 'constituency';
    if (k != 'county' && k != 'constituency') {
      final r = await LocalityFeature(
        MziziApi.connection,
      ).getLocality(featureId: id);
      final chain = r.dataOrNull?.chain ?? const [];
      final hit =
          chain
              .where(
                (u) =>
                    u.kindCode.toLowerCase().split('.').last == 'constituency',
              )
              .lastOrNull ??
          chain
              .where(
                (u) => u.kindCode.toLowerCase().split('.').last == 'county',
              )
              .lastOrNull;
      if (hit == null) return; // could not place it; try again next launch
      {
        bid = hit.featureId;
        bname = hit.name;
        bkind = hit.kindCode.toLowerCase().split('.').last == 'county'
            ? 'county'
            : 'constituency';
      }
    }
    boardId = bid;
    boardName = bname;
    boardKindCode = bkind;
    await _prefs?.setString('boardId', bid);
    await _prefs?.setString('boardName', bname);
    await _prefs?.setString('boardKind', bkind);
  }

  Future<void> finishOnboarding() async {
    onboarded = true;
    await _prefs?.setBool('onboarded', true);
    notifyListeners();
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    themeMode = mode;
    await _prefs?.setString('themeMode', mode.name);
    notifyListeners();
  }

  Future<void> setLanguage(String code) async {
    language = code;
    await _prefs?.setString('language', code);
    notifyListeners();
  }

  /// Forgets "my place" (Home then asks for one again).
  Future<void> clearPlace() async {
    placeId = placeName = placeKind = boardId = boardName = null;
    boardKindCode = 'constituency';
    for (final k in [
      'placeId',
      'placeName',
      'placeKind',
      'boardId',
      'boardName',
      'boardKind',
    ]) {
      await _prefs?.remove(k);
    }
    notifyListeners();
  }

  /// Shows the welcome screens again on the next navigation.
  Future<void> resetOnboarding() async {
    onboarded = false;
    await _prefs?.setBool('onboarded', false);
    notifyListeners();
  }
}
