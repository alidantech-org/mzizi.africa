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
    final own = (placeKind ?? '').toLowerCase();
    final isBoardUnit = own.endsWith('county') || own.endsWith('constituency');
    if (placeId != null && (boardId == null || (boardId == placeId && !isBoardUnit))) {
      _resolveBoard(placeId!, placeName ?? '', placeKind).then((_) => notifyListeners());
    }
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

  /// Finds the constituency or county that holds [id] (the place itself when it is one) so rankings can place it.
  Future<void> _resolveBoard(String id, String name, String? kind) async {
    final k = (kind ?? '').toLowerCase();
    String bid = id, bname = name, bkind = k.endsWith('county') ? 'county' : 'constituency';
    if (!k.endsWith('county') && !k.endsWith('constituency')) {
      final r = await LocalityFeature(MziziApi.connection).getLocality(featureId: id, input: LocalityPlaceInput(featureId: id));
      final chain = r.dataOrNull?.chain ?? const [];
      final hit = chain.where((u) => u.kindCode.toLowerCase().endsWith('constituency')).lastOrNull ??
          chain.where((u) => u.kindCode.toLowerCase().endsWith('county')).lastOrNull;
      if (hit == null) return; // could not place it; try again next launch
      {
        bid = hit.featureId;
        bname = hit.name;
        bkind = hit.kindCode.toLowerCase().endsWith('county') ? 'county' : 'constituency';
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
}
