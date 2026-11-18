import 'package:material_ui/material_ui.dart';
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
  ThemeMode themeMode = ThemeMode.system;
  SharedPreferences? _prefs;

  Future<void> load() async {
    final p = _prefs = await SharedPreferences.getInstance();
    onboarded = p.getBool('onboarded') ?? false;
    placeId = p.getString('placeId');
    placeName = p.getString('placeName');
    placeKind = p.getString('placeKind');
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
    notifyListeners();
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
