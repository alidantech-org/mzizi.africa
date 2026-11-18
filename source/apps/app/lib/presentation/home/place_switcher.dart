import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';

/// A bottom sheet that searches for a place and makes it "my place" (or hands it back to compare with).
Future<void> showPlaceSwitcher(
  BuildContext context, {
  String title = 'Choose your place',
  void Function(LocalityLocalityUnit place)? onPick,
}) => showInfoSheet(
  context,
  title: title,
  initial: 0.8,
  builder: (sheet) => _Switcher(
    onPick: (place) async {
      Navigator.of(sheet).pop();
      if (onPick != null) {
        onPick(place);
      } else {
        await UserStore.instance.setPlace(
          place.featureId,
          place.name,
          place.kindCode,
        );
      }
    },
  ),
);

class _Switcher extends StatefulWidget {
  const _Switcher({required this.onPick});
  final void Function(LocalityLocalityUnit) onPick;
  @override
  State<_Switcher> createState() => _SwitcherState();
}

class _SwitcherState extends State<_Switcher> {
  List<LocalityLocalityUnit> _matches = const [];
  Future<void> _search(String q) async {
    if (q.trim().length < 2) return setState(() => _matches = const []);
    final r = await LocalityFeature(MziziApi.connection).searchLocalities(
      input: LocalitySearchInput(query: q.trim(), languageCode: 'en'),
    );
    if (mounted) setState(() => _matches = r.dataOrNull?.places ?? const []);
  }

  @override
  Widget build(BuildContext context) => Column(
    children: [
      TextField(
        autofocus: true,
        onChanged: _search,
        decoration: InputDecoration(
          hintText: 'Search a county, town or ward',
          prefixIcon: MzIcon('search'),
          filled: true,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(32)),
        ),
      ),
      const SizedBox(height: 8),
      for (final m in _matches.take(10))
        ListTile(
          leading: MzIcon('pin'),
          title: Text(m.name),
          subtitle: Text(m.kindLabel),
          onTap: () => widget.onPick(m),
        ),
    ],
  );
}
